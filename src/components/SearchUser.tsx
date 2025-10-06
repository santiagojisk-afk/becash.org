"use client";

import { useEffect, useRef, useState } from "react";

type UserLite = {
_id?: string;
id?: string;
username: string;
fullName?: string;
avatarUrl?: string;
};

type Props = {
/** Token JWT (opcional) para llamar al backend */
token?: string | null;

/** Si lo pasas, el input es controlado */
value?: string;
onChange?: (v: string) => void;

/** Se ejecuta al elegir un usuario */
onSelect?: (user: UserLite) => void;

placeholder?: string;
className?: string;
};

/**
* Buscador de usuarios por @handle
* - Evita errores si no envías onSelect (usa noop).
* - Funciona en modo controlado o no controlado.
*/
export default function SearchUser({
token = null,
value,
onChange,
onSelect = () => {}, // 👈 evita "onSelect is not a function"
placeholder = "@usuario",
className = "",
}: Props) {
// modo controlado o interno
const [inner, setInner] = useState("");
const query = value ?? inner;

const [loading, setLoading] = useState(false);
const [items, setItems] = useState<UserLite[]>([]);
const [error, setError] = useState<string | null>(null);

const controllerRef = useRef<AbortController | null>(null);

// Normaliza respuesta del backend a array de usuarios
function pickArray(resp: any): any[] {
if (!resp) return [];
// Tu backend: { ok, results: [...] }
if (Array.isArray(resp.results)) return resp.results;
// Variante previa: { users: [...] }
if (Array.isArray(resp.users)) return resp.users;
// Otras variantes defensivas:
if (Array.isArray(resp.items)) return resp.items;
if (Array.isArray(resp.data)) return resp.data;
return [];
}

// Búsqueda con debounce simple
useEffect(() => {
const raw = String(query || "").trim().replace(/^@/, "");
if (!raw) {
setItems([]);
setError(null);
return;
}

setLoading(true);
setError(null);

// cancelar fetch anterior
controllerRef.current?.abort();
const ctrl = new AbortController();
controllerRef.current = ctrl;

const t = setTimeout(async () => {
try {
const url = `/api/users?search=${encodeURIComponent(raw)}&limit=20`;
const res = await fetch(url, {
headers: token ? { Authorization: `Bearer ${token}` } : undefined,
signal: ctrl.signal,
});
const data = await res.json().catch(() => ({}));
if (!res.ok || data?.ok === false) {
throw new Error(data?.message || "No se pudo buscar");
}

const arr = pickArray(data);
const list: UserLite[] = arr
.map((u: any) => ({
_id: u?._id ?? u?.id,
id: u?.id ?? u?._id,
username: String(u?.username || u?.handle || "").trim(),
fullName: u?.fullName || "",
avatarUrl: u?.avatarUrl || "",
}))
.filter((u: UserLite) => u.username);

setItems(list);
} catch (e: any) {
if (e?.name !== "AbortError") setError(e?.message || "Error");
setItems([]);
} finally {
setLoading(false);
}
}, 250);

return () => {
clearTimeout(t);
ctrl.abort();
};
}, [query, token]);

const handleChange = (v: string) => {
onChange ? onChange(v) : setInner(v);
};

return (
<div className={className}>
<input
className="input w-full"
placeholder={placeholder}
value={query}
onChange={(e) => handleChange(e.target.value)}
/>

{loading && (
<div className="mt-2 text-xs text-gray-500">Buscando…</div>
)}
{error && (
<div className="mt-2 text-xs text-red-600">Error: {error}</div>
)}

{!!items.length && (
<ul className="mt-2 rounded-lg border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden">
{items.map((u) => (
<li
key={u.id || u._id || u.username}
className="cursor-pointer px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
onClick={() => onSelect(u)} // ✅ ya no truena aunque no pases onSelect
>
<img
src={u.avatarUrl || "/default-profile.png"}
alt={u.username}
className="w-7 h-7 rounded-full object-cover"
/>
<div className="min-w-0">
<div className="text-sm font-medium truncate">@{u.username}</div>
{u.fullName && (
<div className="text-xs text-gray-500 truncate">{u.fullName}</div>
)}
</div>
</li>
))}
</ul>
)}
</div>
);
}