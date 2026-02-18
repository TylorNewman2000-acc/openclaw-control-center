import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';

async function getJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

function StatusCard({ title, status, statusText, lastUpdate, icon }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-zinc-500 mb-2">{title}</div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={status === 'connected' || status === 'ok' ? 'success' : 'danger'}>
                {statusText}
              </Badge>
            </div>
            {lastUpdate && (
              <div className="text-xs text-zinc-500 mt-2">
                Last update: {formatTimestamp(lastUpdate)}
              </div>
            )}
          </div>
          {icon && (
            <div className="text-zinc-400">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function GatewayIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export default async function HomePage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const info = await getJSON(`${base}/`);
  const tasks = await getJSON(`${base}/tasks`);
  const runs = await getJSON(`${base}/cursor-runs`);

  if (info.error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h1>
        <Card>
          <CardContent>
            <ErrorState 
              title="Unable to connect to control API"
              message={`Error: ${info.error}`}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const openTasks = tasks.items?.filter(t => t.state === 'open').length || 0;
  const recentRuns = runs.items?.slice(0, 5) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/create">
            <Button variant="primary">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Gateway"
          status={info.gateway_connected ? 'connected' : 'disconnected'}
          statusText={info.gateway_connected ? 'Connected' : 'Disconnected'}
          lastUpdate={info.last_gateway_message_timestamp}
          icon={<GatewayIcon />}
        />
        
        <StatusCard
          title="GitHub"
          status={info.github_ok ? 'ok' : 'error'}
          statusText={info.github_ok ? 'Configured' : 'Not configured'}
          lastUpdate={info.repo ? null : null}
          icon={<GitHubIcon />}
        />

        <Card>
          <CardContent>
            <div className="text-sm font-medium text-zinc-500 mb-2">Tasks</div>
            <div className="text-3xl font-bold text-zinc-900 mb-1">{openTasks}</div>
            <div className="text-xs text-zinc-500">Open tasks</div>
            <Link href="/tasks" className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
              View all →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm font-medium text-zinc-500 mb-2">Cursor Runs</div>
            <div className="text-3xl font-bold text-zinc-900 mb-1">{runs.items?.length || 0}</div>
            <div className="text-xs text-zinc-500">Recent runs</div>
            <Link href="/cursor-runs" className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
              View all →
            </Link>
          </CardContent>
        </Card>
      </div>

      {info.repo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GitHubIcon />
              <span className="font-mono text-sm">{info.repo}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Cursor Runs</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRuns.length === 0 ? (
            <div className="text-sm text-zinc-500 text-center py-8">
              No cursor runs found
            </div>
          ) : (
            <div className="space-y-3">
              {recentRuns.map((run, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <div className="flex-1">
                    <a 
                      href={run.cursor_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {run.bcId}
                    </a>
                    {run.pr_title && (
                      <div className="text-xs text-zinc-500 mt-1">{run.pr_title}</div>
                    )}
                  </div>
                  {run.pr_url && (
                    <a 
                      href={run.pr_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-zinc-700"
                    >
                      View PR →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
