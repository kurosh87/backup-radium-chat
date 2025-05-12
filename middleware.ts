import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  // Application-specific routes
  '/login(.*)',
  '/register(.*)',
  '/deploy(.*)',
  
  // Clerk authentication routes (needed for callbacks and OAuth)
  '/api/auth/(.*)',
  '/clerk/(.*)',
  '/.well-known/(.*)',
  '/sign-in/(.*)',
  '/sign-up/(.*)'
]);

// Protect all routes except public ones
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Skip Next.js internals and static files
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
