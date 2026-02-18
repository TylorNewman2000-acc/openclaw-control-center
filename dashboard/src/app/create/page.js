'use client';

import { useState } from 'react';

export default function CreatePage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const [repo, setRepo] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${base}/tasks/cursor`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ repo, title, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      setResult(json);
    } catch (e2) {
      setError(String(e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Create Cursor Task</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          Repo (optional)
          <input value={repo} onChange={e => setRepo(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Title
          <input required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Body
          <textarea required value={body} onChange={e => setBody(e.target.value)} rows={8} style={{ width: '100%' }} />
        </label>
        <button disabled={loading} type="submit">
          {loading ? 'Creating…' : 'Create'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: 'crimson' }}>
          Error: {error}
        </div>
      )}
      {result && (
        <pre style={{ marginTop: 12, overflowX: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </main>
  );
}
