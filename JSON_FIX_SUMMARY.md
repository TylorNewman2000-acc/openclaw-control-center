# JSON Error Handling Fix Summary

## Issue
The `/tasks` and `/cursor-runs` endpoints were returning HTML 401 Unauthorized responses instead of JSON when GitHub credentials were missing or invalid.

## Root Cause
- GitHub API calls were not wrapped in try/catch blocks
- No global error handler middleware for consistent JSON responses
- Endpoints returned HTTP 400 status which could trigger default Express HTML error pages

## Solution Implemented

### 1. Backend API Changes (control-api/src/server.js)

**GET /tasks**
- ✅ Returns `{ items: [], github_ok: false }` when GitHub not configured (200 status)
- ✅ Wrapped GitHub API calls in try/catch
- ✅ Returns `{ items: [], github_ok: false, error: {...} }` on GitHub API errors
- ✅ Returns `{ items: [...], github_ok: true }` on success

**GET /cursor-runs**
- ✅ Returns `{ items: [], github_ok: false }` when GitHub not configured (200 status)
- ✅ Wrapped GitHub API calls in try/catch
- ✅ Returns `{ items: [], github_ok: false, error: {...} }` on GitHub API errors
- ✅ Returns `{ items: [...], github_ok: true }` on success

**POST /tasks/cursor**
- ✅ Wrapped GitHub API calls in try/catch
- ✅ Returns JSON error with 500 status on failure

**Global Error Handler**
- ✅ Added Express error middleware that ensures JSON responses
- ✅ Catches unhandled errors and returns `{ error: { message, code } }`

### 2. Frontend Changes

**Tasks Page (dashboard/src/app/tasks/page.js)**
- ✅ Checks `github_ok` field in response
- ✅ Shows warning banner when GitHub not configured
- ✅ Shows appropriate empty state message

**Cursor Runs Page (dashboard/src/app/cursor-runs/page.js)**
- ✅ Checks `github_ok` field in response
- ✅ Shows warning banner when GitHub not configured
- ✅ Shows appropriate empty state message

### 3. Documentation & Testing

**README.md**
- ✅ Added API testing section with curl examples
- ✅ Updated verification steps
- ✅ Enhanced troubleshooting section

**scripts/test-api.sh**
- ✅ Created automated test script
- ✅ Tests all endpoints return valid JSON
- ✅ Validates acceptance criteria

## Acceptance Test Results

All endpoints now return valid JSON:

```bash
# Test with no GitHub credentials
curl -s http://127.0.0.1:8780/tasks | jq .
# Returns: { "items": [], "github_ok": false }

curl -s http://127.0.0.1:8780/cursor-runs | jq .
# Returns: { "items": [], "github_ok": false }

# Test with invalid credentials
# Returns: { "items": [], "github_ok": false, "error": { "message": "..." } }
```

## Files Changed

### Backend
- `control-api/src/server.js` - Error handling, try/catch, github_ok field

### Frontend
- `dashboard/src/app/tasks/page.js` - GitHub config warning
- `dashboard/src/app/cursor-runs/page.js` - GitHub config warning

### Documentation & Tests
- `README.md` - API testing examples, troubleshooting
- `scripts/test-api.sh` - Automated API test script
- `JSON_FIX_SUMMARY.md` - This document

## Behavior Changes

### Before
- Missing GitHub credentials → HTTP 400 with `{ "error": "GitHub not configured" }`
- GitHub API errors → Unhandled exceptions → HTML error pages
- Dashboard → Broken UI with error states

### After
- Missing GitHub credentials → HTTP 200 with `{ "items": [], "github_ok": false }`
- GitHub API errors → HTTP 200 with `{ "items": [], "github_ok": false, "error": {...} }`
- Dashboard → Shows clear warning banners + graceful empty states

## Constraints Maintained
- ✅ Minimal backend changes (focused on error handling)
- ✅ Localhost-only bindings preserved
- ✅ No authentication added
- ✅ No secrets exposed to client

## Testing Instructions

1. **Test without GitHub credentials:**
   ```bash
   # Remove GitHub env vars from .env
   docker compose down
   docker compose up -d --build
   ./scripts/test-api.sh
   ```

2. **Test with invalid credentials:**
   ```bash
   # Set invalid token in .env
   GITHUB_TOKEN=ghp_invalid_token_here
   docker compose restart
   curl -s http://127.0.0.1:8780/tasks | jq
   ```

3. **Verify dashboard:**
   - Open http://127.0.0.1:3006
   - Check /tasks page shows yellow warning banner
   - Check /cursor-runs page shows yellow warning banner
   - Verify no error states, clean empty state messages

## Commit History
1. `fix: ensure all API endpoints return JSON (never HTML)`
2. `test: add API test script for JSON response validation`

All changes pushed to `oc/ui-control-center` branch.
