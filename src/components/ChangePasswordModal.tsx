"use client";

import { useState } from "react";
import { httpsFetch as apiFetch } from "@/lib/https";

type Props = {
open: boolean;
onClose: () => void;
};

export default function ChangePasswordModal({ open, onClose }: Props) {
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [saving, setSaving] = useState(false);
const [error, setError] = useState<string | null>(null);
const [okMsg, setOkMsg] = useState<string | null>(null);

if (!open) return null;

async function onSubmit(e: React.FormEvent) {
e.preventDefault();
setError(null);
setOkMsg(null);

const token =
typeof window !== "undefined" ? localStorage.getItem("qash_demo_token") : null;

if (!token) {
setError("Sesión no válida. Inicia sesión de nuevo.");
return;
}

try {
setSaving(true);

const { ok, data } = await apiFetch<{ ok?: boolean; message?: string }>(
"/api/auth/change-password",
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
currentPassword: oldPassword,
newPassword,
}),
}
);

if (!ok || data?.ok === false) {
setError((data as any)?.message || "No se pudo cambiar la contraseña");
return;
}

setOkMsg((data as any)?.message || "Contraseña cambiada correctamente");
setOldPassword("");
setNewPassword("");
setTimeout(() => {
setOkMsg(null);
onClose();
}, 1200);
} catch (err) {
console.error(err);
setError("Error de red");
} finally {
setSaving(false);
}
}

return (
<div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
<div className="w-full max-w-md rounded-2xl bg-white p-5 shadow">
<div className="mb-3 flex items-center justify-between">
<h3 className="text-lg font-semibold">Cambiar contraseña</h3>
<button className="text-sm btn-outline" onClick={onClose}>
Cerrar
</button>
</div>

<form onSubmit={onSubmit} className="space-y-4">
<div>
<label className="text-sm text-gray-600">Contraseña actual</label>
<input
className="input"
type="password"
placeholder="••••••••"
value={oldPassword}
onChange={(e) => setOldPassword(e.target.value)}
required
/>
</div>

<div>
<label className="text-sm text-gray-600">Nueva contraseña</label>
<input
className="input"
type="password"
placeholder="••••••••"
value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
required
/>
</div>

{error && <p className="text-sm text-red-600">{error}</p>}
{okMsg && <p className="text-sm text-green-600">{okMsg}</p>}

<button className="btn-primary w-full" disabled={saving}>
{saving ? "Guardando..." : "Guardar cambios"}
</button>
</form>
</div>
</div>
);
}