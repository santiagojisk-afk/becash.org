// src/components/SendFlow.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Tx } from "@/lib/services";
import SecureConfirm from "@/components/SecureConfirm"; // usa el tuyo
import SearchUser from "@/components/SearchUser"; // opcional si ya lo tienes

type Props = {
onDone?: () => void; // callback para refrescar saldo/movimientos después del envío
};

export default function SendFlow({ onDone }: Props) {
const [to, setTo] = useState<string>("");
const [amount, setAmount] = useState<string>("");
const [note, setNote] = useState<string>("");
const [confirmOpen, setConfirmOpen] = useState(false);
const [sending, setSending] = useState(false);
const [me, setMe] = useState<any>(null);

// lee usuario demo si lo tienes guardado (no obligatorio)
useEffect(() => {
try {
const raw = localStorage.getItem("qash_demo_user");
if (raw) setMe(JSON.parse(raw));
} catch {}
}, []);

const canSend = useMemo(() => {
const val = Number(amount);
return !!to && !Number.isNaN(val) && val > 0;
}, [to, amount]);

function pickPreset(v: number) {
setAmount(String(v));
}

function handleSearchPick(u: { username?: string; email?: string }) {
// Prioriza username; si no hay, usa email
if (u?.username) setTo(u.username.startsWith("@") ? u.username : "@" + u.username);
else if (u?.email) setTo(u.email);
}

function openConfirm() {
if (!canSend) {
alert("Completa destinatario y monto válido.");
return;
}
setConfirmOpen(true);
}

async function doTransfer() {
// Ejecuta envío DESPUÉS de confirmar (SecureConfirm llama a onConfirm)
try {
setSending(true);
const payload = {
to: normalizeTo(to),
amount: Number(amount),
note: note?.trim() || undefined,
};

const r = await Tx.transfer(payload);
if (!r.ok) {
alert(r.body?.message || "No se pudo enviar");
return;
}

// limpieza de forma
setNote("");
setAmount("");
// mantenemos el 'to' por si quiere repetir envío
alert("Envío realizado 💸");
onDone?.();
} finally {
setSending(false);
setConfirmOpen(false);
}
}

return (
<div className="rounded-2xl bg-white shadow-sm p-5 space-y-4">
<header className="flex items-center justify-between">
<div className="text-sm text-slate-500">
Enviar desde <strong>{me?.username ? `@${me.username}` : "tu BeQash"}</strong>
</div>
</header>

{/* Buscar/ingresar destinatario */}
<div className="space-y-2">
<label className="text-xs text-slate-500">Para</label>
{/* Si tienes SearchUser, lo dejas. Si no, comenta esta línea */}
{typeof SearchUser === "function" ? (
<SearchUser
placeholder="@usuario o correo"
onPick={handleSearchPick}
value={to}
onChange={(v: string) => setTo(v)}
/>
) : (
<input
className="h-11 w-full rounded-xl border border-slate-200 px-3"
placeholder="@usuario o correo"
value={to}
onChange={(e) => setTo(e.target.value)}
/>
)}
</div>

{/* Monto */}
<div className="space-y-2">
<label className="text-xs text-slate-500">Monto</label>
<input
className="h-11 w-full rounded-xl border border-slate-200 px-3"
placeholder="0.00"
inputMode="decimal"
value={amount}
onChange={(e) => setAmount(e.target.value)}
/>
{/* Presets compactos */}
<div className="flex flex-wrap gap-2">
{[100, 200, 500, 1000].map((v) => (
<button
key={v}
type="button"
onClick={() => pickPreset(v)}
className="px-3 h-9 rounded-lg bg-slate-50 border border-slate-200 text-sm"
>
+{v.toLocaleString("es-MX")}
</button>
))}
</div>
</div>

{/* Nota opcional */}
<div className="space-y-2">
<label className="text-xs text-slate-500">Nota (opcional)</label>
<input
className="h-11 w-full rounded-xl border border-slate-200 px-3"
placeholder="¿Por qué es este envío?"
value={note}
onChange={(e) => setNote(e.target.value)}
/>
</div>

{/* Acciones */}
<div className="pt-2">
<button
disabled={!canSend || sending}
onClick={openConfirm}
className="h-12 w-full rounded-xl bg-blue-600 text-white font-medium shadow-sm disabled:opacity-60"
>
{sending ? "Enviando…" : "Enviar 💸"}
</button>
</div>

{/* Confirmación segura (usa tu componente actual) */}
<SecureConfirm
open={confirmOpen}
onClose={() => setConfirmOpen(false)}
onConfirm={doTransfer}
/>
</div>
);
}

/* ---------- Helpers ---------- */
function normalizeTo(to: string) {
const t = (to || "").trim();
if (!t) return t;
// si parece username, asegúrate que empiece con @
if (/^[A-Za-z0-9._-]+$/.test(t)) return "@" + t;
if (/^@/.test(t)) return t;
// si es email o ya válido, lo dejas igual
return t;
}