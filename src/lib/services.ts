// src/lib/services.ts
// Capa fina de servicios usando TU apiFetch existente (no creamos otro cliente).
import { apiFetch } from "@/lib/http";

/* ===== AUTH ===== */
export const Auth = {
me: () => apiFetch("/api/auth/me"),
update: (payload: any) =>
apiFetch("/api/auth/update", { method: "PATCH", body: payload }),
changePass: (payload: { currentPassword: string; newPassword: string }) =>
apiFetch("/api/auth/change-password", { method: "POST", body: payload }),
login: (payload: { username: string; password: string }) =>
apiFetch("/api/auth/login", { method: "POST", body: payload }),
signup: (payload: { username: string; fullName: string; password: string }) =>
apiFetch("/api/auth/register", { method: "POST", body: payload }),
};

/* ===== WALLET ===== */
export const Wallet = {
balance: () => apiFetch("/api/wallet"),
topup: (amount: number) => apiFetch("/api/wallet/topup", { method: "POST", body: { amount } }),
withdraw:(amount: number) => apiFetch("/api/wallet/withdraw",{ method: "POST", body: { amount } }),
};

/* ===== TRANSACTIONS ===== */
export const Tx = {
transfer: (payload: { to: string; amount: number; note?: string }) =>
apiFetch("/api/transactions/transfer", { method: "POST", body: payload }),
list: (limit = 20) => apiFetch(`/api/transactions?limit=${limit}`),
};