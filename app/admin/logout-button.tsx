"use client"

import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
    >
      Log out
    </button>
  )
}
