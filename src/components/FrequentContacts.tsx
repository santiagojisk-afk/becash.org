"use client";
import Avatar from "./Avatar";
import type { UserPublic } from "@/types";

export default function FrequentContacts({
items,
onPick,
}: {
items: UserPublic[];
onPick: (u: UserPublic) => void;
}) {
if (!items?.length) return null;

return (
<div className="card">
<div className="row" style={{ justifyContent: "space-between" }}>
<b>Frecuentes</b>
<span className="badge">Atajos</span>
</div>

<div className="row" style={{ overflowX: "auto", paddingTop: 6 }}>
{items.map((u) => (
<button
key={u.username}
onClick={() => onPick(u)}
className="btn btn-ghost"
style={{ display: "grid", placeItems: "center", gap: 6, minWidth: 86 }}
>
<Avatar src={u.avatarUrl ?? undefined} alt={`Avatar de @${u.username}`} size={48}  />
<div style={{ fontWeight: 700 }}>@{u.username}</div>
</button>
))}
</div>
</div>
);
}