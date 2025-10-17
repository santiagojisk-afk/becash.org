// app/api/auth/route.js (JS puro, sin tipos TS)
import { API_BASE, readBody, jsonOrText, authHeaders, pass } from "../_utils";

export async function POST(req) {
const body = await readBody(req); // { username, fullName, password } o lo que envíes
const resp = await fetch(`${API_BASE}/api/auth/signup`, {
method: "POST",
headers: { "Content-Type": "application/json", ...authHeaders() },
body: JSON.stringify(body),
});

// Si tu backend devuelve JSON, usamos helper
const data = await jsonOrText(resp);
return new Response(
typeof data === "string" ? data : JSON.stringify(data),
{
status: resp.status,
headers: { "Content-Type": "application/json" },
}
);
}