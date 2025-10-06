"use client";

import { useEffect, useState } from "react";

type Props = { onClose: () => void };

export default function ProfileMenu({ onClose }: Props) {
const [user, setUser] = useState<any>(null);

useEffect(() => {
try {
const raw = localStorage.getItem("qash_demo_user");
if (raw) setUser(JSON.parse(raw));
} catch {}
}, []);

const avatar = user?.avatarUrl || "/default-profile.png";

return (
<div className="border-t bg-white">
<div className="mx-auto max-w-6xl px-4 py-4">
<div className="flex items-center gap-3">
<img
src={avatar}
alt="avatar"
className="h-12 w-12 rounded-full object-cover border"
/>
<div>
<div className="font-semibold">{user?.fullName || "Cuenta"}</div>
<div className="text-xs text-gray-500">@{user?.username}</div>
</div>
<div className="ml-auto">
<button className="text-sm underline" onClick={onClose}>
Cerrar
</button>
</div>
</div>

<nav className="mt-4 grid gap-2">
<a className="btn" href="#perfil" onClick={onClose}>
Configuración de perfil
</a>
<a className="btn" href="#actividad" onClick={onClose}>
Actividad
</a>
<button
className="btn"
onClick={() => {
localStorage.removeItem("qash_demo_token");
localStorage.removeItem("qash_demo_user");
location.reload();
}}
>
Cerrar sesión
</button>
</nav>
</div>
</div>
);
}