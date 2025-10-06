// app/api/auth/login/route.ts
import { API_BASE, readBody, pass } from "../../_utils";

export async function POST(req: Request) {
const b = await readBody(req); // { username, password }

const resp = await fetch(`${API_BASE}/api/auth/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
username: b.username,
password: b.password,
}),
});

return pass(resp);
}