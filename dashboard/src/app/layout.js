export const metadata = {
  title: 'OpenClaw Control Center',
  description: 'Custom control center (no Studio)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <div style={{ padding: 16, maxWidth: 860, margin: '0 auto' }}>
          <header style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 16 }}>
            <div style={{ fontWeight: 700 }}>OpenClaw Control Center</div>
            <nav style={{ display: 'flex', gap: 12, fontSize: 14 }}>
              <a href="/">Now</a>
              <a href="/tasks">Tasks</a>
              <a href="/create">Create</a>
              <a href="/news">News</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
