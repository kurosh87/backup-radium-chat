'use client';

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In to Radium Chat</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Access your account with Clerk authentication
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-xl shadow-none",
              formButtonPrimary: "bg-primary hover:bg-primary/90"
            }
          }}
        />
      </div>
    </div>
  );
}
