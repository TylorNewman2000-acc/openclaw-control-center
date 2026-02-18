import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata = {
  title: 'OpenClaw Control Center',
  description: 'Custom control center (no Studio)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
