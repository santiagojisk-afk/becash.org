// src/components/TopupModal.tsx
"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/http"; // ✅ desde http, no desde lib/api

type Props = {
open: boolean;
token: string | null;
username: string;
onClose: () => void;
};

export default function TopupModal({ open, token, username, onClose }: Props) {
const [loading, setLoading] = useState<"oxxo" | "spei" | null>(null);

if (!open) return null;

async function run(method: "oxxo" | "spei") {
setLoading(method);
try {
const r = await apiFetch("/api/wallet/topup", {
method: "POST",
headers: {
...(token ? { Authorization: `Bearer ${token}` } : {}), // si tu backend lo requiere
},
body: JSON.stringify({
username,
amount: 0, // o el monto que definas
method,
}),
});

if (!r.ok || r.data?.ok === false) {
throw new Error(r.data?.message || "No se pudo iniciar recarga");
}

alert(method === "oxxo" ? "Referencia OXXO generada" : "CLABE SPEI mostrada");
onClose();
} catch (e: any) {
alert(e?.message || "No se pudo iniciar recarga");
} finally {
setLoading(null);
}
}

return (
<div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4">
<div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
<b className="block mb-3">Agregar fondos</b>
<div className="grid gap-3">
<button
className="btn-primary"
disabled={loading !== null}
onClick={() => run("oxxo")}
>
{loading === "oxxo" ? "Generando…" : "OXXO"}
</button>
<button
className="btn-primary"
disabled={loading !== null}
onClick={() => run("spei")}
>
{loading === "spei" ? "Generando…" : "SPEI"}
</button>
<button className="btn" onClick={onClose}>
Cancelar
</button>
</div>
</div>
</div>
);
}