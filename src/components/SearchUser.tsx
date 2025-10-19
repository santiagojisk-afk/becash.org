// src/components/SearchUser.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { httpsFetch as apiFetch } from "@/lib/https";

export type SearchUserPick = {
username?: string; // "@dan" o "dan"
handle?: string; // a veces tu API usa "handle"
email?: string;
fullName?: string;
avatarUrl?: string;
};

type Props = {
value: string;
onChange: (v: string) => void;
onPick?: (u: { username?: string; handle?: string; email?: string }) => void; // 👈 ESTA LÍNEA NUEVA
placeholder?: string;
};

export default function SearchUser({
value,
onChange,
onPick,
placeholder = "@usuario o correo",
token,
}: Props) {
const [q, setQ] = useState(value);
const [items, setItems] = useState<SearchUserPick[]>([]);
const [loading, setLoading] = useState(false);
const [open, setOpen] = useState(false);
const timer = useRef<number | null>(null);

// Mantener sincronizado con el valor que te pasan
useEffect(() => setQ(value), [value]);

// Buscar con debounce
useEffect(() => {
if (timer.current) window.clearTimeout(timer.current);
if (!q || q.trim().length < 1) {
setItems([]);
setOpen(false);
return;
}
timer.current = window.setTimeout(fetchUsers, 250);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [q]);

async function fetchUsers() {
try {
setLoading(true);
const headers: Record<string, string> = { "Content-Type": "application/json" };
const t =
token ??
(typeof window !== "undefined" ? localStorage.getItem("qash_demo_token") : null);
if (t) headers.Authorization = `Bearer ${t}`;

// Ajusta el endpoint/param según tu backend
const { ok, data } = await apiFetch<{ items?: SearchUserPick[] }>(
`/api/users/search?q=${encodeURIComponent(q)}`,
{ headers }
);

if (!ok) {
setItems([]);
setOpen(false);
return;
}
const list = (data as any)?.items || [];
setItems(list);
setOpen(list.length > 0);
} finally {
setLoading(false);
}
}

function pick(u: SearchUserPick) {
// priorizar username/handle; si no, email
const h = (u.username || u.handle || "").replace(/^@/, "");
const val = h ? `@${h}` : (u.email || "");
if (val) onChange(val);
setOpen(false);
setItems([]);
onPick?.(u);
}

return (
<div className="relative">
<input
className="h-11 w-full rounded-xl border border-slate-200 px-3"
placeholder={placeholder}
value={q}
onChange={(e) => {
setQ(e.target.value);
onChange(e.target.value);
}}
onFocus={() => { if (items.length) setOpen(true); }}
onBlur={() => setTimeout(() => setOpen(false), 150)}
autoComplete="off"
/>

{/* Dropdown */}
{open && (
<div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow">
{loading && (
<div className="px-3 py-2 text-sm text-slate-500">Buscando…</div>
)}
{!loading && items.length === 0 && (
<div className="px-3 py-2 text-sm text-slate-500">Sin resultados</div>
)}
{!loading &&
items.map((u, i) => (
<button
key={(u.username || u.email || String(i)) + i}
type="button"
className="flex w-full items-center gap-3 px-3 py-2 hover:bg-slate-50 text-left"
onMouseDown={(e) => e.preventDefault()}
onClick={() => pick(u)}
>
<Avatar size={28} url={u.avatarUrl} name={u.fullName || u.username || u.email || "U"} />
<div className="truncate">
<div className="text-sm font-medium">
{u.fullName || u.username || u.email}
</div>
<div className="text-xs text-slate-500">
{u.username ? `@${u.username.replace(/^@/, "")}` : u.email}
</div>
</div>
</button>
))}
</div>
)}
</div>
);
}

function Avatar({ url, name, size = 28 }: { url?: string; name?: string; size?: number }) {
const initials = (name || "U").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const cls = `rounded-full object-cover border border-slate-200`;
return url ? (
// eslint-disable-next-line @next/next/no-img-element
<img src={url} alt="avatar" width={size} height={size} className={cls} />
) : (
<div
style={{ width: size, height: size }}
className="rounded-full bg-slate-100 text-slate-700 grid place-items-center text-xs font-semibold border border-slate-200"
>
{initials}
</div>
);
}