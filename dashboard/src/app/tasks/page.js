async function getJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}

export default async function TasksPage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const tasks = await getJSON(`${base}/tasks`).catch(() => ({ error: 'failed' }));

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Tasks</h1>
      <pre style={{ overflowX: 'auto' }}>{JSON.stringify(tasks, null, 2)}</pre>
    </main>
  );
}
