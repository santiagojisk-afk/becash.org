// app/api/_utils.ts

// === Base URL del backend (sin / al final) ===
export const API_BASE = String(
process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

// Lee JSON del body en rutas Next.js
export async function readBody(req: Request): Promise<any> {
try {
return await req.json();
} catch {
return {};
}
}

// Intenta parsear JSON; si no, devuelve el texto bruto
export async function jsonOrText(resp: Response) {
const txt = await resp.text();
try {
return JSON.parse(txt);
} catch {
return { ok: false, message: txt || resp.statusText };
}
}

// Reenvía el Authorization del request (o lo arma desde cookie qash_token)
export function authHeaders(req?: Request): HeadersInit {
const out = new Headers();

// 1) Si vino Authorization en la petición del browser → lo pasamos al backend
const auth =
req?.headers.get("authorization") || req?.headers.get("Authorization");
if (auth) out.set("Authorization", auth);

// 2) Si no vino, intentamos sacarlo de la cookie qash_token
if (!out.has("Authorization")) {
const cookie = req?.headers.get("cookie") || "";
const m = cookie.match(/(?:^|;\s*)qash_token=([^;]+)/);
if (m) out.set("Authorization", `Bearer ${decodeURIComponent(m[1])}`);
}

return out;
}

// Helper para responder desde el proxy conservando status
export function pass(resp: Response, json: any) {
return new Response(JSON.stringify(json), {
status: resp.status,
headers: { "Content-Type": "application/json" },
});
}