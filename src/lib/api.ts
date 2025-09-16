export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type ApiResp<T = any> = {
  ok: boolean;
  status: number;
  body?: T;
  raw?: Response;
  error?: string;
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResp<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  try {
    const res = await fetch(url, { ...options, headers });

    let body: any = null;
    const text = await res.text();
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body,
        raw: res,
        error:
          (body && (body.message || body.error)) ||
          `HTTP ${res.status} ${res.statusText}`,
      };
    }

    return { ok: true, status: res.status, body, raw: res };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err?.message || "Network/Fetch error",
    };
  }
}