// src/lib/http.ts
// Adaptador que devuelve { ok, status, data } y además
// INYECTA Authorization automáticamente si no viene.

export type HttpsResponse<T = any> = {
ok: boolean;
status: number;
data?: T;
};

const BASE = (process.env.NEXT_PUBLIC_API_URL || "https://qash-backend-production.up.railway.app").replace(/\/+$/, "");

// mismas keys que usa el resto del front
const TOKEN_KEYS = ["qash_demo_token", "token", "qash_token"] as const;
function readToken(): string | null {
if (typeof window === "undefined") return null;
for (const k of TOKEN_KEYS) {
const v = localStorage.getItem(k);
if (v) return v;
}
return null;
}

/** Convierte headers (Headers | objeto | array | string JSON) a Headers válidos */
function toHeaders(input?: any): Headers {
const h = new Headers();
if (!input) return h;

if (typeof Headers !== "undefined" && input instanceof Headers) return input;

if (typeof input === "string") {
try {
const obj = JSON.parse(input);
for (const [k, v] of Object.entries(obj)) {
if (k != null && v != null) h.append(String(k), String(v));
}
return h;
} catch {
return h; // ignora string no parseable
}
}

if (Array.isArray(input)) {
for (const pair of input) {
if (!pair) continue;
const [k, v] = pair as any[];
if (k != null && v != null) h.append(String(k), String(v));
}
return h;
}

try {
const entries = input instanceof Map ? input.entries() : Object.entries(input);
for (const [k, v] of entries as any) {
if (k != null && v != null) h.append(String(k), String(v));
}
} catch {}
return h;
}

function buildUrl(path: string) {
const clean = `/${String(path || "").replace(/^\/+/, "")}`;
return `${BASE}${clean}`;
}

async function core<T = any>(
path: string,
opts: RequestInit & { body?: any } = {}
): Promise<HttpsResponse<T>> {
const url = buildUrl(path);

const hdrs = toHeaders(opts.headers);

// Inyecta Authorization si no viene
let hasAuth = false;
for (const k of hdrs.keys()) {
if (k.toLowerCase() === "authorization") { hasAuth = true; break; }
}
if (!hasAuth) {
const t = readToken();
if (t) hdrs.set("Authorization", `Bearer ${t}`);
}

const hasBody = typeof opts.body !== "undefined";
const isForm =
typeof FormData !== "undefined" && hasBody && opts.body instanceof FormData;

if (hasBody && !isForm) {
let hasCT = false;
for (const k of hdrs.keys()) if (k.toLowerCase() === "content-type") { hasCT = true; break; }
if (!hasCT) hdrs.set("Content-Type", "application/json");
}

let body: BodyInit | undefined;
if (hasBody) {
body = isForm
? (opts.body as FormData)
: typeof opts.body === "string"
? opts.body
: JSON.stringify(opts.body);
}

const init: RequestInit = {
method: opts.method || "GET",
headers: hdrs,
body,
mode: "cors",
cache: "no-store",
credentials: opts.credentials, // normalmente omit
signal: opts.signal,
};

if (typeof window !== "undefined") {
console.debug("[httpsFetch] →", {
url,
method: init.method,
hasBody: !!body,
headers: Object.fromEntries((hdrs as Headers).entries()),
});
}

try {
const res = await fetch(url, init);
const text = await res.text();

let data: any = undefined;
try { data = text ? JSON.parse(text) : undefined; } catch { data = text; }

if (!res.ok) return { ok: false, status: res.status, data };
return { ok: true, status: res.status, data: data as T };
} catch (err: any) {
console.error("[httpsFetch] network error:", err?.message || err);
return { ok: false, status: 0, data: undefined };
}
}

/** Soporta:
* apiFetch("/ruta", opts)
* apiFetch("/ruta")({ ...opts }) // curry
*/
export function httpsFetch<T = any>(
path: string,
opts?: RequestInit & { body?: any }
):
| Promise<HttpsResponse<T>>
| ((opts2?: RequestInit & { body?: any }) => Promise<HttpsResponse<T>>) {
if (typeof path !== "string") throw new Error("httpsFetch(path) requiere string");
if (typeof opts !== "undefined") return core<T>(path, opts);
return (opts2?: RequestInit & { body?: any }) => core<T>(path, opts2);
}

export const apiFetch = httpsFetch;
export default httpsFetch;