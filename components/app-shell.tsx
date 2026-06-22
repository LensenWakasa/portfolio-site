"use client"

import { usePathname } from "next/navigation"
import { ReaderProvider } from "@/components/reader-context"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <ReaderProvider>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </ReaderProvider>
  )
}
