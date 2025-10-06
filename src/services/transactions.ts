import { apiFetch } from "@/lib/http";

export async function signup(username: string, fullName: string, password: string) {
return apiFetch("/api/auth/register", {
method: "POST",
body: JSON.stringify({ username, fullName, password })
});
}

export async function login(username: string, password: string) {
return apiFetch("/api/auth/login", {
method: "POST",
body: JSON.stringify({ username, password })
});
}