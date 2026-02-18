async function getJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

export default async function NowPage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const info = await getJSON(`${base}/`);
  const tasks = await getJSON(`${base}/tasks`);
  const runs = await getJSON(`${base}/cursor-runs`);

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Now</h1>

      <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Gateway</div>
        <pre style={{ margin: 0, overflowX: 'auto' }}>{JSON.stringify(info, null, 2)}</pre>
      </section>

      <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Recent tasks</div>
        <pre style={{ margin: 0, overflowX: 'auto' }}>{JSON.stringify(tasks, null, 2)}</pre>
      </section>

      <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Recent cursor runs</div>
        <pre style={{ margin: 0, overflowX: 'auto' }}>{JSON.stringify(runs, null, 2)}</pre>
      </section>
    </main>
  );
}
