'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';

export function SidebarUserNav() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserButton afterSignOutUrl="/sign-in" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
