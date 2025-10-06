"use client";
import { useState } from "react";

function Modal({ open, onClose, title, children }:{ open:boolean; onClose:()=>void; title:string; children:React.ReactNode }) {
if (!open) return null;
return (
<div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
<div className="bg-white rounded-2xl p-6 w-full max-w-sm">
<div className="flex items-center justify-between mb-3">
<b>{title}</b>
<button className="text-gray-500" onClick={onClose}>✕</button>
</div>
{children}
</div>
</div>
);
}

export function ForgotPasswordModal({ open, onClose }:{ open:boolean; onClose:()=>void }) {
const [username, setUsername] = useState("");
function submit(e: React.FormEvent) {
e.preventDefault();
if (!username) return alert("Escribe tu usuario");
alert("Si este usuario existe, enviaremos un enlace de recuperación (simulado).");
setUsername(""); onClose();
}
return (
<Modal open={open} onClose={onClose} title="¿Olvidaste tu contraseña?">
<form onSubmit={submit} className="grid gap-2">
<input className="input" placeholder="Tu usuario" value={username} onChange={(e)=>setUsername(e.target.value)} />
<button className="btn-primary" type="submit">Enviar enlace</button>
</form>
</Modal>
);
}

export function ChangePasswordModal({ open, onClose }:{ open:boolean; onClose:()=>void }) {
const [oldp, setOldp] = useState("");
const [newp, setNewp] = useState("");
function submit(e: React.FormEvent) {
e.preventDefault();
if (!newp) return alert("Escribe la nueva contraseña");
alert("Contraseña cambiada (simulado).");
setOldp(""); setNewp(""); onClose();
}
return (
<Modal open={open} onClose={onClose} title="Cambiar contraseña">
<form onSubmit={submit} className="grid gap-2">
<input className="input" type="password" placeholder="Contraseña actual" value={oldp} onChange={(e)=>setOldp(e.target.value)} />
<input className="input" type="password" placeholder="Nueva contraseña" value={newp} onChange={(e)=>setNewp(e.target.value)} />
<button className="btn-primary" type="submit">Guardar nueva</button>
</form>
</Modal>
);
}