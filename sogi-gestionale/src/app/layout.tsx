import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import SessionProvider from '@/components/SessionProvider';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SOGI UDA - Gestionale Assegnazione Ore',
  description: 'Sistema di gestione per l\'assegnazione ore formative',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={poppins.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
