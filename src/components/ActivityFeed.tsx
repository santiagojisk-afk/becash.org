// src/components/ActivityFeed.tsx
"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/http";

type Tx = {
id: string;
from: string;
to: string;
amount: number;
currency: string;
note?: string;
status: "pending" | "completed" | "failed";
createdAt: string;
type: "sent" | "received" | "topup" | "cashout";
};

export default function ActivityFeed({ username }: { username: string }) {
const [loading, setLoading] = useState(false);
const [txs, setTxs] = useState<Tx[]>([]);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
let stop = false;
async function run() {
if (!username) return;
setLoading(true);
setError(null);

const r = await getTransactions(username);
if (!r.ok || r.data?.ok === false) {
if (!stop) setError(r.data?.message || "No se pudo cargar actividad");
} else if (!stop) {
setTxs(r.data.transactions || []);
}
if (!stop) setLoading(false);
}
run();
return () => { stop = true; };
}, [username]);

if (!username) return null;

return (
<div className="space-y-3">
{loading && <div className="subtle">Cargando actividad…</div>}
{error && <div className="text-red-600 text-sm">Error: {error}</div>}
{txs.length === 0 && !loading ? (
<div className="subtle">No hay movimientos todavía.</div>
) : null}

<ul className="space-y-2">
{txs.map((t) => (
<li key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
<img src="/default-profile.png" alt="avatar" className="w-10 h-10 rounded-full object-cover" />

<div className="flex-1 min-w-0">
<div className="text-sm font-medium truncate">
{t.type === "sent"
? `Enviaste a ${t.to}`
: t.type === "received"
? `Recibiste de ${t.from}`
: t.type === "topup"
? `Depósito`
: `Retiro`}
</div>
<div className="text-xs text-gray-500 truncate">
{new Date(t.createdAt).toLocaleString()} • {t.status}
{t.note ? ` • ${t.note}` : ""}
</div>
</div>

<div className="text-right">
<div className="text-sm font-semibold">
{t.type === "sent" ? "-" : "+"}
{t.amount.toFixed(2)} {t.currency}
</div>
</div>
</li>
))}
</ul>
</div>
);
}