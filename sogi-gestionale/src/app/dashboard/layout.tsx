import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import DashboardLayout from '@/components/DashboardLayout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Se admin, redirect automatico alla dashboard admin root
  if (session?.user?.role === 'admin' && typeof window === 'undefined') {
    // Se non già su /dashboard/admin, redirect
    const pathname = (globalThis as any).location?.pathname || '';
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/admin')) {
      redirect('/dashboard/admin');
    }
  }

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
