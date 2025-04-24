'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { type VisibilityType, VisibilitySelector } from './visibility-selector';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3"
        />
      )}

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="py-1.5 px-3 h-fit md:h-[34px] order-4 md:ml-auto"
          >
            View Billing
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Billing Information</SheetTitle>
            <SheetDescription>
              This is where your billing details and usage would be displayed.
              (Placeholder Content)
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {/* Placeholder: Current Plan */}
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
              <p className="font-semibold">Pro Plan ($20/month)</p>
            </div>

            {/* Placeholder: Usage */}
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Current Cycle Usage</p>
              <p>Messages: 1,234 / 10,000</p>
            </div>

            {/* Placeholder: Payment Method */}
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p>Visa ending in **** 4242</p>
            </div>

            {/* Placeholder: Manage Button */}
            <Button className="mt-4">Manage Subscription</Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
