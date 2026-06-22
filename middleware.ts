import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isLoginRoute = req.nextUrl.pathname === "/admin/login"
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/admin")

  const sessionCookie = req.cookies.get("lensen_admin_session")?.value

  if ((isAdminRoute || isApiRoute) && !isLoginRoute && !sessionCookie) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
