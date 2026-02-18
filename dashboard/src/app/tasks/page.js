import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/Table';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import TasksFilter from './TasksFilter';

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

export default async function TasksPage({ searchParams }) {
  const base = process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780';
  const stateFilter = searchParams?.state || 'open';
  const data = await getJSON(`${base}/tasks?state=${stateFilter}`);

  if (data.error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Tasks</h1>
        <Card>
          <CardContent>
            <ErrorState 
              title="Unable to load tasks"
              message={`Error: ${data.error}`}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const tasks = data.items || [];
  const openCount = tasks.filter(t => t.state === 'open').length;
  const closedCount = tasks.filter(t => t.state === 'closed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Tasks</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {openCount} open · {closedCount} closed
          </p>
        </div>
        <Link href="/create">
          <Button variant="primary">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Button>
        </Link>
      </div>

      <TasksFilter currentState={stateFilter} />

      <Card className="mt-6">
        {tasks.length === 0 ? (
          <CardContent>
            <EmptyState
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              title={`No ${stateFilter} tasks`}
              description="Get started by creating a new task"
              action={
                <Link href="/create">
                  <Button variant="primary">Create Task</Button>
                </Link>
              }
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <span className="font-mono text-xs">#{task.id}</span>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="font-medium text-zinc-900 truncate">
                        {task.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={task.state === 'open' ? 'open' : 'closed'}>
                        {task.state}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-zinc-500 text-xs">
                        {formatDate(task.updated_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View →
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
