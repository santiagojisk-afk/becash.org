"use client";

import { useState } from "react";
import { UserPublic } from "@/types";

type Props = {
token: string | null;
toUser?: UserPublic; // 👈 ahora es opcional
onSubmitted?: () => void;
onRequireSecureConfirm?: () => void;
};

export default function Txcomposer({
token,
toUser,
onSubmitted,
onRequireSecureConfirm,
}: Props) {
const [amount, setAmount] = useState<string>("");
const [note, setNote] = useState<string>("");
const [loading, setLoading] = useState(false);

const canSend = !!token && !!toUser && Number(amount) > 0;

async function handleSend(e: React.FormEvent) {
e.preventDefault();
if (!canSend) return;
setLoading(true);

try {
// Aquí sólo simulamos. Conecta tu backend real cuando esté listo.
await new Promise((r) => setTimeout(r, 500));
onRequireSecureConfirm?.(); // abre FaceID/Passcode simulado si así lo quieres
onSubmitted?.();
setAmount("");
setNote("");
} finally {
setLoading(false);
}
}

return (
<form onSubmit={handleSend} className="card p-6">
<h3 className="text-lg font-semibold text-[#0B1530] mb-4">
{/* 👇 usamos optional chaining para no reventar cuando no hay usuario */}
Enviar a <span className="text-blue-600">
{toUser ? `@${toUser.username}` : "— selecciona un contacto —"}
</span>
</h3>

<div className="grid gap-3">
<input
type="number"
inputMode="decimal"
placeholder="Monto"
value={amount}
onChange={(e) => setAmount(e.target.value)}
className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f5f7fa] focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

<input
type="text"
placeholder="Nota (opcional)"
value={note}
onChange={(e) => setNote(e.target.value)}
className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f5f7fa] focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

<button
type="submit"
disabled={!canSend || loading}
className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
>
{loading ? "Enviando…" : "Enviar"}
</button>
</div>

{!toUser && (
<p className="text-xs text-gray-500 mt-3">
Tip: primero elige un contacto en “Send Money”.
</p>
)}
</form>
);
}
