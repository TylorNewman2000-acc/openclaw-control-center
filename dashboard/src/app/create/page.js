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
      setRepo('');
      setTitle('');
      setBody('');
    } catch (e2) {
      setError(String(e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Create Cursor Task</h1>

      {result ? (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #22c55e', 
          borderRadius: '8px',
          backgroundColor: '#f0fdf4',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#166534' }}>
            Task created successfully!
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                ISSUE URL
              </div>
              <a 
                href={result.issue_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#0066cc', 
                  textDecoration: 'none',
                  wordBreak: 'break-all',
                }}
              >
                {result.issue_url}
              </a>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                PR URL
              </div>
              <a 
                href={result.pr_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#0066cc', 
                  textDecoration: 'none',
                  wordBreak: 'break-all',
                }}
              >
                {result.pr_url}
              </a>
            </div>
          </div>
          <button 
            onClick={() => setResult(null)}
            style={{ 
              marginTop: '16px',
              padding: '8px 16px', 
              backgroundColor: '#fff', 
              border: '1px solid #22c55e',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              color: '#166534',
            }}
          >
            Create Another Task
          </button>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: 'grid', gap: '16px', maxWidth: '640px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
              Repository (optional)
            </label>
            <input 
              value={repo} 
              onChange={e => setRepo(e.target.value)} 
              placeholder="e.g., owner/repo"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
              Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              required 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Brief description of the task"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea 
              required 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              rows={10}
              placeholder="Detailed task description..."
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical',
              }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              disabled={loading} 
              type="submit"
              style={{ 
                padding: '10px 24px', 
                backgroundColor: loading ? '#ccc' : '#0066cc', 
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {loading ? 'Creating…' : 'Create Task'}
            </button>
            <a 
              href="/tasks"
              style={{ 
                padding: '10px 24px', 
                backgroundColor: '#fff',
                color: '#333',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
                display: 'inline-block',
              }}
            >
              Cancel
            </a>
          </div>
        </form>
      )}

      {error && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          color: '#991b1b',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </main>
  );
}
