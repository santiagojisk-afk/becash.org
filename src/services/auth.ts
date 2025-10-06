export async function apiFetch<T = any>(
path: string,
opts: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T }> {
const base = process.env.NEXT_PUBLIC_API_URL;
const url = `${base}${path}`;

const res = await fetch(url, {
...opts,
headers: {
"Content-Type": "application/json",
...(opts.headers || {})
}
});

let data: any = {};
try { data = await res.json(); } catch {}
return { ok: res.ok, status: res.status, data };
}