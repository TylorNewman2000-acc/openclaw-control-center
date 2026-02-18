import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/Table';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';

async function getJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return formatDate(dateString);
}

export default async function CursorRunsPage() {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const data = await getJSON(`${base}/cursor-runs`);

  if (data.error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Cursor Runs</h1>
        <Card>
          <CardContent>
            <ErrorState 
              title="Unable to load cursor runs"
              message={`Error: ${data.error}`}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const runs = data.items || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Cursor Runs</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {runs.length} {runs.length === 1 ? 'run' : 'runs'} found
        </p>
      </div>

      <Card>
        {runs.length === 0 ? (
          <CardContent>
            <EmptyState
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="No cursor runs found"
              description="Cursor runs will appear here once agents start working on tasks"
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Build ID</TableHead>
                  <TableHead>Pull Request</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <a
                        href={run.cursor_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                      >
                        {run.bcId}
                        <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </TableCell>
                    <TableCell className="max-w-md">
                      {run.pr_title ? (
                        <div>
                          <div className="font-medium text-zinc-900 truncate">
                            {run.pr_title}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-sm">No PR title</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-zinc-500 text-xs">
                        {formatRelativeTime(run.updated_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {run.pr_url && (
                        <a
                          href={run.pr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                        >
                          View PR
                          <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">About Cursor Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600">
            This page displays Cursor agent runs detected from PR comments. Each run has a unique build ID (bcId) 
            that links to the Cursor agent page where you can monitor progress and view logs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
