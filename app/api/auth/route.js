// app/api/auth/signup/route.ts
import { API_BASE, readBody, jsonOrText, pass } from "@/api/_utils";

export async function POST(req: Request) {
const b = await readBody(req); // { username, fullName, password }

const resp = await fetch(`${API_BASE}/api/auth/signup`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(b),
});

// Devuelve el JSON real o el texto de error del backend
const out = await jsonOrText(resp);
return pass(resp, out);
}
