// src/lib/api.ts
import { apiFetch } from "@/lib/http";

/** Compat: busca el token en varias keys (coincidir con page.tsx) */
const TOKEN_KEYS = ["qash_token", "token", "qash_token"] as const;

export function getToken(): string | null {
if (typeof window === "undefined") return null;
for (const k of TOKEN_KEYS) {
const v = localStorage.getItem(k);
if (v) return v;
}
return null;
}

/** Header opcional con Bearer token */
function authHeader() {
const t = getToken();
return t ? { Authorization: `Bearer ${t}` } : {};
}

/* -------- AUTH -------- */
export function login(username: string, password: string) {
return apiFetch("/api/auth/login", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, password }),
});
}

export function signup(username: string, password: string, fullName?: string) {
return apiFetch("/api/auth/signup", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, password, fullName }),
});
}

export function refresh() {
return apiFetch("/api/auth/refresh", {
method: "POST",
headers: { ...authHeader() },
});
}

/* -------- WALLET -------- */
export function getBalance() {
return apiFetch("/api/wallet/balance", { headers: { ...authHeader() } });
}

export function topup(amount: number) {
return apiFetch("/api/wallet/topup", {
method: "POST",
headers: { "Content-Type": "application/json", ...authHeader() },
body: JSON.stringify({ amount }),
});
}

export function withdraw(amount: number) {
return apiFetch("/api/wallet/withdraw", {
method: "POST",
headers: { "Content-Type": "application/json", ...authHeader() },
body: JSON.stringify({ amount }),
});
}

/* -------- FEED / TRANSACCIONES -------- */
export function getTransactionsFeed(limit = 20, cursor?: string) {
const qs = new URLSearchParams({ limit: String(limit) });
if (cursor) qs.set("cursor", cursor);
return apiFetch(`/api/transactions?${qs.toString()}`, {
headers: { ...authHeader() },
});
}

/** Envía to como username sin @; ajusta al backend: { to, amount, note } */
export function transfer(toHandleOrUser: string, amount: number, note?: string) {
const to = toHandleOrUser.startsWith("@")
? toHandleOrUser.slice(1)
: toHandleOrUser;

return apiFetch("/api/transactions/transfer", {
method: "POST",
headers: { "Content-Type": "application/json", ...authHeader() },
body: JSON.stringify({ to, amount, note }), // <-- si tu backend pide otro campo, cámbialo aquí
});
}

/** Alias que pega al endpoint /send (si lo tienes habilitado) */
export function transferAliasSend(toHandleOrUser: string, amount: number, note?: string) {
const to = toHandleOrUser.startsWith("@")
? toHandleOrUser.slice(1)
: toHandleOrUser;

return apiFetch("/api/transactions/send", {
method: "POST",
headers: { "Content-Type": "application/json", ...authHeader() },
body: JSON.stringify({ to, amount, note }),
});
}

/* -------- USERS -------- */
export function getProfile() {
return apiFetch("/api/users/me", { headers: { ...authHeader() } });
}

export function updateProfile(data: {
avatarUrl?: string;
fullName?: string;
email?: string;
phone?: string;
}) {
return apiFetch("/api/users/me", {
method: "PUT",
headers: { "Content-Type": "application/json", ...authHeader() },
body: JSON.stringify(data),
});
}

export function searchUsers(query: string) {
const q = encodeURIComponent(query);
return apiFetch(`/api/users?search=${q}`, { headers: { ...authHeader() } });
}

export function getUserTransactions(usernameOrHandle: string, limit = 20, cursor?: string) {
const user = usernameOrHandle.startsWith("@")
? usernameOrHandle.slice(1)
: usernameOrHandle;
const qs = new URLSearchParams({ user, limit: String(limit) });
if (cursor) qs.set("cursor", cursor);
return apiFetch(`/api/transactions?${qs.toString()}`, {
headers: { ...authHeader() },
});
}