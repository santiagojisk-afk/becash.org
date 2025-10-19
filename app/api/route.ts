import { API_BASE, readBody , jsonOrText,authHeaders, pass } from "./_utils";

export const dynamic = "force-dynamic"; // no cache

export async function POST(req: Request) {
// MUY IMPORTANTE: pasar el cuerpo crudo (para verificar firmas)
const raw = await req.arrayBuffer();

// Pasamos solo headers necesarios (firma + tipo de contenido)
const out = new Headers();
out.set("content-type", req.headers.get("content-type") || "application/json");
const stripeSig = req.headers.get("stripe-signature");
if (stripeSig) out.set("stripe-signature", stripeSig);
const conektaSig = req.headers.get("conekta-signature");
if (conektaSig) out.set("conekta-signature", conektaSig);
const svix = req.headers.get("svix-signature"); // por si usas Svix/Clerk/etc
if (svix) out.set("svix-signature", svix);

const resp = await fetch(`${API_BASE}/webhooks/provider`, {
method: "POST",
headers: out,
body: raw, // cuerpo crudo
});

// Devolvemos tal cual (texto/JSON) y status original
const text = await resp.text();
return new Response(text, {
status: resp.status,
headers: { "content-type": resp.headers.get("content-type") || "text/plain" },
});
}
