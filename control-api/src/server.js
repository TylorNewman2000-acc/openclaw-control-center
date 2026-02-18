import express from 'express';
import dotenv from 'dotenv';
import { WebSocket } from 'ws';
import { Octokit } from '@octokit/rest';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

const app = express();
app.use(express.json());

const PORT = Number(process.env.CONTROL_API_PORT || 8780);
const BIND = process.env.CONTROL_API_BIND || '127.0.0.1';

const GATEWAY_WS = process.env.OPENCLAW_GATEWAY_WS || 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';

const octokit = GITHUB_TOKEN ? new Octokit({ auth: GITHUB_TOKEN }) : null;

/**
 * Gateway connection state (best-effort)
 */
let gatewayConnected = false;
let lastGatewayMessageTs = null;
let wsClient = null;
let wsBackoffMs = 1000;

function connectGateway() {
  if (!GATEWAY_TOKEN) {
    // Don’t even try; keep state false.
    gatewayConnected = false;
    return;
  }

  try {
    const headers = {
      // OpenClaw gateway uses token auth; for ws, we pass it as a header.
      Authorization: `Bearer ${GATEWAY_TOKEN}`,
    };

    wsClient = new WebSocket(GATEWAY_WS, { headers });

    wsClient.on('open', () => {
      gatewayConnected = true;
      wsBackoffMs = 1000;
    });

    wsClient.on('message', () => {
      lastGatewayMessageTs = new Date().toISOString();
    });

    wsClient.on('close', () => {
      gatewayConnected = false;
      wsClient = null;
      setTimeout(connectGateway, wsBackoffMs);
      wsBackoffMs = Math.min(wsBackoffMs * 2, 30000);
    });

    wsClient.on('error', () => {
      // error will usually be followed by close
    });
  } catch {
    gatewayConnected = false;
    wsClient = null;
    setTimeout(connectGateway, wsBackoffMs);
    wsBackoffMs = Math.min(wsBackoffMs * 2, 30000);
  }
}

connectGateway();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({
    gateway_url: GATEWAY_WS,
    gateway_connected: gatewayConnected,
    last_gateway_message_timestamp: lastGatewayMessageTs,
    github_ok: !!(octokit && GITHUB_OWNER && GITHUB_REPO),
    repo: GITHUB_OWNER && GITHUB_REPO ? `${GITHUB_OWNER}/${GITHUB_REPO}` : null,
    server_time: new Date().toISOString(),
  });
});

app.get('/tasks', async (req, res) => {
  if (!octokit || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.json({ items: [], github_ok: false });
  }

  try {
    const stateFilter = req.query.state || 'open';
    const issues = await octokit.issues.listForRepo({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: stateFilter === 'all' ? 'all' : stateFilter,
      per_page: 50,
      sort: 'updated',
      direction: 'desc',
    });

    res.json({ 
      items: issues.data.map(i => ({ 
        id: i.number, 
        title: i.title, 
        url: i.html_url, 
        state: i.state,
        created_at: i.created_at,
        updated_at: i.updated_at
      })),
      github_ok: true
    });
  } catch (error) {
    console.error('GitHub API error (tasks):', error.message);
    res.json({ 
      items: [], 
      github_ok: false,
      error: { message: error.message }
    });
  }
});

app.get('/cursor-runs', async (_req, res) => {
  if (!octokit || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.json({ items: [], github_ok: false });
  }

  try {
    const prs = await octokit.pulls.list({ owner: GITHUB_OWNER, repo: GITHUB_REPO, state: 'all', per_page: 30 });

    const results = [];
    for (const pr of prs.data) {
      const comments = await octokit.issues.listComments({ owner: GITHUB_OWNER, repo: GITHUB_REPO, issue_number: pr.number, per_page: 50 });
      for (const c of comments.data) {
        const body = c.body || '';
        const matches = [...body.matchAll(/\b(bcId|bcid)\b\s*[:=]\s*([A-Za-z0-9_-]{6,})/g)];
        for (const m of matches) {
          const bcId = m[2];
          const cursor_url = `https://cursor.sh/agent/${bcId}`;
          results.push({ 
            bcId, 
            cursor_url,
            pr_url: pr.html_url,
            pr_title: pr.title,
            updated_at: c.updated_at
          });
        }
      }
    }

    res.json({ items: results.slice(0, 50), github_ok: true });
  } catch (error) {
    console.error('GitHub API error (cursor-runs):', error.message);
    res.json({ 
      items: [], 
      github_ok: false,
      error: { message: error.message }
    });
  }
});

app.post('/tasks/cursor', async (req, res) => {
  if (!octokit || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(400).json({ error: 'GitHub not configured' });
  }

  const { repo, title, body } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  try {
    // 1) Create issue
    const issue = await octokit.issues.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: `[cursor] ${title}`,
      body: `Target repo: ${repo || '(unspecified)'}\n\n${body}`,
    });

    // 2) Create a stub branch + PR
    const repoInfo = await octokit.repos.get({ owner: GITHUB_OWNER, repo: GITHUB_REPO });
    const defaultBranch = repoInfo.data.default_branch;

    const baseRef = await octokit.git.getRef({ owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `heads/${defaultBranch}` });
    const baseSha = baseRef.data.object.sha;

    const branchName = `cursor/${issue.data.number}-${Date.now()}`;
    await octokit.git.createRef({ owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `refs/heads/${branchName}`, sha: baseSha });

    // Create a tiny commit by creating/updating a file via contents API
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: `tasks/${issue.data.number}.md`,
      message: `chore: cursor task ${issue.data.number}`,
      content: Buffer.from(`# Cursor Task ${issue.data.number}\n\n${title}\n`).toString('base64'),
      branch: branchName,
    });

    const pr = await octokit.pulls.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: `Cursor task: ${title}`,
      head: branchName,
      base: defaultBranch,
      body: `Closes #${issue.data.number}\n\n${body}`,
    });

    // 3) @cursor comment
    await octokit.issues.createComment({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: pr.data.number,
      body: `@cursor please pick this up.\n\nIssue: ${issue.data.html_url}`,
    });

    res.json({ issue_url: issue.data.html_url, pr_url: pr.data.html_url });
  } catch (error) {
    console.error('GitHub API error (create task):', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Global error handler - ensure JSON responses
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: { 
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    } 
  });
});

app.listen(PORT, BIND, () => {
  console.log(`control-api listening on http://${BIND}:${PORT}`);
});
