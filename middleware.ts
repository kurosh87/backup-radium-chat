import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Create a matcher for public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/trpc(.*)',
  '/favicon.ico',
  '/(.*?\\.?\\w+)$' // Match any static files
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is public, don't require authentication
  if (isPublicRoute(req)) {
    return; // Don't do anything for public routes
  }
  
  // For all other routes, require authentication
  const session = await auth();
  if (!session.userId) {
    // This will redirect to the sign-in page
    return new Response('Unauthorized', { status: 401 });
  }
  
  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?|ttf|ico|json)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
