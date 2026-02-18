async function getJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

export default async function TasksPage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const tasks = await getJSON(`${base}/tasks`);

  if (tasks.error) {
    return (
      <main>
        <h1 style={{ marginTop: 0 }}>Tasks</h1>
        <div style={{ color: 'crimson' }}>Error: {tasks.error}</div>
      </main>
    );
  }

  const items = tasks.items || [];
  const openItems = items.filter(t => t.state === 'open');
  const closedItems = items.filter(t => t.state === 'closed');

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Tasks</h1>
        <a 
          href="/create" 
          style={{ 
            padding: '8px 16px', 
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
      </div>

      {items.length === 0 && (
        <div style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
          No tasks found
        </div>
      )}

      {openItems.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#666' }}>
            OPEN ({openItems.length})
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {openItems.map((task, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '16px', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#22c55e',
                    marginTop: '6px',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a 
                      href={task.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: '#0066cc',
                        textDecoration: 'none',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {task.title}
                    </a>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Updated {new Date(task.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {closedItems.length > 0 && (
        <section>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#666' }}>
            CLOSED ({closedItems.length})
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {closedItems.map((task, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '16px', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#999',
                    marginTop: '6px',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a 
                      href={task.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: '#666',
                        textDecoration: 'none',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {task.title}
                    </a>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Updated {new Date(task.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
