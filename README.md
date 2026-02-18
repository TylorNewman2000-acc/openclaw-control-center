# OpenClaw Control Center

A modern, polished control center for OpenClaw with a beautiful UI, task management, and Cursor agent integration.

## Features

✨ **Modern UI Design System**
- Tailwind-based components (Card, Button, Badge, Table, Tabs, Input)
- Responsive layout (desktop sidebar + mobile bottom nav)
- Consistent spacing, typography, and states

📊 **Dashboard Pages**
- **Home**: System status cards, task summary, recent Cursor runs
- **Tasks**: Filterable task list with GitHub integration
- **Create**: Polished form to create Cursor tasks
- **Cursor Runs**: Track agent runs with links to Cursor pages
- **News**: Updates and announcements (RSS coming soon)

🔌 **Integrations**
- OpenClaw Gateway (WebSocket connection monitoring)
- GitHub API (tasks, PRs, issue tracking)
- Cursor Agent (bcId tracking and links)

## Architecture

- `dashboard/` — Next.js 16 with Tailwind CSS (mobile-first responsive UI)
- `control-api/` — Node.js/Express API
  - Connects to OpenClaw Gateway (`ws://127.0.0.1:18789`)
  - Integrates with GitHub API for task management
  - Provides REST endpoints for dashboard
- `docker-compose.yml` — Runs both services (localhost-bound for security)

## Quick Start (Docker)

### 1. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials (do NOT commit)
```

**Required configuration:**
```env
# GitHub Integration (required for task management)
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repo-name

# OpenClaw Gateway (optional, for gateway status monitoring)
OPENCLAW_GATEWAY_WS=ws://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=your_gateway_token
```

### 2. Start Services

```bash
docker compose up -d --build
```

### 3. Verify Installation

```bash
# Check services are running
docker compose ps
# Expected: Both control-api and dashboard should be "Up"

# Test API health
curl -s http://127.0.0.1:8780/health | jq
# Expected: {"status":"ok"}

# Test API info endpoint
curl -s http://127.0.0.1:8780/ | jq
# Expected: JSON with gateway_connected, github_ok, repo, server_time

# Test tasks endpoint (always returns JSON)
curl -s http://127.0.0.1:8780/tasks | jq
# Expected: {"items":[],"github_ok":false} (if GitHub not configured)
# Expected: {"items":[...],"github_ok":true} (if GitHub configured)

# Test cursor-runs endpoint (always returns JSON)
curl -s http://127.0.0.1:8780/cursor-runs | jq
# Expected: {"items":[],"github_ok":false} (if GitHub not configured)
# Expected: {"items":[...],"github_ok":true} (if GitHub configured)

# Run full smoke test (if available)
./scripts/smoke.sh
```

### 4. Access Dashboard

Open your browser to: **http://127.0.0.1:3006**

The dashboard is only accessible from localhost (not publicly exposed).

### 5. Test the UI

1. **Home Page**: View system status, task counts, recent runs
2. **Tasks Page**: 
   - Filter tasks by open/closed/all
   - Click "View →" to open GitHub issues
3. **Create Page**: 
   - Fill out the form to create a new Cursor task
   - See success state with issue/PR links
4. **Cursor Runs**: View bcIds and links to Cursor agent pages
5. **News**: Browse placeholder news cards

## Local Development

For development without Docker:

### 1. Setup Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 2. Start API Server

```bash
cd control-api
npm install
npm run dev
# Runs on http://127.0.0.1:8780
```

### 3. Start Dashboard (in separate terminal)

```bash
cd dashboard
npm install
npm run dev
# Runs on http://127.0.0.1:3000
```

### 4. Verify

- API: http://127.0.0.1:8780/health
- Dashboard: http://127.0.0.1:3000

## Mobile Testing

The UI is fully responsive. To test on mobile:

1. **Using Browser DevTools**: 
   - Open http://127.0.0.1:3006
   - Press F12 → Toggle device toolbar
   - Test various screen sizes

2. **On Physical Device** (same network):
   - Find your VPS IP: `ip addr show`
   - Access http://YOUR_VPS_IP:3006 (if firewall allows)
   - Or use SSH tunnel: `ssh -L 3006:127.0.0.1:3006 user@vps`

## Stopping Services

```bash
# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v
```

## API Testing

All endpoints return JSON, even with missing/invalid credentials:

```bash
# System info (always works)
curl -s http://127.0.0.1:8780/ | jq

# Tasks (returns empty list if GitHub not configured)
curl -s http://127.0.0.1:8780/tasks | jq
curl -s 'http://127.0.0.1:8780/tasks?state=closed' | jq
curl -s 'http://127.0.0.1:8780/tasks?state=all' | jq

# Cursor runs (returns empty list if GitHub not configured)
curl -s http://127.0.0.1:8780/cursor-runs | jq

# Create task (requires GitHub configuration)
curl -s http://127.0.0.1:8780/tasks/cursor \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test task","body":"Description here"}' | jq
```

## Troubleshooting

### Dashboard shows "Unable to connect to control API"
- Check API is running: `docker compose ps`
- Check API health: `curl -s http://127.0.0.1:8780/health | jq`
- View API logs: `docker compose logs control-api`

### Tasks/Cursor runs show empty lists
- This is normal if GitHub is not configured
- Check GitHub status: `curl -s http://127.0.0.1:8780/ | jq .github_ok`
- If false, ensure GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO are set in `.env`
- Restart services: `docker compose restart`
- Verify token: `curl -s http://127.0.0.1:8780/tasks | jq`

### Gateway shows "Disconnected"
- This is normal if OpenClaw Gateway is not running
- Configure OPENCLAW_GATEWAY_WS and OPENCLAW_GATEWAY_TOKEN if you want monitoring

### Port already in use
- Change ports in `docker-compose.yml`:
  - Control API: `"127.0.0.1:8780:8780"` → `"127.0.0.1:YOUR_PORT:8780"`
  - Dashboard: `"127.0.0.1:3006:3006"` → `"127.0.0.1:YOUR_PORT:3006"`

## Security Notes

- All services are bound to 127.0.0.1 (localhost only)
- No authentication/login required (intended for single-user VPS)
- Do NOT expose ports publicly without adding authentication
- Keep `.env` file secure and never commit it

## Tech Stack

**Frontend:**
- Next.js 16 (React 19)
- Tailwind CSS 3.4
- Server Components + Client Components

**Backend:**
- Node.js + Express
- WebSocket client for OpenClaw Gateway
- Octokit for GitHub API

**DevOps:**
- Docker + Docker Compose
- Health checks and auto-restart
