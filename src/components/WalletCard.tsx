// src/components/WalletCard.tsx
"use client";
import { useEffect, useState } from "react";
import { Wallet } from "@/lib/services";

export default function WalletCard() {
const [balance, setBalance] = useState<number>(0);
const [amount, setAmount] = useState<string>("");

async function load(){
const r = await Wallet.balance();
if (r.ok) setBalance(Number(r.body?.balance ?? 0));
}
useEffect(() => { load(); }, []);

async function doTopup(){
const r = await Wallet.topup(Number(amount));
alert(r.ok ? "Recarga exitosa ✅" : r.body?.message || "Error");
if (r.ok) { setAmount(""); load(); }
}
async function doWithdraw(){
const r = await Wallet.withdraw(Number(amount));
alert(r.ok ? "Retiro hecho ✅" : r.body?.message || "Error");
if (r.ok) { setAmount(""); load(); }
}

const fmt = new Intl.NumberFormat("es-MX",{ style:"currency", currency:"MXN" });

return (
<div className="rounded-2xl bg-white shadow-sm p-5">
<p className="text-sm text-slate-500">Wallet BeQash</p>
<p className="mt-1 text-3xl font-semibold">{fmt.format(balance)}</p>

<div className="mt-3 grid grid-cols-3 gap-3">
<input className="col-span-3 h-11 rounded-xl border border-slate-200 px-3"
value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Monto" />
<button onClick={doTopup} className="col-span-2 h-11 rounded-xl bg-blue-600 text-white">Recargar</button>
<button onClick={doWithdraw} className="h-11 rounded-xl border border-slate-200">Retirar</button>
</div>
</div>
);
}