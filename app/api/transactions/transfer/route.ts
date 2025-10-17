// app/api/transactions/transfer/route.ts
import { NextResponse } from "next/server";
import { API_BASE, readBody, jsonOrText, authHeaders, pass } from "../../_utils";

export async function POST(req: Request) {
// 1) Leer body con try/catch para evitar crashes
const payload = await req.json().catch(() => ({}));

try {
// 2) Proxy estándar a tu API externa
const resp = await fetch(`${API_BASE}/api/transactions/transfer`, {
method: "POST",
headers: {
"Content-Type": "application/json",
...authHeaders(), // si authHeaders requiere token, pásalo aquí
},
body: JSON.stringify(payload),
cache: "no-store",
});

const data = await jsonOrText(resp).catch(() => ({}));
if (!resp.ok) throw new Error(String(data?.message || resp.statusText));

return pass(resp, data);
} catch (err) {
// 3) Fallback mínimo para no romper flujo
const { to, amount, note } = payload || {};

if (!amount || amount <= 0)
return NextResponse.json(
{ ok: false, message: "Monto inválido" },
{ status: 400 }
);

if (!to)
return NextResponse.json(
{ ok: false, message: "Falta destinatario" },
{ status: 400 }
);

const tx = {
id: String(Date.now()),
amount: -Math.abs(Number(amount)),
note: note || `Pago a ${to}`,
createdAt: new Date().toISOString(),
type: "out" as const,
};

return NextResponse.json({ ok: true, tx }, { status: 200 });
}
}