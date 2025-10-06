"use client";

import { useState, useEffect } from "react";
import ProfileMenu from "@/components/ProfileMenu";

export default function Header() {
const [menuOpen, setMenuOpen] = useState(false);
const [avatar, setAvatar] = useState<string>("/default-profile.png");

useEffect(() => {
try {
const raw = localStorage.getItem("qash_demo_user");
if (raw) {
const u = JSON.parse(raw);
if (u?.avatarUrl) setAvatar(u.avatarUrl);
}
} catch {}
}, []);

return (
<header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
<div className="mx-auto max-w-6xl items-center justify-between px-4 py-3 flex">
{/* Logo (abre menú) */}
<button
aria-label="Abrir menú de cuenta"
onClick={() => setMenuOpen((v) => !v)}
className="flex items-center gap-2"
>
{/* Tu logo */}
<img
src="/logo.jpg"
alt="Qash"
className="h-9 w-9 rounded-full object-cover"
/>
<span className="font-semibold tracking-wide">Qash</span>
</button>

{/* Mini avatar a la derecha */}
<img
src={avatar}
alt="avatar"
className="h-9 w-9 rounded-full object-cover border"
/>
</div>

{menuOpen && <ProfileMenu onClose={() => setMenuOpen(false)} />}
</header>
);
}