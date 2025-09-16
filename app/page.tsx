"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

// ⬇️ NUESTROS COMPONENTES EXISTENTES
import FrequentContacts from "@/components/FrequentContacts";
import SearchUser from "@/components/SearchUser";
import Txcomposer from "@/components/Txcomposer";
import ActivityFeed from "@/components/ActivityFeed";
import SecureConfirm from "@/components/SecureConfirm"; // (simulado FaceID/Passcode)

import { UserPublic } from "@/types";

// Base de API (como ya lo usas)
const API_BASE =
process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:4000";

// —— Helpers UI ————————————————————————————————————————
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
return (
<div className={`bg-white rounded-3xl shadow-lg p-6 ${className}`} />
);
}

function H1({ children }: { children: React.ReactNode }) {
return <h1 className="text-2xl font-bold text-[#0B1530]">{children}</h1>;
}

function Sub({ children }: { children: React.ReactNode }) {
return <p className="text-gray-500">{children}</p>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
return (
<input
{...props}
className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f5f7fa] focus:ring-2 focus:ring-blue-500 focus:outline-none ${props.className || ""}`}
/>
);
}

function PrimaryBtn(
props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
) {
const { loading, className, children, ...rest } = props;
return (
<button
{...rest}
className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 ${className || ""}`}
disabled={loading || rest.disabled}
>
{loading ? "…" : children}
</button>
);
}

// —— PÁGINA ———————————————————————————————————————————————
export default function Home() {
// Tabs: Login / Registro
const [isLogin, setIsLogin] = useState(true);
// Sesión superfácil para demo (token/usuario)
const [token, setToken] = useState<string | null>(null);
const [me, setMe] = useState<UserPublic | null>(null);

// Estado para "Send Money"
const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
const [confirmOpen, setConfirmOpen] = useState(false);
const [apiOk, setApiOk] = useState<boolean | null>(null);

useEffect(() => {
fetch(`${API_BASE}/health`)
.then((r) => setApiOk(r.ok))
.catch(() => setApiOk(false));
}, []);

// Simulación de login (usa tu backend real después)
async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
// TODO: reemplazar con /api/auth/login
const fake = { token: "demo-token", user: { username: "demo", name: "Demo" } as any };
setToken(fake.token);
setMe(fake.user);
}

// Simulación de registro
async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
// TODO: reemplazar con /api/auth/register
const fake = { token: "demo-token", user: { username: "new", name: "New User" } as any };
setToken(fake.token);
setMe(fake.user);
}

// Cuando el usuario a enviar está seleccionado, abrimos composer
useEffect(() => {
if (selectedUser && token) setConfirmOpen(true);
}, [selectedUser, token]);

const isAuthed = useMemo(() => Boolean(token), [token]);

return (
<main className="min-h-screen w-full bg-[#f5f7fa] flex items-start justify-center p-4 sm:p-8">
<div className="w-full max-w-[1100px] grid gap-6 md:grid-cols-[380px_minmax(0,1fr)]">
{/* Columna izquierda — tarjeta principal tipo mock */}
<div className="space-y-6">
<Card className="grid place-items-center p-8">
{/* Logo redondo arriba */}
<Image
src="/logo.jpg" // Asegúrate que exista en /public
alt="Beqash logo"
width={80}
height={80}
className="rounded-full"
priority
/>
<div className="w-full mt-6">
<div className="flex bg-[#f0f2f5] p-1 rounded-xl mb-6">
<button
className={`flex-1 py-2 rounded-lg font-semibold transition ${
isLogin ? "bg-blue-600 text-white" : "text-gray-700"
}`}
onClick={() => setIsLogin(true)}
>
Ingresar
</button>
<button
className={`flex-1 py-2 rounded-lg font-semibold transition ${
!isLogin ? "bg-blue-600 text-white" : "text-gray-700"
}`}
onClick={() => setIsLogin(false)}
>
Crear cuenta
</button>
</div>

{!isAuthed ? (
isLogin ? (
<form onSubmit={handleLogin} className="space-y-4">
<Input type="text" placeholder="Usuario o correo" autoComplete="username" />
<Input type="password" placeholder="Contraseña" autoComplete="current-password" />
<PrimaryBtn type="submit">Ingresar</PrimaryBtn>
</form>
) : (
<form onSubmit={handleSignup} className="space-y-4">
<Input type="text" placeholder="Nombre" autoComplete="name" />
<Input type="email" placeholder="Correo" autoComplete="email" />
<Input type="tel" placeholder="Teléfono" autoComplete="tel" />
<Input type="password" placeholder="Contraseña" autoComplete="new-password" />
<PrimaryBtn type="submit">Crear cuenta</PrimaryBtn>
</form>
)
) : (
<div className="text-center">
<H1>¡Hola, {me?.name || me?.username}!</H1>
<Sub className="mt-1">Listo para enviar dinero</Sub>
</div>
)}
</div>
</Card>

{/* Roadmap (como en la tarjeta del mock) */}
<Card className="p-6">
<div className="text-xs text-gray-500 mb-3">
API base: <span className="font-semibold">{API_BASE}</span>{" "}
{apiOk === false && <span className="text-red-500">(API offline)</span>}
</div>

<H1>Roadmap (incluido en UI)</H1>
<ul className="mt-3 space-y-2 text-gray-700">
<li>👥 Contactos frecuentes (listo)</li>
<li>🔍 Búsqueda por @usuario / correo / teléfono (listo)</li>
<li>📝 Notas y reacciones en transacciones (UI listo)</li>
<li>🛡️ Confirmación segura (FaceID/Passcode simulado)</li>
<li>💸 Comisiones por transacción (fee/net en modelo – backend pendiente)</li>
<li>📊 Pagos offline tipo Airdrop (hooks y QR preparados)</li>
<li>🖼️ Avatares por sexo + personalizados (listo)</li>
</ul>
</Card>
</div>

{/* Columna derecha — pantallas internas estilo mock */}
<div className="space-y-6">
{/* SEND MONEY (buscador + frecuentes) */}
<Card className="p-6">
<H1>Send Money</H1>
<div className="mt-4">
{/* Search con debounce y selección */}
<SearchUser
token={token}
onSelect={(u: UserPublic) => setSelectedUser(u)}
/>

{/* Frecuentes */}
<div className="mt-6">
<p className="font-semibold text-[#0B1530] mb-3">Frequent</p>
<FrequentContacts
token={token}
onSelect={(u: UserPublic) => setSelectedUser(u)}
/>
</div>
</div>
</Card>

{/* COMPOSER + CONFIRM (mismo estilo del mock de monto y enviar) */}
<Card className="p-6">
<div className="flex items-center gap-4 mb-4">
<div className="w-12 h-12 rounded-full bg-[#e8f0ff] grid place-items-center">
{/* Tu componente Avatar ya pinta por sexo/foto */}
{/* <Avatar ... /> si quieres aquí también */}
<span className="text-blue-600 font-bold">Q</span>
</div>
<div>
<p className="text-sm text-gray-500">Para</p>
<p className="font-semibold text-[#0B1530]">
{selectedUser ? `@${selectedUser.username}` : "Selecciona un contacto"}
</p>
</div>
</div>

<Txcomposer
token={token}
toUser={selectedUser || undefined}
onSubmitted={() => setSelectedUser(null)}
onRequireSecureConfirm={() => setConfirmOpen(true)} // 👈 abre modal simulado
// Futuro: fees -> el componente ya puede exponer fee/net
/>

{/* Confirmación segura simulada (FaceID/Passcode) */}
<SecureConfirm
open={confirmOpen}
onClose={() => setConfirmOpen(false)}
onConfirm={() => {
// aquí puedes disparar el submit real si lo deseas
setConfirmOpen(false);
}}
/>
</Card>

{/* ACTIVITY FEED (igual al mock de “activity”) */}
<Card className="p-6">
<H1>Activity</H1>
<div className="mt-4">
<ActivityFeed token={token || ""} username={me?.username || ""} />
</div>
</Card>
</div>
</div>
</main>
);
}