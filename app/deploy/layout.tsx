import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';

export default async function DeployLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      {/* Back to Chat button - fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">← Back to Chat</Link>
        </Button>
      </div>

      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} section="deploy" />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
