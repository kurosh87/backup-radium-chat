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
} from '@/components/ui/sheet';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  showDeployButton = false,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  showDeployButton?: boolean;
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

      {showDeployButton && (
        <Button
          variant="outline"
          className="py-1.5 px-3 h-fit md:h-[34px] order-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10"
          asChild
        >
          <Link href="/deploy">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            Deploy your own model
          </Link>
        </Button>
      )}

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="py-1.5 px-3 h-fit md:h-[34px] order-5 md:ml-auto"
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
              <p className="text-sm font-medium text-muted-foreground">
                Current Plan
              </p>
              <p className="font-semibold">Pro Plan ($20/month)</p>
            </div>

            {/* Placeholder: Usage */}
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                Current Cycle Usage
              </p>
              <p>Messages: 1,234 / 10,000</p>
            </div>

            {/* Placeholder: Payment Method */}
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                Payment Method
              </p>
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
