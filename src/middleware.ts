import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("weebzdev.gl-token")?.value;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasToken = token ?? cookieHeader.includes("weebzdev.gl-token=");

  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isLoginPath = pathname.startsWith("/auth/");

  if (!hasToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (hasToken && isLoginPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
