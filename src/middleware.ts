import { NextResponse } from 'next/server';

// CLERK AUTHENTICATION DISABLED - Keeping imports for future use
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isPublicRoute = createRouteMatcher([
//   '/',
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/api/webhooks(.*)',
// ]);

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect();
//   }
// });

// Middleware disabled - no authentication required
// Just pass through all requests
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};