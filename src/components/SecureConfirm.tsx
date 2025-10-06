// src/components/SecureConfirm.tsx
"use client";
import { useEffect, useState } from "react";

type Props = {
open: boolean;
onClose: () => void;
// puede resolver sync o async; passcode es opcional
onConfirm: (passcode?: string) => void | Promise<void>;
};

export default function SecureConfirm({ open, onClose, onConfirm }: Props) {
const [mode, setMode] = useState<"face" | "pass">("pass");
const [code, setCode] = useState("");
const [busy, setBusy] = useState(false);

// reset interno cada vez que se cierra
useEffect(() => {
if (!open) {
setMode("pass");
setCode("");
setBusy(false);
}
}, [open]);

if (!open) return null; // ⛔️ NO renderiza nada si no está abierto

async function handleConfirm() {
if (busy) return;
try {
setBusy(true);

if (mode === "face") {
await onConfirm("face");
onClose();
return;
}

// modo passcode
if (!code || code.length < 4) {
alert("El passcode debe tener al menos 4 caracteres");
return;
}
await onConfirm(code);
onClose();
} finally {
setBusy(false);
}
}

return (
<div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
<div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow">
<div className="flex items-center justify-between mb-3">
<b>Confirmación segura</b>
<button className="text-gray-500" onClick={onClose} aria-label="Cerrar">
✕
</button>
</div>

<div className="flex gap-2 mb-4">
<button
className={`tab ${mode === "face" ? "tab--active" : ""}`}
onClick={() => setMode("face")}
type="button"
>
Face ID
</button>
<button
className={`tab ${mode === "pass" ? "tab--active" : ""}`}
onClick={() => setMode("pass")}
type="button"
>
Passcode
</button>
</div>

{mode === "face" ? (
<div className="text-center space-y-3">
<div className="text-6xl">🙂</div>
<div className="text-sm" style={{ color: "var(--muted)" }}>
Simulando Face ID…
</div>
<button className="btn-primary" onClick={handleConfirm} disabled={busy}>
{busy ? "Enviando..." : "Confirmar"}
</button>
</div>
) : (
<div className="space-y-3">
<div className="text-xs" style={{ color: "var(--muted)" }}>
Ingresa tu contraseña para autorizar.
</div>
<input
className="input"
placeholder="Código/Contraseña"
value={code}
onChange={(e) => setCode(e.target.value)}
type="password"
autoFocus
/>
<div className="flex justify-end gap-2">
<button className="btn btn-ghost" onClick={onClose} disabled={busy} type="button">
Cancelar
</button>
<button
className="btn-primary"
onClick={handleConfirm}
disabled={busy || code.length < 4}
type="button"
>
{busy ? "Enviando..." : "Autorizar"}
</button>
</div>
</div>
)}
</div>
</div>
);
}
