'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Input, Textarea } from '@/components/Input';
import { Button } from '@/components/Button';

export default function CreatePage() {
  const base = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_CONTROL_API_BASE || 'http://127.0.0.1:8780')
    : '';
  
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Create Cursor Task</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Create a new task that will trigger a Cursor agent
        </p>
      </div>

      {result ? (
        <Card className="mb-6">
          <CardHeader className="bg-green-50 border-green-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-green-900">Task Created Successfully</CardTitle>
                <p className="text-sm text-green-700 mt-1">
                  Your task has been created and submitted to Cursor
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.issue_url && (
                <div>
                  <div className="text-sm font-medium text-zinc-700 mb-1">GitHub Issue</div>
                  <a
                    href={result.issue_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    {result.issue_url}
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
              {result.pr_url && (
                <div>
                  <div className="text-sm font-medium text-zinc-700 mb-1">Pull Request</div>
                  <a
                    href={result.pr_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    {result.pr_url}
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" onClick={() => setResult(null)}>
                Create Another Task
              </Button>
              <Link href="/tasks">
                <Button variant="outline">View All Tasks</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-6">
              <Input
                label="Repository"
                placeholder="owner/repo (optional)"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                helperText="Specify the target repository for this task"
              />

              <Input
                label="Title"
                placeholder="Brief description of the task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Textarea
                label="Description"
                placeholder="Detailed instructions for the Cursor agent..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                required
                helperText="Provide clear, detailed instructions for the task"
              />

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error creating task</h3>
                      <div className="mt-1 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </Button>
                <Link href="/tasks">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">💡 Tips for Writing Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Be specific about what needs to be done</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Include file paths or component names when relevant</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Mention any dependencies or prerequisites</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Describe the expected outcome or success criteria</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
