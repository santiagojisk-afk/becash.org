// app/api/wallet/balance/route.ts
import { API_BASE, authHeaders, pass } from "../../_utils";

export async function GET(req: Request) {
const resp = await fetch(`${API_BASE}/api/wallet/balance`, {
method: "GET",
headers: authHeaders(req),
cache: "no-store",
});
return pass(resp, await resp.json());
}