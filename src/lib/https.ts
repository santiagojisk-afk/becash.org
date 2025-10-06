// src/lib/https.ts
export type Ok<T> = { ok: true; status: number; data: T };
export type Err = { ok: false; status: number; message: string };
export type Resp<T> = Ok<T> | Err;

const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");

function buildUrl(path: string) {
const clean = `/${String(path || "").replace(/^\/+/, "")}`;
return `${BASE}${clean}`;
}

function toHeaders(h?: HeadersInit | Record<string,string>): Headers {
if (!h) return new Headers();
if (typeof Headers !== "undefined" && h instanceof Headers) return h;
const out = new Headers();
if (Array.isArray(h as any)) { for (const [k,v] of h as any) if (k!=null&&v!=null) out.set(String(k),String(v)); return out; }
for (const [k,v] of Object.entries(h as any)) if (k!=null&&v!=null) out.set(String(k),String(v));
return out;
}

export async function httpsFetch<T=any>(path: string, opts: RequestInit & { body?: any } = {}): Promise<Resp<T>> {
const url = buildUrl(path);
const headers = toHeaders(opts.headers);
const hasBody = typeof opts.body !== "undefined";
const isForm = typeof FormData !== "undefined" && hasBody && opts.body instanceof FormData;
if (hasBody && !isForm && !headers.has("Content-Type")) headers.set("Content-Type","application/json");
const body: BodyInit|undefined = !hasBody ? undefined : isForm ? (opts.body as FormData)
: typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);

try {
const res = await fetch(url, { method: opts.method || "GET", headers, body, mode: "cors", cache: "no-store", credentials: opts.credentials });
const text = await res.text();
let data:any; try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
if (!res.ok) return { ok:false, status:res.status, message:(data?.message || data?.error || res.statusText) };
return { ok:true, status:res.status, data };
} catch(e:any) {
return { ok:false, status:0, message:e?.message || "Network error" };
}
}

export { httpsFetch as apiFetch }; // por si tienes imports previos
export default httpsFetch;