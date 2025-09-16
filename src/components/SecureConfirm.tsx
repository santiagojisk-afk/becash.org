"use client";
import { useState } from "react";

export default function SecureConfirm({ onConfirm }:{ onConfirm: (passcode: string)=>Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <button className="btn btn-primary" onClick={()=>setOpen(true)}>Continuar</button>
      {open && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
          display:"grid", placeItems:"center", zIndex:50
        }}>
          <div className="card" style={{ width:360 }}>
            <b>Confirma la transacción</b>
            <div className="sep" />
            <div style={{ fontSize:12, color:"var(--soft)" }}>
              Ingresa tu contraseña/FaceID (simulado) para autorizar.
            </div>
            <input className="input" placeholder="Código/Contraseña"
                   value={code} onChange={e=>setCode(e.target.value)} type="password" />
            <div className="row" style={{ justifyContent:"flex-end" }}>
              <button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" disabled={busy || code.length<4}
                onClick={async()=>{ setBusy(true); await onConfirm(code); setBusy(false); setOpen(false); }}>
                {busy? "Enviando..." : "Autorizar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}