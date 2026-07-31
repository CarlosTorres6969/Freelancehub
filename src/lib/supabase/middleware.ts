import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const protectedPaths = ["/dashboard", "/messages", "/checkout", "/favorites", "/profile", "/services/new"]
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  )

  if (!isProtected) return supabaseResponse

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("auth", "login")
    return NextResponse.redirect(url)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role

  if (role === "client" && request.nextUrl.pathname.startsWith("/dashboard/freelancer")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard/client"
    return NextResponse.redirect(url)
  }

  if (role === "client" && request.nextUrl.pathname.startsWith("/services/new")) {
    const url = request.nextUrl.clone()
    url.pathname = "/marketplace"
    return NextResponse.redirect(url)
  }

  if (role === "freelancer" && request.nextUrl.pathname.startsWith("/dashboard/client")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard/freelancer"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
