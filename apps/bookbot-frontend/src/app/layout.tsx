import type { Metadata } from 'next';
import './global.css';
import QueryProvider from '@/components/QueryProvider';

export const metadata: Metadata = {
  title: 'BookBot — Knihy z druhé ruky',
  description: 'Komisní prodej knih',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className="bg-white text-gray-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
