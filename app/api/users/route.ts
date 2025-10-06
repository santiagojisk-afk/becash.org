// app/api/users/route.ts
import { API_BASE, pass } from "../_utils";

export async function GET(req: Request) {
const url = new URL(req.url);
// acepta tanto ?search= como ?q=
const search = url.searchParams.get("search") ?? url.searchParams.get("q") ?? "";
const qs = search ? `?search=${encodeURIComponent(search)}` : "";

const resp = await fetch(`${API_BASE}/api/users${qs}`, {
method: "GET",
headers: {
"Content-Type": "application/json",
// si tu backend necesita auth:
Authorization: req.headers.get("authorization") || "",
},
});

const json = await resp.json();
return pass(resp, json); // devuelve { ok, users: [...] }
}