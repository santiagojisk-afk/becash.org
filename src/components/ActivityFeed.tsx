"use client";
import { useEffect, useState } from "react";
import type { Tx } from "@/types";
import { apiFetch } from "@/lib/api";
import Avatar from "./Avatar";

export default function ActivityFeed({
  token,
  username,
}: {
  token: string;
  username: string;
}) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg("Cargando…");

    const r = await apiFetch(
      `/api/transactions?user=${encodeURIComponent(username)}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

    if (r.ok) {
      setTxs(r.body?.transactions || r.body || []);
      setMsg(null);
    } else {
      setMsg("No se pudo cargar actividad");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function react(id: string) {
    // FUTURO: POST /api/tx/:id/react { like: true }
    setTxs((list) =>
      list.map((t) =>
        t.id === id
          ? {
              ...t,
              likedByMe: !t.likedByMe,
              likes: (t.likes || 0) + (t.likedByMe ? -1 : 1),
            }
          : t
      )
    );
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <b>Actividad</b>
        <button className="btn btn-ghost" onClick={load}>
          Actualizar
        </button>
      </div>
      {msg && <div className="badge">{msg}</div>}
      <div className="grid">
        {txs.map((tx) => (
          <div
            key={tx.id}
            className="row"
            style={{ borderBottom: "1px dashed var(--stroke)", paddingBottom: 8 }}
          >
            <Avatar src={tx.from?.avatarUrl} sex={tx.from?.sex} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>
                @{tx.from?.username} → @{tx.to?.username}
              </div>
              <div style={{ color: "var(--soft)", fontSize: 12 }}>
                {new Date(tx.createdAt).toLocaleString()} · {tx.method} ·{" "}
                {tx.note || "—"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 900 }}>
                {(tx.amount ?? 0).toLocaleString(undefined, {
                  style: "currency",
                  currency: tx.currency || "MXN",
                })}
              </div>
              <div
                className="row"
                style={{ justifyContent: "flex-end", gap: 6 }}
              >
                <button className="btn btn-ghost" onClick={() => react(tx.id)}>
                  {tx.likedByMe ? "👍" : "👍🏻"} {tx.likes || 0}
                </button>
              </div>
            </div>
          </div>
        ))}
        {!txs.length && !msg && (
          <div className="badge">Sin movimientos</div>
        )}
      </div>
    </div>
  );
}