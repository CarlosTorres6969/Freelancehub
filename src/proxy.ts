import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const protectedPaths = ["/dashboard", "/messages", "/checkout", "/favorites", "/profile", "/admin"]
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  if (isProtected && !request.cookies.has("freelancehub_session")) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("auth", "login")
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
