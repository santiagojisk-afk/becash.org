// app/api/wallet/withdraw/init/route.ts
import { NextResponse } from "next/server";
import { API_BASE, authHeaders, pass } from "../../../_utils";

type CashMethod = "spei" | "oxxo" | "seven";

const rnd = (n: number) => Math.floor(Math.random() * n);
const pad = (n: number, l = 2) => n.toString().padStart(l, "0");

function mockWithdraw(amount: number, method: CashMethod) {
if (method === "spei") {
const rastreo = `RST-${pad(rnd(999999), 6)}-${pad(rnd(9999), 4)}`;
return {
ok: true,
method,
amount,
spei: { rastreo, beneficiario: "Beneficiario CLABE", banco: "Banco destino", concepto: "RETIRO-QASH" },
};
}
const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
const retiro = `RTO-${pad(rnd(999999), 6)}-${pad(rnd(999), 3)}`;
const pin = `${pad(rnd(9999), 4)}`;
if (method === "oxxo") return { ok: true, method, amount, oxxo: { retiro, pin, expiresAt } };
return { ok: true, method: "seven", amount, seven: { retiro, pin, expiresAt } };
}

export async function POST(req: Request) {
const body = await req.json().catch(() => ({}));
const { amount, method, destClabe } = body as { amount?: number; method?: CashMethod; destClabe?: string };

if (!amount || amount <= 0) {
return NextResponse.json({ ok: false, message: "Monto inválido" }, { status: 400 });
}
if (!method || !["spei", "oxxo", "seven"].includes(method)) {
return NextResponse.json({ ok: false, message: "Método inválido" }, { status: 400 });
}
if (method === "spei") {
const digits = String(destClabe || "").replace(/\D/g, "");
if (digits.length !== 18) {
return NextResponse.json({ ok: false, message: "CLABE destino inválida" }, { status: 400 });
}
}

// 1) Intento de proxy a tu API externa
try {
const resp = await fetch(`${API_BASE}/api/wallet/withdraw/init`, {
method: "POST",
headers: { ...authHeaders(req), "Content-Type": "application/json" },
body: JSON.stringify({ amount, method, destClabe }),
cache: "no-store",
});
const data = await resp.json().catch(() => ({}));
if (!resp.ok) throw new Error(String(data?.message || resp.statusText));
return pass(resp, data);
} catch {
// 2) Fallback MOCK para que funcione ya
const data = mockWithdraw(amount, method);
return NextResponse.json(data);
}
}