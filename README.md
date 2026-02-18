# OpenClaw Control Center (Custom)

Custom, minimal control center for OpenClaw (no Studio).

## Architecture
- `dashboard/` — Next.js (mobile-first UI)
- `control-api/` — Node/Express API that talks to:
  - OpenClaw Gateway locally (`ws://127.0.0.1:18789`) using the gateway token server-side
  - GitHub API (token server-side)
- `docker-compose.yml` — runs both services for VPS testing (localhost-bound)

## Features

### Dashboard UI (mobile-first)
- **Home page** — 4 cards showing:
  - OpenClaw Gateway status (connected/disconnected + last message time)
  - GitHub task summary (# open issues)
  - Recent Cursor runs (last 5 bcIds with links)
  - Quick actions (Create Task button)
- **/tasks** — Lists GitHub issues with state, link, and updated time
- **/cursor-runs** — Lists recent Cursor agent bcIds with links to cursor.com/agents
- **/create** — Create new Cursor tasks (creates issue + PR + @cursor comment)

### Control API
- `GET /` — Returns gateway_connected, last_gateway_message_timestamp, github_ok, repo, server_time
- `GET /tasks` — Returns structured list of GitHub issues (title, url, state, updated_at)
- `GET /cursor-runs` — Returns bcIds found in PR comments with cursor_url and pr_url
- `POST /tasks/cursor` — Creates issue + stub PR + @cursor comment

## Quick start (VPS)
```bash
cp .env.example .env
# edit .env (do NOT commit)
# Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO for full functionality
docker compose up -d --build

# Verify services are running
docker compose ps

# Test health endpoint
curl -s http://127.0.0.1:8780/health
# Expected output: {"status":"ok"}

# Run full smoke test
./scripts/smoke.sh
```

Access the dashboard at `http://127.0.0.1:3006` (localhost-only, not publicly exposed).

## Local dev
```bash
cp .env.example .env
# Configure .env with your tokens

# API
cd control-api
npm install
npm run dev

# Dashboard (in another terminal)
cd ../dashboard
npm install
npm run dev
```

Dashboard will be at `http://localhost:3000`, API at `http://127.0.0.1:8780`.

## How to test

### 1. Test Control API endpoints
```bash
# Test root endpoint
curl -s http://127.0.0.1:8780/ | jq
# Should show: gateway_connected, github_ok, repo, server_time

# Test tasks endpoint (requires GitHub config)
curl -s http://127.0.0.1:8780/tasks | jq
# Should show: { items: [{ title, url, state, updated_at }, ...] }

# Test cursor-runs endpoint (requires GitHub config)
curl -s http://127.0.0.1:8780/cursor-runs | jq
# Should show: { items: [{ bcId, cursor_url, pr_url, updated_at }, ...] }
```

### 2. Test Dashboard UI
1. Open `http://127.0.0.1:3006` in your browser
2. **Home page** should show 4 cards:
   - Gateway status (will show disconnected if OpenClaw Gateway not running)
   - GitHub tasks count
   - Recent Cursor runs count
   - Create Task button
3. Click **Tasks** — should list issues with open/closed states
4. Click **Runs** — should list bcIds with links to Cursor and PRs
5. Click **Create** — fill form to create a new task
   - Success screen should show issue_url and pr_url
   - Check GitHub to verify issue and PR were created

### 3. Test task creation
```bash
# Create a test task via API
curl -X POST http://127.0.0.1:8780/tasks/cursor \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test task",
    "body": "This is a test task created via API",
    "repo": "test-repo"
  }'
# Should return: { issue_url: "...", pr_url: "..." }
```

### 4. Full integration test
Run the smoke test script:
```bash
./scripts/smoke.sh
```

This verifies all API endpoints are responding correctly.
