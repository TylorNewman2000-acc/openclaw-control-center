async function getJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

export default async function CursorRunsPage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const runs = await getJSON(`${base}/cursor-runs`);

  if (runs.error) {
    return (
      <main>
        <h1 style={{ marginTop: 0 }}>Cursor Runs</h1>
        <div style={{ color: 'crimson' }}>Error: {runs.error}</div>
      </main>
    );
  }

  const items = runs.items || [];

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Cursor Runs</h1>
      
      {items.length === 0 && (
        <div style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
          No cursor runs found
        </div>
      )}

      {items.length > 0 && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map((run, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: '16px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    {run.bcId}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(run.updated_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a 
                    href={run.cursor_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      padding: '6px 12px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      color: '#333',
                    }}
                  >
                    View in Cursor →
                  </a>
                  {run.pr_url && (
                    <a 
                      href={run.pr_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '4px', 
                        textDecoration: 'none',
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      View PR →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
