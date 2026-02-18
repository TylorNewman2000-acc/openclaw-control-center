# OpenClaw Control Center (Custom)

Custom, minimal control center for OpenClaw (no Studio).

## Architecture
- `dashboard/` — Next.js (mobile-first UI)
- `control-api/` — Node/Express API that talks to:
  - OpenClaw Gateway locally (`ws://127.0.0.1:18789`) using the gateway token server-side
  - GitHub API (token server-side)
- `docker-compose.yml` — runs both services for VPS testing (localhost-bound)

## Quick start (VPS)
```bash
cp .env.example .env
# edit .env (do NOT commit)
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

# API
cd control-api
npm install
npm run dev

# Dashboard
cd ../dashboard
npm install
npm run dev
```
