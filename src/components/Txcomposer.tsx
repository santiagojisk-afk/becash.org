"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { UserPublic } from "@/types";

export default function TxComposer({
  token,
  to,
}: {
  token: string;
  to: UserPublic;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  async function sendTx() {
    const r = await apiFetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: to.username,
        amount,
        note,
      }),
    });

    if (!r.ok) {
      alert("No se pudo enviar la transacción");
      return;
    }

    alert("Transacción enviada ✅");
    setAmount(0);
    setNote("");
  }

  return (
    <div className="card">
      <h3>Enviar a @{to.username}</h3>
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Nota"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="btn btn-primary" onClick={sendTx}>
        Enviar
      </button>
    </div>
  );
}