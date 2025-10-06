import { API_BASE, authHeaders, pass } from "../../_utils";
export async function GET(req: Request) {
const resp = await fetch(`${API_BASE}/api/wallet/history`, {
method: "GET",
headers: authHeaders(req),
});
return pass(resp, await resp.json());
}