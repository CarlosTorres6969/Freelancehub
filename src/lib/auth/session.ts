import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

export interface SessionUser { id: string; email: string }
const COOKIE = "freelancehub_session"
const TTL = 60 * 60 * 24 * 7

function secret() {
  if (!process.env.AUTH_SECRET) throw new Error("AUTH_SECRET no configurado")
  return process.env.AUTH_SECRET
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url")
}

export async function createSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now()/1000)+TTL })).toString("base64url")
  const store = await cookies()
  store.set(COOKIE, `${payload}.${sign(payload)}`, { httpOnly:true, secure:process.env.NODE_ENV==="production", sameSite:"lax", path:"/", maxAge:TTL })
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null
  const expected = sign(payload)
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  try {
    const data = JSON.parse(Buffer.from(payload,"base64url").toString())
    return data.exp > Date.now()/1000 ? { id:data.id, email:data.email } : null
  } catch { return null }
}

export async function deleteSession() { (await cookies()).delete(COOKIE) }
