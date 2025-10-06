// src/services/wallet.ts
import { apiFetch } from "@/lib/http";

/** Lista las transacciones de un usuario (por handle/username) */
export async function listTransactions(username: string) {
return apiFetch(`/api/transactions?user=${encodeURIComponent(username)}`);
}

/**
* Transfiere saldo al usuario destino.
* - El backend toma el remitente desde el JWT, así que NO mandes fromUser.
* - Acepta "@handle" o "handle" en `toUser`.
*/
export async function transfer(toUser: string, amount: number, note?: string) {
return apiFetch("/api/transactions/transfer", {
method: "POST",
body: JSON.stringify({
toHandle: toUser, // 👈 clave que espera el backend
amount,
note,
}),
});
}

/* (Opcional) Alias por claridad si prefieres enviar sin @ */
export const transferToUsername = transfer;