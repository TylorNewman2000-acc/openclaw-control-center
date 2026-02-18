import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';

const placeholderNews = [
  {
    id: 1,
    title: 'OpenClaw Control Center v1.0 Released',
    excerpt: 'The new control center is now available with a modern UI, task management, and Cursor integration.',
    category: 'Release',
    date: '2026-02-18',
    readTime: '3 min read',
  },
  {
    id: 2,
    title: 'Improved Cursor Agent Integration',
    excerpt: 'Track your Cursor agent runs directly from the control center with real-time status updates.',
    category: 'Feature',
    date: '2026-02-15',
    readTime: '2 min read',
  },
  {
    id: 3,
    title: 'GitHub Integration Updates',
    excerpt: 'Enhanced GitHub API integration with better error handling and rate limit management.',
    category: 'Update',
    date: '2026-02-12',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'Mobile-First Design System',
    excerpt: 'The control center now features a responsive design that works seamlessly on mobile devices.',
    category: 'Design',
    date: '2026-02-10',
    readTime: '5 min read',
  },
  {
    id: 5,
    title: 'Task Management Best Practices',
    excerpt: 'Learn how to write effective task descriptions for Cursor agents to get the best results.',
    category: 'Guide',
    date: '2026-02-08',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Performance Improvements',
    excerpt: 'Latest updates bring significant performance improvements to the dashboard and API.',
    category: 'Performance',
    date: '2026-02-05',
    readTime: '3 min read',
  },
];

function getCategoryVariant(category) {
  const variants = {
    Release: 'success',
    Feature: 'info',
    Update: 'warning',
    Design: 'default',
    Guide: 'info',
    Performance: 'success',
  };
  return variants[category] || 'default';
}

function NewsCard({ item }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant={getCategoryVariant(item.category)}>
            {item.category}
          </Badge>
          <span className="text-xs text-zinc-500">{item.readTime}</span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-zinc-600 mb-4">
          {item.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-blue-600 hover:text-blue-700 font-medium">
            Read more →
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">News & Updates</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Stay up to date with the latest features and improvements
        </p>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-blue-900 mb-1">
                RSS Feed Coming Soon
              </h3>
              <p className="text-sm text-blue-800">
                RSS feed integration is planned for a future release. In the meantime, 
                check back here for updates or follow the project on GitHub.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Subscribe to Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 mb-4">
            Want to stay informed about new features and updates? Keep an eye on this space 
            or star the project on GitHub.
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors inline-flex items-center">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              View on GitHub
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

