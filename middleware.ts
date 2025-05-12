import { clerkMiddleware } from '@clerk/nextjs/server';

const publicRoutes = [
  '/sign-in(.*)',
  // Add any other public routes here, e.g. '/sign-up(.*)', '/'
];

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
