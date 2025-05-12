import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { currentUser } from '@clerk/nextjs/server';
import Script from 'next/script';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clerkUser, cookieStore] = await Promise.all([
    currentUser(),
    cookies(),
  ]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value === 'false';
  const isSignedIn = !!clerkUser;

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar isSignedIn={isSignedIn} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
