# JSON Error Handling Fix

## Problem
The `/tasks` and `/cursor-runs` endpoints were returning HTML 401 "Unauthorized" responses instead of JSON when GitHub credentials were missing or invalid.

## Root Cause
1. Endpoints returned 400 status with minimal error handling
2. No try/catch around GitHub API calls
3. Unhandled exceptions fell through to Express's default error handler (which returns HTML)

## Solution Implemented

### Backend Changes (control-api/src/server.js)

#### 1. Return 200 with Empty List When Not Configured
```javascript
// Before: res.status(400).json({ error: 'GitHub not configured' })
// After:  res.json({ items: [], github_ok: false })
```

#### 2. Wrap GitHub API Calls in Try/Catch
```javascript
try {
  const issues = await octokit.issues.listForRepo(...);
  res.json({ items: [...], github_ok: true });
} catch (error) {
  console.error('GitHub API error (tasks):', error.message);
  res.json({ items: [], github_ok: false, error: { message: error.message } });
}
```

#### 3. Global Error Handler Middleware
```javascript
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: { 
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    } 
  });
});
```

### Frontend Changes

#### 1. Tasks Page (dashboard/src/app/tasks/page.js)
- Added `githubConfigured` check based on `data.github_ok`
- Show warning banner when GitHub not configured
- Update empty state message based on configuration status

#### 2. Cursor Runs Page (dashboard/src/app/cursor-runs/page.js)
- Same pattern as tasks page
- Warning banner for missing GitHub config
- Context-aware empty states

### Documentation Changes (README.md)

Added comprehensive curl testing examples:
```bash
# Always returns JSON (even with bad/missing credentials)
curl -s http://127.0.0.1:8780/tasks | jq
curl -s http://127.0.0.1:8780/cursor-runs | jq
```

## Acceptance Tests

Both commands now return valid JSON:

### Without GitHub Configuration
```bash
$ curl -s http://127.0.0.1:8780/tasks | jq
{
  "items": [],
  "github_ok": false
}

$ curl -s http://127.0.0.1:8780/cursor-runs | jq
{
  "items": [],
  "github_ok": false
}
```

### With Invalid GitHub Token
```bash
$ curl -s http://127.0.0.1:8780/tasks | jq
{
  "items": [],
  "github_ok": false,
  "error": {
    "message": "Bad credentials"
  }
}
```

### With Valid GitHub Configuration
```bash
$ curl -s http://127.0.0.1:8780/tasks | jq
{
  "items": [
    {
      "id": 123,
      "title": "Example task",
      "url": "https://github.com/...",
      "state": "open",
      "created_at": "2026-02-18T...",
      "updated_at": "2026-02-18T..."
    }
  ],
  "github_ok": true
}
```

## Files Changed
- `control-api/src/server.js` - Error handling + try/catch
- `dashboard/src/app/tasks/page.js` - GitHub config warning
- `dashboard/src/app/cursor-runs/page.js` - GitHub config warning
- `README.md` - Testing examples

## Benefits
1. ✅ **Always JSON**: No more HTML error responses
2. ✅ **Graceful Degradation**: Dashboard works without GitHub
3. ✅ **Clear Feedback**: Users see GitHub configuration warnings
4. ✅ **Better DX**: curl examples in README for testing
5. ✅ **Error Visibility**: Console logs for debugging
6. ✅ **Minimal Diff**: Changes focused on error handling only
