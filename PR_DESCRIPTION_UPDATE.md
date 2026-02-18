# Fix: Host curl for control-api + smoke test

## What was the bug?

The original implementation used `network_mode: host` for both services. While this approach shares the host's network namespace with containers, it has several reliability issues:

1. **Inconsistent behavior across Docker versions** - `network_mode: host` can behave differently depending on the Docker daemon version and host OS configuration
2. **Port binding conflicts** - If anything else on the host tries to use the same port, the container fails silently or behaves unpredictably
3. **Healthcheck ambiguity** - With host networking, healthchecks from inside the container can succeed even when external host access fails
4. **IPv4/IPv6 edge cases** - Binding to `127.0.0.1` specifically can cause issues with dual-stack configurations

These issues led to "empty reply/reset" errors when curling from the VPS host to `http://127.0.0.1:8780/health`.

## How does this fix work?

The fix switches to the standard Docker bridge network with explicit localhost port mappings:

**Control API:**
- Maps container port `8780` to host `127.0.0.1:8780` 
- Container binds to `0.0.0.0:8780` (all interfaces inside the isolated container network)
- Port mapping syntax `127.0.0.1:8780:8780` ensures the service is only accessible from the host's localhost

**Dashboard:**
- Maps container port `3006` to host `127.0.0.1:3006`
- Same localhost-binding approach

This approach:
- ✅ Provides reliable localhost access from the host
- ✅ Keeps services completely private (not exposed to external networks)
- ✅ Avoids Docker userland proxy edge cases through explicit bind addresses
- ✅ Works consistently across Docker versions and host configurations

## How to verify

After running `docker compose up -d --build`:

```bash
# Test control-api health endpoint
curl -v http://127.0.0.1:8780/health
# Expected: {"status":"ok"}

# Test control-api root endpoint
curl -s http://127.0.0.1:8780/
# Expected: JSON with gateway status

# Run smoke test script
./scripts/smoke.sh
# Expected: [smoke] ok

# Verify services are NOT publicly exposed
curl -v http://<your-public-ip>:8780/health
# Expected: Connection refused (or timeout)

# Check service health
docker compose ps
# Both services should show "healthy" status
```

## Changes summary

- Removed `network_mode: host` from both services
- Added explicit port mappings: `127.0.0.1:8780:8780` and `127.0.0.1:3006:3006`
- Changed `CONTROL_API_BIND` from `127.0.0.1` to `0.0.0.0` (containers now use bridge network)
- Added `.env.example` with proper configuration templates
- Smoke test script already present at `scripts/smoke.sh`
