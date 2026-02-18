'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Tasks', href: '/tasks', icon: TasksIcon },
  { name: 'Create', href: '/create', icon: CreateIcon },
  { name: 'Cursor Runs', href: '/cursor-runs', icon: CursorIcon },
  { name: 'News', href: '/news', icon: NewsIcon },
];

function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function TasksIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function CreateIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CursorIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function NewsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

function NavItem({ item, isActive, isMobile }) {
  const Icon = item.icon;
  
  if (isMobile) {
    return (
      <Link
        href={item.href}
        className={`flex flex-col items-center justify-center px-2 py-2 text-xs font-medium transition-colors ${
          isActive
            ? 'text-blue-600'
            : 'text-zinc-500 hover:text-zinc-900'
        }`}
      >
        <Icon className="h-6 w-6 mb-1" />
        <span>{item.name}</span>
      </Link>
    );
  }
  
  return (
    <Link
      href={item.href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-zinc-700 hover:bg-zinc-100'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {item.name}
    </Link>
  );
}

export function AppShell({ children }) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="lg:flex lg:min-h-screen">
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-zinc-200">
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-zinc-200">
              <div>
                <h1 className="text-lg font-bold text-zinc-900">OpenClaw</h1>
                <p className="text-xs text-zinc-500">Control Center</p>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={pathname === item.href}
                  isMobile={false}
                />
              ))}
            </nav>
            <div className="flex-shrink-0 border-t border-zinc-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-400"></div>
                <div className="ml-3 text-xs text-zinc-500">System Online</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h1 className="text-base font-bold text-zinc-900">OpenClaw</h1>
                <p className="text-xs text-zinc-500">Control Center</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-400"></div>
                <div className="ml-2 text-xs text-zinc-500">Online</div>
              </div>
            </div>
          </div>

          <main className="flex-1 pb-20 lg:pb-8">
            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 lg:hidden z-10">
            <div className="grid grid-cols-5 gap-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={pathname === item.href}
                  isMobile={true}
                />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
