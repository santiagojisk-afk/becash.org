// app/api/transactions/route.ts
import { API_BASE, authHeaders, pass, jsonOrText} from "../_utils";

export async function GET(req: Request) {
const url = new URL(req.url);
const qs = url.searchParams.toString();
const resp = await fetch(
`${API_BASE}/api/transactions${qs ? `?${qs}` : ""}`,
{
method: "GET",
headers: authHeaders(req),
cache: "no-store",
}
);
return pass(resp, await resp.json());
}