async function getJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

const cardStyle = {
  padding: '16px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const titleStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#666',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export default async function HomePage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const info = await getJSON(`${base}/`);
  const tasks = await getJSON(`${base}/tasks`);
  const runs = await getJSON(`${base}/cursor-runs`);

  const openTasks = tasks.items?.filter(t => t.state === 'open').length || 0;
  const recentRuns = runs.items?.slice(0, 5) || [];

  return (
    <main>
      <h1 style={{ marginTop: 0, marginBottom: '20px' }}>Dashboard</h1>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        
        <section style={cardStyle}>
          <div style={titleStyle}>OpenClaw Gateway</div>
          <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            {info.gateway_connected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
          {info.last_gateway_message_timestamp && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Last message: {new Date(info.last_gateway_message_timestamp).toLocaleString()}
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <div style={titleStyle}>GitHub Tasks</div>
          <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            {openTasks} Open
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {info.repo ? `Repo: ${info.repo}` : 'Not configured'}
          </div>
          <a href="/tasks" style={{ fontSize: '14px', color: '#0066cc', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>
            View all →
          </a>
        </section>

        <section style={cardStyle}>
          <div style={titleStyle}>Recent Cursor Runs</div>
          <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            {recentRuns.length} Recent
          </div>
          {recentRuns.length > 0 && (
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              Latest: {recentRuns[0].bcId.substring(0, 8)}...
            </div>
          )}
          <a href="/cursor-runs" style={{ fontSize: '14px', color: '#0066cc', textDecoration: 'none', display: 'inline-block' }}>
            View all →
          </a>
        </section>

        <section style={cardStyle}>
          <div style={titleStyle}>Quick Actions</div>
          <a 
            href="/create" 
            style={{ 
              display: 'inline-block', 
              padding: '10px 20px', 
              backgroundColor: '#0066cc', 
              color: '#fff', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            + Create Task
          </a>
        </section>

      </div>
    </main>
  );
}
