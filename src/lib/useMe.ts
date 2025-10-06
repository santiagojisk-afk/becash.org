// src/lib/useMe.ts
"use client";
import { useEffect, useState } from "react";
import { Auth } from "./services";

export function useMe() {
const [me, setMe] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => { (async () => {
try {
const r = await Auth.me();
if (!r.ok) throw new Error(r.body?.message || "No autorizado");
setMe(r.body?.user || r.body);
} catch (e: any) {
setError(e?.message || "Error");
} finally {
setLoading(false);
}
})(); }, []);

return { me, setMe, loading, error };
}