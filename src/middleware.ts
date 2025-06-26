import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies;
  const token = cookie.get("wb-token");
  const pathname = request.url;

  console.log({ token, pathname });

  if (!token && pathname !== "http://localhost:3000/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return null;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
