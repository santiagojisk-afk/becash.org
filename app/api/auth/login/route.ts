// app/api/auth/login/route.ts
import { API_BASE, readBody, jsonOrText, authHeaders, pass } from "../../../_utils";

export async function POST(req: Request) {
const b = await readBody(req).catch(() => ({})); // lee username y password

const resp = await fetch(`${API_BASE}/api/auth/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
username: b.username,
password: b.password,
}),
});

// ✅ aquí corregimos el error
const data = await resp.json().catch(() => ({}));
return pass(resp, data); // dos argumentos
}