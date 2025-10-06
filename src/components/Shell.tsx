// src/components/Shell.tsx
"use client";

import { useMemo, useState } from "react";

import Header from "@/components/Header";
import ProfileMenu from "@/components/ProfileMenu";
import WalletCard from "@/components/WalletCard";
import ActivityFeed from "@/components/ActivityFeed";
import TopupModal from "@/components/TopupModal";
import SendFlow from "@/components/SendFlow"; // usa SearchUser + SecureConfirm internamente

type UserPublic = {
username: string;
name?: string;
fullName?: string;
avatarUrl?: string;
};

type Props = {
token: string;
me: UserPublic;
};

export default function Shell({ token, me }: Props) {
const [menuOpen, setMenuOpen] = useState(false);
const [topupOpen, setTopupOpen] = useState(false);
const [showSend, setShowSend] = useState(false);
const [tab, setTab] = useState<"home" | "activity">("home");

const helloName = useMemo(
() => me?.fullName || me?.name || me?.username || "Usuario",
[me]
);

return (
<div className="min-h-dvh bg-[#f5f7fb] text-slate-900">
{/* Header con logo que abre el menú */}
<Header ontopmenu ={() => setMenuOpen(true)} />
<ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

{/* Contenido */}
<main className="mx-auto grid max-w-6xl gap-6 px-4 py-6">
{/* Saludo corto */}
<section className="card p-5">
<h1 className="text-lg font-semibold">¡Hola, {helloName}!</h1>
<p className="subtle">Listo para enviar dinero 🚀</p>
</section>

{/* Wallet al centro */}
<section className="card flex flex-col items-center justify-center p-6">
<div className="w-full max-w-md">
<WalletCard />
</div>

{/* Óvalos: Enviar / Actividad */}
<div className="mt-5 flex w-full max-w-md items-center justify-center gap-3">
<button
onClick={() => {
setShowSend(true);
setTab("home");
}}
className="rounded-full bg-[#0a66ff] px-7 py-2 text-white shadow hover:opacity-90"
>
Enviar
</button>
<button
onClick={() => {
setShowSend(false);
setTab("activity");
}}
className="rounded-full bg-[#0a66ff] px-7 py-2 text-white shadow hover:opacity-90"
>
Actividad
</button>
</div>

{/* Botón grande: Agregar fondos */}
<div className="mt-6 w-full max-w-md">
<button
onClick={() => setTopupOpen(true)}
className="w-full rounded-xl bg-[#0a66ff] px-6 py-3 text-base font-semibold text-white shadow hover:opacity-90"
>
Agregar fondos
</button>
<p className="mt-2 text-center text-sm text-slate-500">
Puedes recargar por OXXO o SPEI.
</p>
</div>
</section>

{/* Área dinámica: envío o actividad */}
<section className="grid gap-6">
{showSend && tab === "home" ? (
<div className="card p-6">
<h2 className="mb-2 font-semibold">Enviar dinero</h2>
{/* SendFlow ya hace: buscar usuario → monto → confirmación */}
<SendFlow token={token} />
</div>
) : (
<div className="card p-6">
<h2 className="mb-2 font-semibold">Actividad</h2>
<ActivityFeed token={token} username={me?.username || ""} />
</div>
)}
</section>
</main>

{/* Modales */}
<TopupModal open={topupOpen} onClose={() => setTopupOpen(false)} />
</div>
);
}