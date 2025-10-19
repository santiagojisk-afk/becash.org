// src/lib/https.ts
export type Ok<T> = { ok: true; status: number; data: T; message?: string };
export type Err = { ok: false; status: number; data: null; message: string };
export type Resp<T> = Ok<T> | Err;

const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");

function buildUrl(path: string) {
const clean = `${String(path || "")}`.replace(/^\/+/, "");
return `${BASE}/${clean}`;
}

function toHeaders(h?: HeadersInit | Record<string, string>): Headers {
if (!h) return new Headers();
if (typeof Headers !== "undefined" && h instanceof Headers) return h;
const out = new Headers();
if (Array.isArray(h as any)) {
for (const [k, v] of h as any) if (k != null && v != null) out.set(String(k), String(v));
} else {
for (const [k, v] of Object.entries(h as any)) if (k != null && v != null) out.set(String(k), String(v as any));
}
return out;
}

export async function httpsFetch<T = any>(
path: string,
opts: RequestInit & { body?: any } = {}
): Promise<Resp<T>> {
const url = buildUrl(path);
const headers = toHeaders(opts.headers);

const hasBody = typeof opts.body !== "undefined";
const isForm =
typeof FormData !== "undefined" && hasBody && opts.body instanceof FormData;

if (hasBody && !isForm && !headers.has("Content-Type")) {
headers.set("Content-Type", "application/json");
}

const body: BodyInit | undefined = !hasBody
? undefined
: isForm
? (opts.body as FormData)
: typeof opts.body === "string"
? opts.body
: JSON.stringify(opts.body);

try {
const res = await fetch(url, {
method: opts.method || "GET",
headers,
body,
mode: "cors",
cache: "no-store",
credentials: "include", // importante para auth por cookies
});

// intenta parsear JSON; tolera texto vacío
const text = await res.text();
let json: any = {};
try { json = text ? JSON.parse(text) : {}; } catch { json = text; }

if (res.ok) {
// Normaliza: si el backend trae {data}, úsalo; si no, envuelve todo el JSON en data
const data: T = (json && typeof json === "object" && "data" in json)
? (json.data as T)
: (json as T);
return { ok: true, status: res.status, data, message: json?.message };
}

const message = (json as any)?.message || (json as any)?.error || res.statusText || `HTTP ${res.status}`;
return { ok: false, status: res.status, data: null, message };
} catch (e: any) {
return { ok: false, status: 0, data: null, message: e?.message || "Network error" };
}
}

// compatibilidad con imports existentes
export { httpsFetch as apiFetch };
export default httpsFetch;