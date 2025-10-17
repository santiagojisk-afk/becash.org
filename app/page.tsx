// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom"; // ← IMPORT CORRECTO

// Componentes existentes (sin tocar su API)
import WalletCard from "@/components/WalletCard";
import ProfileSettings from "@/components/ProfileSettings";
import SecureConfirm from "@/components/SecureConfirm";
import SearchUser from "@/components/SearchUser";
import { ForgotPasswordModal, ChangePasswordModal } from "@/components/AuthExtras";
import { httpsFetch as apiFetch } from "@/lib/https";

/* =========================
ESTILOS (azul + blanco)
========================= */
function GlobalStyles() {
return (
<style jsx global>{`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

:root{
--brand:#0d1b2a; /* Azul primario */
--brand-acc:#00D4C5; /* Turquesa de acento */
--bg:#F7FAFF; /* Fondo claro */
--ink:#0B1220; /* Texto principal */
--muted:#6B7280; /* Texto secundario */
--ok:#16a34a;
--danger:#ef4444;
}

.page-shell{
background:
radial-gradient(900px 600px at -10% -10%, rgba(10,108,255,.12), transparent 45%),
radial-gradient(800px 600px at 110% 0%, rgba(0,212,197,.10), transparent 45%),
var(--bg);
color: var(--ink);
font-family: "Poppins", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
}

.shadow{ box-shadow:0 8px 24px rgba(14,30,68,.08); }
.shadow-soft{ box-shadow:0 6px 18px rgba(14,30,68,.06); }

.btn-primary{
background:linear-gradient(180deg, #0d1b2a, #0d2e64ff);
color:#fff; padding:12px 14px; border-radius:12px; font-weight:700;
box-shadow:0 8px 26px rgba(10,108,255,.22);
}
.btn-outline{
border:1px solid #E5E7EB; padding:10px 12px; border-radius:10px; background:#fff;
color:var(--ink); font-weight:600;
}
.btn-danger{ background:var(--danger); color:#fff; padding:10px 12px; border-radius:10px; font-weight:700; }

.input{
width:100%; padding:12px 14px; border:1px solid #E5E7EB; border-radius:12px; outline:none; color:var(--ink); background:#fff;
transition:box-shadow .15s ease, border-color .15s ease;
}
.input:focus{ border-color:var(--brand); box-shadow:0 0 0 4px rgba(10,108,255,.12); }

/* Tabs */
.tabs{ display:flex; gap:8px; background:#ffffff; border:1px solid #E5E7EB; padding:6px; border-radius:14px; }
.tab{ padding:8px 12px; border-radius:10px; font-size:.85rem; color:#334155; border:1px solid transparent; }
.tab--active{ background:linear-gradient(180deg, rgba(10,108,255,.18), rgba(10,108,255,.06)); color:#0b1220; border-color:rgba(10,108,255,.35); }

/* Tarjeta de saldo */
.balance-card{
background: radial-gradient(160% 140% at -10% -30%, #0d2e64ff, #0d1b2a);
color:#fff; border-radius:18px; padding:18px;
}
.balance-caption{ opacity:.9; font-size:.9rem; }
.balance-amount{ font-weight:700; font-size:2rem; letter-spacing:.4px; }

/* Tiles de acciones (Home) -> círculos con icono */
.tiles{ display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; justify-items:center; }
.tile{
display:grid; place-items:center;
width:84px; height:84px; border-radius:50%;
background:linear-gradient(180deg, #f5f6f8, #e5e7eb);
border:1px solid #d1d5db; color:#0b1220;
box-shadow:0 4px 10px rgba(0,0,0,.05);
transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.tile:hover{ transform:scale(1.05); box-shadow:0 6px 14px rgba(13,27,42,.1); border-color:#cbd5e1; }
.tile .label{ display:none; }

/* Iconos dentro del círculo (sin fondo blanco) */
.tile-icon{
width:40px; height:40px; display:block; object-fit:contain; background:transparent;
mix-blend-mode:multiply; opacity:.9; filter:blur(0.2px);
transition:opacity .15s ease, transform .15s ease;
}
.tile:hover .tile-icon{ opacity:1; transform:scale(1.03); }

/* Listas */
.card{ background:#fff; border:1px solid #E5E7EB; border-radius:18px; padding:18px; }
.card-title{ font-weight:600; color:#0b1220; }
.card-muted{ color:#6b7280; }

/* Clase por si la usas, no estorba */
.sticky-bar{
position:fixed; left:0; right:0; bottom:0; height:72px;
display:flex; align-items:center; justify-content:center;
background:#ffffffef; backdrop-filter:blur(8px);
border-top:1px solid #E5E7EB; box-shadow:0 -6px 18px rgba(0,0,0,.06);
padding:10px 16px; z-index:2147483647;
}

.chip{ background:#fff; border:1px solid #E5E7EB; padding:8px 12px; border-radius:12px; font-size:.85rem; color:#0b1220; }
.chip-danger{ background:#fff1f2; border:1px solid rgba(239,68,68,.35); padding:8px 12px; border-radius:12px; font-size:.85rem; color:#991b1b; }
`}</style>
);
}

/* =========================
BARRA FIJA (portal)
========================= */
function StickyActionBar({
visible,
onClick,
disabled,
label,
}: {
visible: boolean;
onClick: () => void;
disabled: boolean;
label: string;
}) {
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!visible || !mounted) return null;

const node = (
<div
style={{
position: "fixed",
left: 0,
right: 0,
bottom: 0,
height: "72px",
zIndex: 2147483647,
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "#ffffffef",
backdropFilter: "blur(8px)",
borderTop: "1px solid #E5E7EB",
boxShadow: "0 -6px 18px rgba(0,0,0,.06)",
padding: "10px 16px",
paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
pointerEvents: "auto",
width: "100%",
}}
>
<button className="btn-primary w-full" onClick={onClick} disabled={disabled}>
{label}
</button>
</div>
);

return createPortal(node, document.body);
}

/* =========================
TIPOS
========================= */
type User = {
id?: string;
username: string;
fullName?: string;
email?: string;
phone?: string;
avatarUrl?: string;
handle?: string;
};

type AuthResp = { accessToken?: string; token?: string; user?: User; message?: string };
type BalanceResp = { balance: number };

type Tx = {
id: string;
amount: number;
note?: string;
from?: string;
to?: string;
createdAt: string;
type?: "in" | "out";
};
type TxListResp = { items: Tx[]; nextCursor?: string };

/* Near Pay */
type NearItem = { handle: string; distanceM: number; lat: number; lng: number; seenAt: string };

/* ====== Iconos mínimos ====== */
function IconSend() {
return (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
<path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);
}
function IconTopup() {
return (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
<path d="M12 19V7M6 13l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);
}
function IconWithdraw() {
return (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
<path d="M12 5v12M6 11l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);
}

export default function Page() {
// ===== Sesión =====
const [token, setToken] = useState<string | null>(null);
const isAuthed = useMemo(() => Boolean(token), [token]);
const [me, setMe] = useState<User | null>(null);

// ===== Vistas =====
type View = "home" | "send" | "topup" | "withdraw" | "profile";
const [view, setView] = useState<View>("home");

// ===== Estado global =====
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ===== Modales auth =====
const [fpOpen, setFpOpen] = useState(false);
const [cpOpen, setCpOpen] = useState(false);

// ===== Wallet / Movimientos =====
const [balance, setBalance] = useState<number | null>(null);
const [txs, setTxs] = useState<Tx[]>([]);
const [cursor, setCursor] = useState<string | undefined>(undefined);
const [txLoading, setTxLoading] = useState(false);
const [txEnd, setTxEnd] = useState(false);

// ===== Enviar =====
const [sendAmount, setSendAmount] = useState<string>("");
const [sendNote, setSendNote] = useState<string>("");
const [confirmOpen, setConfirmOpen] = useState(false);
const [recipientOpen, setRecipientOpen] = useState(false);

// ===== Recargar / Retirar =====
const [topupAmount, setTopupAmount] = useState<string>("");
const [withdrawAmount, setWithdrawAmount] = useState<string>("");

// ===== Persistencia =====
useEffect(() => {
try {
const t = localStorage.getItem("qash_demo_token");
const raw = localStorage.getItem("qash_demo_user");
if (t) setToken(t);
if (raw) setMe(JSON.parse(raw));
} catch {}
}, []);
useEffect(() => {
try {
if (token) localStorage.setItem("qash_demo_token", token);
else localStorage.removeItem("qash_demo_token");
} catch {}
}, [token]);
useEffect(() => {
try {
if (me) localStorage.setItem("qash_demo_user", JSON.stringify(me));
else localStorage.removeItem("qash_demo_user");
} catch {}
}, [me]);

// ===== Cargar datos tras login =====
useEffect(() => {
if (!isAuthed) return;
(async () => {
await Promise.all([fetchMe(), fetchBalance(), initTxs()]);
})();
}, [isAuthed]);

function authHeaders() {
return token ? { Authorization: `Bearer ${token}` } : {};
}

// ================= API calls (tus endpoints) =================
async function fetchMe() {
try {
const { ok, data } = await apiFetch<{ user: User }>("/api/users/me", { headers: authHeaders() });
if (ok && data?.user) setMe(data.user);
} catch {}
}

async function fetchBalance() {
try {
const { ok, data } = await apiFetch<BalanceResp>("/api/wallet/balance", { headers: authHeaders() });
if (ok && typeof data?.balance === "number") setBalance(data.balance);
} catch {}
}

async function initTxs() {
setTxLoading(true);
setTxEnd(false);
setCursor(undefined);
try {
const { ok, data } = await apiFetch<TxListResp>("/api/transactions?limit=20", { headers: authHeaders() });
if (ok && data) {
setTxs(data.items || []);
setCursor(data.nextCursor);
if (!data.nextCursor) setTxEnd(true);
} else {
setTxs([]);
setTxEnd(true);
}
} finally {
setTxLoading(false);
}
}

async function loadMoreTxs() {
if (txLoading || txEnd) return;
setTxLoading(true);
try {
const qs = new URLSearchParams({ limit: "20" });
if (cursor) qs.set("cursor", cursor);
const { ok, data } = await apiFetch<TxListResp>(`/api/transactions?${qs.toString()}`, { headers: authHeaders() });
if (ok && data) {
setTxs((p) => [...p, ...(data.items || [])]);
setCursor(data.nextCursor);
if (!data.nextCursor) setTxEnd(true);
}
} finally {
setTxLoading(false);
}
}

// ================= Auth =================
const [isLogin, setIsLogin] = useState(true);

async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
setError(null); setLoading(true);
try {
const f = new FormData(e.currentTarget);
const username = String(f.get("username") || "").trim();
const password = String(f.get("password") || "").trim();

const { ok, data } = await apiFetch<AuthResp>("/api/auth/login", {
method: "POST",
body: JSON.stringify({ username, password }),
});
const t = data?.accessToken || data?.token;
if (!ok || !t) { setError(data?.message || "Credenciales inválidas"); return; }
setToken(t);
setMe(data?.user || { username, handle: username });
setView("home");
} finally { setLoading(false); }
}

async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
setError(null); setLoading(true);
try {
const f = new FormData(e.currentTarget);
const username = String(f.get("username") || "").trim();
const fullName = String(f.get("fullName") || "").trim();
const password = String(f.get("password") || "").trim();

const { ok, data } = await apiFetch<AuthResp>("/api/auth/signup", {
method: "POST",
body: JSON.stringify({ username, fullName, password }),
});
const t = data?.accessToken || data?.token;
if (!ok || !t) { setError(data?.message || "No se pudo crear la cuenta"); return; }
setToken(t);
setMe(data?.user || { username, fullName, handle: username });
setView("home");
} finally { setLoading(false); }
}

function handleLogout() {
setToken(null); setMe(null); setBalance(null); setTxs([]); setCursor(undefined); setTxEnd(false); setView("home");
}

// ================= Flujos de acción =================
function startSendFlow() {
const amt = Number(sendAmount);
if (!amt || amt <= 0) { alert("Ingresa un monto válido"); return; }
setConfirmOpen(true);
}
function afterPinOk() { setConfirmOpen(false); setRecipientOpen(true); }

async function pickRecipientAndSend(handle: string) {
const normalized = handle.startsWith("@") ? handle.slice(1) : handle;
try {
setLoading(true);
const { ok, data } = await apiFetch<{ tx: Tx; message?: string }>(
"/api/transactions/transfer",
{
method: "POST",
headers: { ...authHeaders(), "Content-Type": "application/json" },
body: JSON.stringify({
to: normalized,
amount: Number(sendAmount),
note: sendNote || undefined,
}),
}
);
if (!ok) { alert((data as any)?.message || "No se pudo enviar"); return; }
setSendAmount(""); setSendNote(""); setRecipientOpen(false);
await Promise.all([fetchBalance(), initTxs()]); setView("home");
} finally { setLoading(false); }
}

function startTopupFlow() {
const amt = Number(topupAmount);
if (!amt || amt <= 0) return alert("Ingresa un monto válido");
setConfirmOpen(true);
const onOk = async () => {
try {
setLoading(true);
const { ok, data } = await apiFetch<{ ok: boolean; message?: string }>(
"/api/wallet/topup",
{ method: "POST", body: JSON.stringify({ amount: amt }) }
);
if (!ok) { alert((data as any)?.message || "No se pudo iniciar recarga"); return; }
setTopupAmount("");
await Promise.all([fetchBalance(), initTxs()]);
setView("home");
} finally { setLoading(false); }
};
_overrideConfirm(onOk);
}

function startWithdrawFlow() {
const amt = Number(withdrawAmount);
if (!amt || amt <= 0) return alert("Ingresa un monto válido");
setConfirmOpen(true);
const onOk = async () => {
try {
setLoading(true);
const { ok, data } = await apiFetch<{ ok: boolean; message?: string }>(
"/api/wallet/withdraw",
{ method: "POST", body: JSON.stringify({ amount: amt }) }
);
if (!ok) { alert((data as any)?.message || "No se pudo retirar"); return; }
setWithdrawAmount("");
await Promise.all([fetchBalance(), initTxs()]);
setView("home");
} finally { setLoading(false); }
};
_overrideConfirm(onOk);
}

/* ======= Contactos frecuentes ======= */
const myHandle = me?.handle || me?.username || "";
const frequentContacts = useMemo(() => {
const counts: Record<string, number> = {};
for (const tx of txs) {
const other = tx.type === "in" ? tx.from : tx.to;
if (!other || other === myHandle) continue;
counts[other] = (counts[other] || 0) + 1;
}
return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([h])=>h);
}, [txs, myHandle]);

/* =========================
NEAR PAY (Cerca)
========================= */
const [nearOn, setNearOn] = useState(false);
const [nearItems, setNearItems] = useState<NearItem[]>([]);
const [nearLoading, setNearLoading] = useState(false);
const [geo, setGeo] = useState<{lat:number; lng:number} | null>(null);
const [nearError, setNearError] = useState<string | null>(null);
const NEAR_RADIUS = 50; // metros

async function publishHeartbeat(pos?: {lat:number; lng:number}) {
try {
const coords = pos ?? geo;
if (!coords) return;
await apiFetch("/api/near/heartbeat", {
method: "POST",
headers: { ...authHeaders(), "Content-Type": "application/json" },
body: JSON.stringify(coords),
});
} catch {}
}
async function refreshNearby() {
if (!geo) return;
setNearLoading(true);
try {
const qs = new URLSearchParams({ lat: String(geo.lat), lng: String(geo.lng), radius: String(NEAR_RADIUS) });
const { ok, data } = await apiFetch<{ ok:boolean; items: NearItem[]; radius:number }>(`/api/near/around?${qs}`, { headers: authHeaders() });
if (ok && (data as any)?.ok) setNearItems((data as any).items || []);
} finally { setNearLoading(false); }
}
function startNear() {
setNearError(null);
if (!navigator.geolocation) { setNearError("Tu dispositivo no soporta geolocalización"); return; }
navigator.geolocation.getCurrentPosition(
async (p) => {
const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
setGeo(coords);
await publishHeartbeat(coords);
await refreshNearby();
},
(err) => setNearError(err?.message || "No se pudo obtener ubicación"),
{ enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
);
setNearOn(true);
}
function stopNear() {
setNearOn(false);
setNearItems([]);
setGeo(null);
// opcional: borrar presencia en backend
apiFetch("/api/near/me", { method: "DELETE", headers: authHeaders() }).catch(()=>{});
}
// pulso cada 20s mientras esté activo
useEffect(() => {
if (!nearOn) return;
const beat = setInterval(() => publishHeartbeat().catch(()=>{}), 20000);
const poll = setInterval(() => refreshNearby().catch(()=>{}), 10000);
return () => { clearInterval(beat); clearInterval(poll); };
}, [nearOn, geo?.lat, geo?.lng]);

function useNearPay(handle: string) {
// Rellena flujo de envío con el usuario elegido de cerca
setRecipientOpen(false);
setConfirmOpen(true);
_overrideConfirm(async () => {
try {
setLoading(true);
const { ok, data } = await apiFetch("/api/transactions/transfer", {
method: "POST",
headers: { ...authHeaders(), "Content-Type": "application/json" },
body: JSON.stringify({ to: handle, amount: Number(sendAmount), note: sendNote || "NearPay" }),
});
if (!(ok as any)) { alert((data as any)?.message || "No se pudo enviar"); return; }
setSendAmount(""); setSendNote("");
await Promise.all([fetchBalance(), initTxs()]);
setView("home");
} finally { setLoading(false); setConfirmOpen(false); _clearOverride(); }
});
}

/* ============================ Render ============================ */

if (!isAuthed) {
return (
<div className="page-shell min-h-[100dvh]">
<GlobalStyles />
<div className="max-w-md mx-auto p-6">
{/* Branding */}
<div className="flex flex-col items-center mb-8">
<div className="rounded-2xl bg-white shadow-soft p-4">
<Image src="/qash-logo.png" alt="Qash" width={56} height={56} priority />
</div>
<h1 className="mt-3 text-2xl font-semibold tracking-tight">Qash</h1>
<p className="text-sm" style={{color:"var(--muted)"}}>Pagos simples. Dinero al instante.</p>
</div>

{/* Tabs login/signup */}
<div className="flex rounded-xl bg-white border border-gray-200 p-1 shadow-soft mb-6">
<button className={`flex-1 py-2 rounded-lg text-sm ${isLogin ? "bg-[var(--brand)] text-white" : "text-gray-700"}`} onClick={() => setIsLogin(true)}>Iniciar sesión</button>
<button className={`flex-1 py-2 rounded-lg text-sm ${!isLogin ? "bg-[var(--brand)] text-white" : "text-gray-700"}`} onClick={() => setIsLogin(false)}>Crear cuenta</button>
</div>

{isLogin ? (
<form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow space-y-4">
<div className="flex items-center gap-3 pb-2 border-b border-gray-100">
<Image src="/qash-logo.png" alt="Qash" width={24} height={24} />
<h2 className="font-medium">Inicia sesión en Qash</h2>
</div>
<div>
<label className="text-sm" style={{color:"var(--muted)"}}>Usuario (@handle)</label>
<input name="username" className="input" placeholder="tuusuario" required />
</div>
<div>
<label className="text-sm" style={{color:"var(--muted)"}}>Contraseña</label>
<input name="password" type="password" className="input" placeholder="••••••••" required />
</div>
{error && <p className="text-red-600 text-sm">{error}</p>}
<div className="flex justify-between text-sm text-blue-600">
<button type="button" onClick={() => setFpOpen(true)}>Olvidé mi contraseña</button>
<button type="button" onClick={() => setCpOpen(true)}>Cambiar contraseña</button>
</div>
<button className="btn-primary w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
</form>
) : (
<form onSubmit={handleSignup} className="bg-white rounded-2xl p-6 shadow space-y-4">
<div className="flex items-center gap-3 pb-2 border-b border-gray-100">
<Image src="/qash-logo.png" alt="Qash" width={24} height={24} />
<h2 className="font-medium">Crea tu cuenta Qash</h2>
</div>
<div>
<label className="text-sm" style={{color:"var(--muted)"}}>Usuario (@handle)</label>
<input name="username" className="input" placeholder="tuusuario" required />
</div>
<div>
<label className="text-sm" style={{color:"var(--muted)"}}>Nombre público</label>
<input name="fullName" className="input" placeholder="Tu Nombre" />
</div>
<div>
<label className="text-sm" style={{color:"var(--muted)"}}>Contraseña</label>
<input name="password" type="password" className="input" placeholder="••••••••" required />
</div>
{error && <p className="text-red-600 text-sm">{error}</p>}
<button className="btn-primary w-full" disabled={loading}>{loading ? "Creando..." : "Crear cuenta"}</button>
</form>
)}

<ForgotPasswordModal open={fpOpen} onClose={() => setFpOpen(false)} />
<ChangePasswordModal open={cpOpen} onClose={() => setCpOpen(false)} />
</div>
</div>
);
}

// -------- App autenticada --------
return (
<div className="page-shell min-h-[100dvh]">
<GlobalStyles />

<header className="px-5 pt-5 flex items-center justify-between">
<div className="flex items-center gap-3">
<Image src="/qash-logo.png" alt="Qash" width={28} height={28} className="rounded-xl shadow-soft" />
<div>
<p className="text-xs" style={{color:"var(--muted)"}}>Bienvenido</p>
<p className="font-semibold">@{me?.handle || me?.username}</p>
</div>
</div>
<div className="flex items-center gap-2">
<button className="chip" onClick={() => setView("profile")}>Perfil</button>
<button className="chip-danger" onClick={handleLogout}>Salir</button>
</div>
</header>

<nav className="px-5 mt-4">
<div className="tabs">
<button className={`tab ${view === "home" ? "tab--active" : ""}`} onClick={() => setView("home")}>Inicio</button>
<button className={`tab ${view === "send" ? "tab--active" : ""}`} onClick={() => setView("send")}>Enviar</button>
<button className={`tab ${view === "topup" ? "tab--active" : ""}`} onClick={() => setView("topup")}>Recargar</button>
<button className={`tab ${view === "withdraw" ? "tab--active" : ""}`} onClick={() => setView("withdraw")}>Retirar</button>
</div>
</nav>

{/* padding-bottom para que la barra fija no tape el contenido */}
<main className="p-5 space-y-6 pb-24">
{/* HOME */}
{view === "home" && (
<>
<section className="balance-card shadow">
<p className="balance-caption">Saldo</p>
<p className="balance-amount">${(balance ?? 0).toFixed(2)}</p>
</section>

{/* Círculos con imágenes (sin texto) */}
<section className="tiles">
<button className="tile" onClick={() => setView("send")} aria-label="Enviar">
<Image className="tile-icon" src="/icons/send.png" alt="Enviar" width={40} height={40} />
</button>
<button className="tile" onClick={() => setView("topup")} aria-label="Recargar">
<Image className="tile-icon" src="/icons/topup.png" alt="Recargar" width={40} height={40} />
</button>
<button className="tile" onClick={() => setView("withdraw")} aria-label="Retirar">
<Image className="tile-icon" src="/icons/withdraw.png" alt="Retirar" width={40} height={40} />
</button>
</section>

<section className="card shadow">
<h2 className="card-title mb-3">Contactos frecuentes</h2>
{!frequentContacts.length ? (
<p className="text-sm card-muted">Aún no hay contactos frecuentes.</p>
) : (
<ul className="divide-y divide-gray-100">
{frequentContacts.map((h) => (
<li key={h} className="py-3 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-[var(--brand)]/12 grid place-items-center text-[var(--brand)] font-semibold">
@{h[0]?.toUpperCase() || "U"}
</div>
<div>
<p className="font-medium">@{h}</p>
<p className="text-xs card-muted">Toca para enviar</p>
</div>
</div>
<button className="btn-outline" onClick={() => { setView("send"); setRecipientOpen(true); }}>
Enviar
</button>
</li>
))}
</ul>
)}
</section>

<section className="card shadow">
<div className="flex items-center justify-between mb-3">
<h2 className="card-title">Actividad reciente</h2>
</div>

{!txs.length && !txLoading && (
<EmptyState
title="Sin movimientos aún"
subtitle="Cuando realices o recibas pagos, aparecerán aquí."
cta={{ label: "Enviar ahora", onClick: () => setView("send") }}
/>
)}

<ul className="divide-y divide-gray-100">
{txs.map((tx) => (
<li key={tx.id} className="py-3 flex items-center justify-between">
<div>
<p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
<p className="text-sm">{formatNote(tx.note || "", tx.type)}</p>
<p className="text-xs text-gray-500">
{tx.from ? `De: @${tx.from}` : null} {tx.to ? `· Para: @${tx.to}` : null}
</p>
</div>
<div
className={`font-semibold ${
tx.type === "in" || tx.note?.toLowerCase().includes("topup")
? "text-green-600"
: "text-red-600"
}`}
>
{(tx.type === "in" || tx.note?.toLowerCase().includes("topup")) ? "+" : "-"}$
{Math.abs(tx.amount).toFixed(2)}
</div>
</li>
))}
</ul>

<div className="mt-4">
{!txEnd ? (
<button className="w-full btn-outline" onClick={loadMoreTxs} disabled={txLoading}>
{txLoading ? "Cargando..." : "Cargar más"}
</button>
) : (
<p className="text-center text-xs text-gray-500">No hay más</p>
)}
</div>
</section>
</>
)}

{/* ENVIAR */}
{view === "send" && (
<section className="space-y-6">
{/* === Formulario Enviar === */}
<section className="card shadow space-y-4">
<h2 className="card-title">Enviar dinero</h2>
<form onSubmit={(e)=>e.preventDefault()} className="space-y-4">
<div>
<label className="text-sm card-muted">Monto</label>
<input className="input" inputMode="decimal" placeholder="0.00" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
</div>
<div>
<label className="text-sm card-muted">Nota (opcional)</label>
<input className="input" placeholder="Por el Uber, gracias" value={sendNote} onChange={(e) => setSendNote(e.target.value)} />
</div>
</form>
<p className="text-xs card-muted">Toca Continuar para confirmar y elegir destinatario.</p>
</section>

{/* === Pagar por cercanía (beta) ==== */}
<div className="card shadow space-y-3">
<div className="flex items-center justify-between">
<h3 className="card-title">Pagar por cercanía (beta)</h3>
{!nearOn ? (
<button className="btn-outline" onClick={startNear}>Activar</button>
) : (
<button className="btn-outline" onClick={stopNear}>Detener</button>
)}
</div>

{nearError && <p className="text-sm text-red-600">{nearError}</p>}
{!nearOn && <p className="text-sm card-muted">Activa para ver usuarios Qash a ≤ {NEAR_RADIUS} m.</p>}

{nearOn && (
<div className="space-y-2">
<div className="flex items-center justify-between">
<p className="text-sm card-muted">Usuarios cerca</p>
<button className="btn-outline" onClick={refreshNearby} disabled={nearLoading}>
{nearLoading ? "Buscando..." : "Actualizar"}
</button>
</div>

{!nearItems.length ? (
<p className="text-sm card-muted">No hay Qashers cerca aún.</p>
) : (
<ul className="divide-y divide-gray-100">
{nearItems.map((it) => (
<li key={it.handle} className="py-2 flex items-center justify-between">
<div>
<p className="font-medium">@{it.handle}</p>
<p className="text-xs card-muted">{it.distanceM} m · visto {new Date(it.seenAt).toLocaleTimeString()}</p>
</div>
<button
className="btn-primary"
onClick={() => {
if (!(Number(sendAmount) > 0)) { alert("Ingresa primero el monto"); return; }
useNearPay(it.handle);
}}
>
Pagar
</button>
</li>
))}
</ul>
)}
<p className="text-[11px] text-gray-500">Tu ubicación se borra automáticamente tras inactividad (2 min).</p>
</div>
)}
</div>
</section>
)}

{/* RECARGAR */}
{view === "topup" && (
<section className="card shadow space-y-4">
<h2 className="card-title">Recargar saldo</h2>
<form onSubmit={(e)=>e.preventDefault()} className="space-y-4">
<div>
<label className="text-sm card-muted">Monto</label>
<input className="input" inputMode="decimal" placeholder="0.00" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} />
</div>
</form>
<p className="text-xs card-muted">Toca Continuar para confirmar la recarga.</p>
</section>
)}

{/* RETIRAR */}
{view === "withdraw" && (
<section className="card shadow space-y-4">
<h2 className="card-title">Retirar</h2>
<form onSubmit={(e)=>e.preventDefault()} className="space-y-4">
<div>
<label className="text-sm card-muted">Monto</label>
<input className="input" inputMode="decimal" placeholder="0.00" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
</div>
</form>
<p className="text-xs card-muted">Toca Continuar para confirmar el retiro.</p>
</section>
)}

{/* PERFIL */}
{view === "profile" && (
<section className="card shadow space-y-4">
<h2 className="card-title">Perfil & Configuración</h2>
<ProfileSettings user={me || undefined} token={token || undefined} onUpdated={fetchMe} onChangePassword={() => setCpOpen(true)} />
</section>
)}

{/* Espaciador para la barra fija (cuando aplica) */}
{(view === "send" || view === "topup" || view === "withdraw") && (
<div style={{ height: 88 }} />
)}
</main>

{/* Barra inferior unificada (PORTAL) */}
<StickyActionBar
visible={view === "send" || view === "topup" || view === "withdraw"}
onClick={() => {
if (view === "send") return startSendFlow();
if (view === "topup") return startTopupFlow();
if (view === "withdraw") return startWithdrawFlow();
}}
disabled={loading}
label={loading ? "Procesando..." : "Continuar"}
/>

{/* Modales */}
<ForgotPasswordModal open={fpOpen} onClose={() => setFpOpen(false)} />
<ChangePasswordModal open={cpOpen} onClose={() => setCpOpen(false)} />

{/* Confirmación (PIN/FaceID) reutilizable */}
<SecureConfirm
open={confirmOpen}
onClose={() => { setConfirmOpen(false); _clearOverride(); }}
onConfirm={() => {
if (_confirmOverride) { const fn = _confirmOverride; _clearOverride(); fn(); }
else { afterPinOk(); }
}}
/>

{/* Seleccionar destinatario (Enviar) */}
{recipientOpen && (
<RecipientModal
token={token!}
onClose={() => setRecipientOpen(false)}
onPick={(handle) => pickRecipientAndSend(handle)}
/>
)}
</div>
);
}

/* ===== Helpers UI ===== */
function EmptyState({
title, subtitle, cta,
}: { title: string; subtitle?: string; cta?: { label: string; onClick: () => void }; }) {
return (
<div className="text-center py-8">
<div className="mx-auto mb-3 rounded-full bg-gray-100 w-14 h-14 grid place-items-center">🗂️</div>
<p className="font-medium">{title}</p>
{subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
{cta && <button className="btn-primary mt-4" onClick={cta.onClick}>{cta.label}</button>}
</div>
);
}

function RecipientModal({
token, onClose, onPick,
}: { token: string; onClose: () => void; onPick: (handle: string) => void; }) {
const [to, setTo] = useState("");
return (
<div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
<div className="bg-white rounded-2xl p-5 w-full max-w-md shadow space-y-4">
<div className="flex items-center justify-between">
<h3 className="font-semibold">Selecciona destinatario</h3>
<button className="text-sm btn-outline" onClick={onClose}>Cerrar</button>
</div>
<SearchUser value={to} onChange={setTo} token={token} placeholder="@usuario" />
<button className="btn-primary w-full" onClick={() => to && onPick(to)}>
Enviar a {to || "..."}
</button>
<p className="text-xs text-gray-500">Busca por @handle y confirma.</p>
</div>
</div>
);
}

function formatNote(rawNote: string, type?: string) {
if (!rawNote) return type === "in" ? "Pago recibido" : "Pago enviado";
const note = rawNote.toLowerCase().trim();
if (note.includes("topup")) return "Recarga";
if (note.includes("withdraw")) return "Retiro";
if (note.includes("transfer")) return "Transferencia";
return note.charAt(0).toUpperCase() + note.slice(1);
}

/* ===== Confirm override para reutilizar SecureConfirm ===== */
let _confirmOverride: null | (() => void) = null;
function _overrideConfirm(fn: () => void) { _confirmOverride = fn; }
function _clearOverride() { _confirmOverride = null; }
