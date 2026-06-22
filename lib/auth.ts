import { cookies } from "next/headers"

const COOKIE_NAME = "lensen_admin_session"

async function getKey() {
  const secret = process.env.SESSION_SECRET || "dev-secret-change-me-in-production"
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret.padEnd(32, "x").slice(0, 32)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

async function sign(payload: object): Promise<string> {
  const key = await getKey()
  const data = new TextEncoder().encode(JSON.stringify(payload))
  const sig = await crypto.subtle.sign("HMAC", key, data)
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
  const dataB64 = btoa(String.fromCharCode(...data))
  return `${dataB64}.${sigB64}`
}

async function verify(token: string): Promise<{ isAdmin: boolean } | null> {
  const [dataB64, sigB64] = token.split(".")
  if (!dataB64 || !sigB64) return null
  const key = await getKey()
  const data = Uint8Array.from(atob(dataB64), (c) => c.charCodeAt(0))
  const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0))
  const valid = await crypto.subtle.verify("HMAC", key, sig, data)
  if (!valid) return null
  try {
    return JSON.parse(new TextDecoder().decode(data))
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return { isAdmin: false }
  const payload = await verify(token)
  return payload ?? { isAdmin: false }
}

export async function createSession() {
  const token = await sign({ isAdmin: true, createdAt: Date.now() })
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function login(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  // Simple constant-time comparison
  if (password.length !== expected.length) return false
  let match = 0
  for (let i = 0; i < password.length; i++) {
    match |= password.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  if (match !== 0) return false
  await createSession()
  return true
}
