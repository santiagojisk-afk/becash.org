// src/components/ProfileSettingsFull.tsx
"use client";

import { useEffect, useState } from "react";
import { httpsFetch as apiFetch } from "@/lib/https";

/* ========= Tipos ========= */
type Privacy = { showHandle: boolean; showActivity: boolean };
type Notifications = { push: boolean; email: boolean; sms: boolean };

type UserMe = {
id?: string;
username?: string;
fullName: string;
handle: string;
email: string;
emailVerified?: boolean;
phone?: string;
phoneVerified?: boolean;
avatarUrl?: string;
privacy?: Privacy;
notifications?: Notifications;
};

type Props = {
user?: UserMe;
token?: string; // llega por props (además de fallback a localStorage)
onUpdated?: () => void | Promise<void>;
onChangePassword?: () => void;
};

/* ========= Componente ========= */
export default function ProfileSettingsFull({
user,
token,
onUpdated,
}: Props) {
const [me, setMe] = useState<UserMe | null>(user ?? null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [msg, setMsg] = useState<string | null>(null);
const [err, setErr] = useState<string | null>(null);

const [passOpen, setPassOpen] = useState(false);
const [faceID, setFaceID] = useState<boolean>(false);
const [passcode, setPasscode] = useState<string>("");

// ===== Cargar perfil (GET) =====
useEffect(() => {
let alive = true;
setLoading(true);

(async () => {
try {
const headers: Record<string, string> = { "Content-Type": "application/json" };
const t =
token ??
(typeof window !== "undefined" ? localStorage.getItem("qash_demo_token") : null);
if (t) headers.Authorization = `Bearer ${t}`;

const { ok, data } = await apiFetch<{ user?: UserMe; message?: string }>(
"/api/users/me",
{ headers } // GET por defecto, sin body
);

if (!alive) return;
if (!ok) throw new Error((data as any)?.message || "No se pudo cargar el perfil");

const body: any = (data as any)?.user ?? (data as any);
setMe({
fullName: body.fullName ?? "",
handle: body.handle ?? body.username ?? "",
email: body.email ?? "",
username: body.username,
id: body.id,
avatarUrl: body.avatarUrl,
emailVerified: body.emailVerified,
phone: body.phone,
phoneVerified: body.phoneVerified,
privacy: { showHandle: true, showActivity: false, ...(body?.privacy || {}) },
notifications: { push: true, email: true, sms: false, ...(body?.notifications || {}) },
});
} catch (e: any) {
if (alive) setErr(e?.message || "Error al cargar");
} finally {
if (alive) setLoading(false);
}
})();

return () => {
alive = false;
};
}, [token]);

function handleChange<K extends keyof UserMe>(key: K, value: UserMe[K]) {
if (!me) return;
setMe({ ...me, [key]: value });
}

// ===== Guardar perfil (PATCH) =====
async function saveProfile() {
if (!me) return;
setSaving(true);
setMsg(null);
setErr(null);
try {
const headers: Record<string, string> = { "Content-Type": "application/json" };
const t =
token ??
(typeof window !== "undefined" ? localStorage.getItem("qash_demo_token") : null);
if (t) headers.Authorization = `Bearer ${t}`;

const { ok, data } = await apiFetch<{ user?: UserMe; message?: string }>(
"/api/users/me",
{
method: "PATCH",
headers,
body: JSON.stringify({
fullName: me.fullName,
handle: me.handle,
email: me.email,
phone: me.phone,
avatarUrl: me.avatarUrl,
privacy: me.privacy,
notifications: me.notifications,
}),
}
);

if (!ok) throw new Error((data as any)?.message || "No se pudo guardar");
setMsg("Perfil actualizado en BeQash ✅");
if ((data as any)?.user) setMe({ ...me, ...(data as any).user });
await onUpdated?.();
} catch (e: any) {
setErr(e?.message || "Error al guardar");
} finally {
setSaving(false);
}
}

// ===== Cambiar contraseña =====
async function changePassword(d: { currentPassword: string; newPassword: string }) {
setErr(null);
setMsg(null);
try {
const headers: Record<string, string> = { "Content-Type": "application/json" };
const t =
token ??
(typeof window !== "undefined" ? localStorage.getItem("qash_demo_token") : null);
if (t) headers.Authorization = `Bearer ${t}`;

const { ok, data } = await apiFetch<{ ok?: boolean; message?: string }>(
"/api/auth/change-password",
{
method: "POST",
headers,
body: JSON.stringify({
currentPassword: d.currentPassword,
newPassword: d.newPassword,
}),
}
);

if (!ok || (data as any)?.ok === false) {
throw new Error((data as any)?.message || "No se pudo cambiar la contraseña");
}
setMsg("Contraseña actualizada 🔒");
setPassOpen(false);
} catch (e: any) {
setErr(e?.message || "No se pudo cambiar la contraseña");
}
}

// ===== Seguridad local (demo) =====
useEffect(() => {
try {
setPasscode(localStorage.getItem("bq_passcode") || "");
setFaceID(localStorage.getItem("bq_faceid") === "1");
} catch {}
}, []);
function saveLocalSecurity() {
try {
localStorage.setItem("bq_passcode", passcode || "");
localStorage.setItem("bq_faceid", faceID ? "1" : "0");
setMsg("Preferencias de seguridad guardadas (local) 🔐");
} catch {
setErr("No se pudo guardar seguridad local");
}
}

if (loading) return <div className="p-5 text-sm text-slate-500">Cargando perfil…</div>;
if (err && !me) return <div className="p-5 text-sm text-rose-600">{err}</div>;
if (!me) return null;

return (
<div className="mx-auto w-full max-w-md p-5 space-y-6">
<HeaderBrand />

{msg && <p className="rounded-lg bg-emerald-50 text-emerald-700 text-sm px-3 py-2">{msg}</p>}
{err && <p className="rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2">{err}</p>}

{/* Perfil público */}
<section className="rounded-2xl bg-white shadow-sm p-5 space-y-4">
<h2 className="text-base font-semibold">Tu perfil</h2>

<div className="flex items-center gap-4">
<Avatar url={me.avatarUrl} name={me.fullName} />
<div className="flex-1">
<label className="text-xs text-slate-500">URL de tu foto</label>
<input
value={me.avatarUrl || ""}
onChange={(e) => handleChange("avatarUrl", e.target.value)}
placeholder="https://…/mi-foto.png"
className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
/>
<div className="mt-2 flex gap-2">
<button onClick={() => handleChange("avatarUrl", "")} className="h-9 rounded-lg border border-slate-200 px-3 text-sm">
Quitar
</button>
<button onClick={() => handleChange("avatarUrl", genAvatar(me.fullName))} className="h-9 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 px-3 text-sm">
Predeterminada
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 gap-3">
<Field label="Nombre completo">
<input
value={me.fullName}
onChange={(e) => handleChange("fullName", e.target.value)}
className="w-full h-11 rounded-xl border border-slate-200 px-3"
/>
</Field>
<Field label="@usuario (público)">
<div className="flex">
<span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 text-slate-500">@</span>
<input
value={me.handle}
onChange={(e) => handleChange("handle", e.target.value)}
className="w-full h-11 rounded-r-xl border border-slate-200 px-3"
/>
</div>
</Field>
</div>
</section>

{/* Privados */}
<section className="rounded-2xl bg-white shadow-sm p-5 space-y-3">
<h2 className="text-base font-semibold">Datos de contacto</h2>
<Field label={`Email ${me.emailVerified ? "✓ verificado" : ""}`}>
<input
type="email"
value={me.email}
onChange={(e) => handleChange("email", e.target.value)}
className="w-full h-11 rounded-xl border border-slate-200 px-3"
/>
</Field>
<Field label={`Teléfono ${me.phoneVerified ? "✓ verificado" : ""}`}>
<input
inputMode="tel"
value={me.phone || ""}
onChange={(e) => handleChange("phone", e.target.value)}
className="w-full h-11 rounded-xl border border-slate-200 px-3"
placeholder="+52…"
/>
</Field>
<div className="flex gap-2">
<button className="h-10 flex-1 rounded-xl border border-slate-200">Verificar email</button>
<button className="h-10 flex-1 rounded-xl border border-slate-200">Verificar teléfono</button>
</div>
</section>

{/* Seguridad */}
<section className="rounded-2xl bg-white shadow-sm p-5 space-y-4">
<h2 className="text-base font-semibold">Seguridad</h2>
<button onClick={() => setPassOpen(true)} className="h-11 w-full rounded-xl bg-slate-900 text-white">
Cambiar contraseña
</button>

<div className="flex items-center justify-between">
<span className="text-sm">PIN para confirmar envíos</span>
<input
value={passcode}
onChange={(e) => setPasscode(e.target.value)}
inputMode="numeric"
maxLength={6}
className="h-10 w-28 rounded-xl border border-slate-200 px-3 tracking-[0.3em]"
/>
</div>
<div className="flex items-center justify-between">
<span className="text-sm">FaceID / Biométricos</span>
<Switch checked={faceID} onChange={setFaceID} />
</div>
<button onClick={saveLocalSecurity} className="h-10 w-full rounded-xl border border-slate-200">
Guardar seguridad
</button>
</section>

{/* Notificaciones */}
<section className="rounded-2xl bg-white shadow-sm p-5 space-y-3">
<h2 className="text-base font-semibold">Notificaciones</h2>
<RowToggle
label="Push"
value={me.notifications?.push ?? true}
onChange={(v) => setMe({ ...me, notifications: { ...me.notifications!, push: v } })}
/>
<RowToggle
label="Email"
value={me.notifications?.email ?? true}
onChange={(v) => setMe({ ...me, notifications: { ...me.notifications!, email: v } })}
/>
<RowToggle
label="SMS"
value={me.notifications?.sms ?? false}
onChange={(v) => setMe({ ...me, notifications: { ...me.notifications!, sms: v } })}
/>
</section>

{/* Privacidad */}
<section className="rounded-2xl bg-white shadow-sm p-5 space-y-3">
<h2 className="text-base font-semibold">Privacidad</h2>
<RowToggle
label="Mostrar mi @usuario públicamente"
value={me.privacy?.showHandle ?? true}
onChange={(v) => setMe({ ...me, privacy: { ...me.privacy!, showHandle: v } })}
/>
<RowToggle
label="Permitir que vean mis movimientos"
value={me.privacy?.showActivity ?? false}
onChange={(v) => setMe({ ...me, privacy: { ...me.privacy!, showActivity: v } })}
/>
</section>

<div className="flex gap-3">
<button
onClick={saveProfile}
disabled={saving}
className="h-12 flex-1 rounded-xl bg-blue-600 text-white font-medium shadow-sm disabled:opacity-60"
>
{saving ? "Guardando…" : "Guardar cambios"}
</button>
<button onClick={logout} className="h-12 w-36 rounded-xl border border-rose-200 text-rose-600">
Cerrar sesión
</button>
</div>

{passOpen && (
<ChangePasswordModal onClose={() => setPassOpen(false)} onSubmit={changePassword} />
)}
</div>
);
}

/* ==== UI helpers y SVGs ==== */
function HeaderBrand() {
return (
<div className="flex items-center gap-2">
<LogoQ className="h-6 w-6 text-blue-700" />
<h1 className="text-lg font-semibold">BeQash</h1>
</div>
);
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
return (
<label className="block">
<span className="text-xs text-slate-500">{label}</span>
<div className="mt-1">{children}</div>
</label>
);
}
function RowToggle({
label,
value,
onChange,
}: {
label: string;
value: boolean;
onChange: (v: boolean) => void;
}) {
return (
<div className="flex items-center justify-between">
<span className="text-sm">{label}</span>
<Switch checked={value} onChange={onChange} />
</div>
);
}
function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
return (
<button
onClick={() => onChange(!checked)}
className={`h-7 w-12 rounded-full transition ${checked ? "bg-blue-600" : "bg-slate-300"} relative`}
aria-pressed={checked}
>
<span className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
</button>
);
}
function Avatar({ url, name }: { url?: string; name: string }) {
const initials = (name || "B Q").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
return url ? (
<img src={url} alt="avatar" className="h-16 w-16 rounded-full object-cover border border-slate-200" />
) : (
<div className="h-16 w-16 rounded-full bg-blue-100 text-blue-800 grid place-items-center font-bold border border-blue-200">
{initials}
</div>
);
}
function ChangePasswordModal({
onClose,
onSubmit,
}: {
onClose: () => void;
onSubmit: (d: { currentPassword: string; newPassword: string }) => void;
}) {
const [cur, setCur] = useState("");
const [next, setNext] = useState("");
const [next2, setNext2] = useState("");
function send() {
if (!next || next !== next2) return alert("Las contraseñas no coinciden");
onSubmit({ currentPassword: cur, newPassword: next });
}
return (
<div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
<div className="bg-white rounded-2xl p-5 w/full max-w-sm">
<h3 className="text-base font-semibold">Cambiar contraseña</h3>
<input value={cur} onChange={(e) => setCur(e.target.value)} type="password" placeholder="Actual" className="mt-3 w-full h-11 rounded-xl border border-slate-200 px-3" />
<input value={next} onChange={(e) => setNext(e.target.value)} type="password" placeholder="Nueva" className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3" />
<input value={next2} onChange={(e) => setNext2(e.target.value)} type="password" placeholder="Repetir nueva" className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3" />
<div className="mt-4 flex gap-2">
<button onClick={onClose} className="h-11 flex-1 rounded-xl border border-slate-200">Cancelar</button>
<button onClick={send} className="h-11 flex-1 rounded-xl bg-slate-900 text-white">Actualizar</button>
</div>
</div>
</div>
);
}
function LogoQ(props: React.SVGProps<SVGSVGElement>) {
return (
<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
<circle cx="12" cy="12" r="8" fill="currentColor" />
<rect x="15.5" y="15.5" width="4" height="2" rx="1" fill="currentColor" transform="rotate(45 15.5 15.5)" />
</svg>
);
}
function logout() {
try { localStorage.removeItem("qash_demo_token"); } catch {}
location.href = "/login";
}
function genAvatar(name: string) {
const seed = encodeURIComponent(name || "BQ");
return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
}
