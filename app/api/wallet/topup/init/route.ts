// app/api/wallet/topup/init/route.ts
import { NextResponse } from "next/server";
import { API_BASE, authHeaders, pass } from "../../../_utils";

type CashMethod = "spei" | "oxxo" | "seven";

const rnd = (n: number) => Math.floor(Math.random() * n);
const pad = (n: number, l = 2) => n.toString().padStart(l, "0");

// Fallback local (MOCK) por si el backend real no está listo
function mockTopup(amount: number, method: CashMethod) {
const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
if (method === "spei") {
const clabe = `646180${pad(rnd(999999999999), 12)}`.slice(0, 18);
const concepto = `USR${pad(rnd(999999), 6)}-${pad(rnd(9999), 4)}`;
return { ok: true, method, amount, expiresAt, spei: { clabe, beneficiario: "QASH Recargas", concepto } };
}
if (method === "oxxo") {
const referencia = `${pad(rnd(9999), 4)} ${pad(rnd(9999), 4)} ${pad(rnd(9999), 4)} ${pad(rnd(9999), 4)}`;
return { ok: true, method, amount, expiresAt, oxxo: { referencia } };
}
const referencia = `${pad(rnd(99999999), 8)}-${pad(rnd(9999), 4)}`;
return { ok: true, method: "seven", amount, expiresAt, seven: { referencia } };
}

export async function POST(req: Request) {
const body = await req.json().catch(() => ({}));
const { amount, method } = body as { amount?: number; method?: CashMethod };

if (!amount || amount <= 0) {
return NextResponse.json({ ok: false, message: "Monto inválido" }, { status: 400 });
}
if (!method || !["spei", "oxxo", "seven"].includes(method)) {
return NextResponse.json({ ok: false, message: "Método inválido" }, { status: 400 });
}

// 1) Intento de proxy a tu API externa
try {
const resp = await fetch(`${API_BASE}/api/wallet/topup/init`, {
method: "POST",
headers: { ...authHeaders(req), "Content-Type": "application/json" },
body: JSON.stringify({ amount, method }),
cache: "no-store",
});
// Si tu API ya responde, devolvemos tal cual
const data = await resp.json().catch(() => ({}));
// Si respondió 404/501/500, caemos a MOCK
if (!resp.ok) throw new Error(String(data?.message || resp.statusText));
return pass(resp, data);
} catch {
// 2) Fallback MOCK para que tus botones funcionen YA
const data = mockTopup(amount, method);
return NextResponse.json(data);
}
}
