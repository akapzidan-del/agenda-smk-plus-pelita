// src/security.js
// Client-side security hardening helpers.
import { useEffect, useRef } from "react"

export const AUTH_STORAGE_KEY = "smk_pelita_auth"
const ATTEMPTS_KEY = "smk_pelita_login_attempts"

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000
const IDLE_TIMEOUT_MS = 15 * 60 * 1000
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

const HMAC_KEY_MATERIAL =
  "smk-plus-pelita::session::v1::" +
  (typeof window !== "undefined" ? window.location.origin : "dev")

function bufToB64(buf) {
  const bytes = new Uint8Array(buf)
  let s = ""
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
function b64ToBuf(b64) {
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4))
  const s = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad)
  const buf = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) buf[i] = s.charCodeAt(i)
  return buf.buffer
}

async function getCryptoKey() {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(HMAC_KEY_MATERIAL), "PBKDF2", false, ["deriveKey"])
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode("smk-pelita-salt"), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function createSessionToken(user) {
  const payload = { user, iat: Date.now(), exp: Date.now() + SESSION_TTL_MS, nonce: crypto.randomUUID() }
  const enc = new TextEncoder()
  const payloadStr = JSON.stringify(payload)
  const payloadB64 = bufToB64(enc.encode(payloadStr))
  const key = await getCryptoKey()
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr))
  return payloadB64 + "." + bufToB64(sig)
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  try {
    const payloadBytes = b64ToBuf(parts[0])
    const dec = new TextDecoder()
    const payloadStr = dec.decode(payloadBytes)
    const payload = JSON.parse(payloadStr)
    const key = await getCryptoKey()
    const sigBuf = b64ToBuf(parts[1])
    const ok = await crypto.subtle.verify("HMAC", key, sigBuf, new TextEncoder().encode(payloadStr))
    if (!ok) return null
    if (!payload.exp || Date.now() > payload.exp) return null
    if (!payload.user || typeof payload.user !== "object") return null
    if (!["siswa", "guru"].includes(payload.user.role)) return null
    if (typeof payload.user.name !== "string" || typeof payload.user.nisn !== "string") return null
    return payload.user
  } catch {
    return null
  }
}

export async function persistSession(user, remember) {
  if (!crypto?.subtle) {
    // No Web Crypto available (insecure context): do not persist a tamperable
    // session. Keep the session in memory only for this page load.
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {}
    return
  }
  const token = await createSessionToken(user)
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {}
  const storage = remember ? localStorage : sessionStorage
  try { storage.setItem(AUTH_STORAGE_KEY, token) } catch {}
}

export async function loadSession() {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!token) return null
    if (!crypto?.subtle) {
      // No Web Crypto: persisted sessions are not trusted.
      clearAuthStorage()
      return null
    }
    const user = await verifySessionToken(token)
    if (!user) clearAuthStorage()
    return user
  } catch {
    return null
  }
}

export function clearAuthStorage() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(ATTEMPTS_KEY)
  } catch {}
}

export function getLoginAttempts() {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    if (!raw) return { count: 0, first: 0, lockedUntil: 0 }
    const o = JSON.parse(raw)
    if (!o || typeof o !== "object") return { count: 0, first: 0, lockedUntil: 0 }
    const count = Number.isFinite(o.count) ? Math.max(0, Math.floor(o.count)) : 0
    const first = Number.isFinite(o.first) ? Math.max(0, Math.floor(o.first)) : 0
    const lockedUntil = Number.isFinite(o.lockedUntil) ? Math.max(0, Math.floor(o.lockedUntil)) : 0
    return { count, first, lockedUntil }
  } catch {
    return { count: 0, first: 0, lockedUntil: 0 }
  }
}

export function isLockedOut() {
  const a = getLoginAttempts()
  if (a.lockedUntil && Date.now() < a.lockedUntil) {
    return { locked: true, remainingMs: a.lockedUntil - Date.now() }
  }
  return { locked: false, remainingMs: 0 }
}

export function recordFailedAttempt() {
  const a = getLoginAttempts()
  const now = Date.now()
  let count = a.count
  if (a.first && now - a.first > LOCKOUT_MS) count = 0
  count += 1
  let lockedUntil = 0
  if (count >= MAX_ATTEMPTS) lockedUntil = now + LOCKOUT_MS
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ count, first: a.first || now, lockedUntil }))
  } catch {}
  return { count, locked: lockedUntil > 0, lockedUntil }
}

export function resetLoginAttempts() {
  try { localStorage.removeItem(ATTEMPTS_KEY) } catch {}
}

export function sanitizeText(value, maxLen = 128) {
  if (value == null) return ""
  let s = String(value)
  s = s.replace(/[\u0000-\u001F\u007F]/g, "")
  s = s.trim()
  if (s.length > maxLen) s = s.slice(0, maxLen)
  return s
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
}

export function sanitizeFilename(value, fallback = "export") {
  if (value == null) return fallback
  let s = String(value).trim()
  s = s.replace(/[\\/:*?"<>|]/g, "_")
  s = s.replace(/[\u0000-\u001F\u007F]/g, "")
  if (!s || s === "." || s === "..") return fallback
  if (s.length > 120) s = s.slice(0, 120)
  return s
}

export function sanitizePhone(value) {
  if (value == null) return ""
  return String(value).replace(/[^0-9]/g, "").slice(0, 20)
}

export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) return ""
  let s = String(value)
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s
  return s
}

export function validateIdentifier(role, value) {
  const v = sanitizeText(value, 32)
  if (role === "siswa") return /^\d{8,16}$/.test(v)
  return /^\d{8,25}$/.test(v)
}

export function validatePassword(pw) {
  const p = String(pw || "")
  if (p.length < 4 || p.length > 128) return false
  return true
}

export const ROLE_PAGES = {
  siswa: new Set(["absensi-siswa", "tidak-hadir", "kepulangan", "jadwal"]),
  guru: new Set(["dashboard", "absensi-siswa", "tidak-hadir", "kepulangan", "absensi-guru", "agenda-piket", "jurnal", "jam-kosong", "kegiatan", "laporan", "jadwal"]),
}

export function canAccess(role, page) {
  const set = ROLE_PAGES[role] || ROLE_PAGES.siswa
  return set.has(page)
}

export function defaultPageFor(role) {
  return role === "siswa" ? "absensi-siswa" : "dashboard"
}

export function useIdleLogout(onLogout, enabled = true) {
  const timerRef = useRef(null)
  useEffect(() => {
    if (!enabled) return
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        try { onLogout() } catch {}
      }, IDLE_TIMEOUT_MS)
    }
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "visibilitychange"]
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onLogout, enabled])
}
