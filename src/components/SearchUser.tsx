"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { UserPublic } from "@/types";

export default function SearchUser({ Stoken, onSelect }:{
  token?: string|null; onSelect:(u:UserPublic)=>void;
}) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<UserPublic[]>([]);
  useEffect(()=>{
    const t = setTimeout(async()=>{
      if (!q) { setRes([]); return; }
     const r = await apiFetch(
  `/api/users?search=${encodeURIComponent(q)}`,
  {},
  token
);
setRes(r.ok ? (r.body?.users || r.body || []) : []);
    }, 250);
    return ()=>clearTimeout(t);
  },[q,token]);
  return (
    <div className="card">
      <b>Buscar usuario</b>
      <div className="row">
        <input className="input" placeholder="@usuario / correo / teléfono" value={q} onChange={e=>setQ(e.target.value)} />
        <span className="badge">/api/users</span>
      </div>
      {!!res.length && (
        <div className="grid" style={{ marginTop:8 }}>
          {res.map((u:UserPublic)=>(
            <button key={u.username} className="btn btn-ghost row" onClick={()=>onSelect(u)} style={{ justifyContent:"space-between" }}>
              <div className="row" style={{ gap:10 }}>
                <span style={{ fontWeight:800 }}>@{u.username}</span>
                <span style={{ color:"var(--soft)" }}>{u.fullName}</span>
              </div>
              <span className="badge">Elegir</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}