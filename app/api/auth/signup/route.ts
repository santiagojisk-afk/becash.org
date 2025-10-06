// app/api/auth/signup/route.ts
import { API_BASE, readBody } from "@/api/_utils";

async function parseAny(resp: Response) {
const text = await resp.text();
try {
return JSON.parse(text);
} catch {
return { ok: false, message: text || resp.statusText };
}
}

export async function POST(req: Request) {
const body = await readBody(req); // { username, fullName, password }

const resp = await fetch(`${API_BASE}/api/auth/signup`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(body),
});

const out = await parseAny(resp);

// Devuelve SIEMPRE JSON con detalle y status para que el front lo vea
return new Response(
JSON.stringify({
status: resp.status,
ok: resp.ok,
...out,
}),
{
status: resp.status,
headers: { "Content-Type": "application/json" },
}
);
}