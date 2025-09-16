"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Session = {
user?: string;
token?: string;
};

const SessionCtx = createContext<{
session: Session | null;
setSession: (s: Session | null) => void;
}>({
session: null,
setSession: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
const [session, setSession] = useState<Session | null>(null);

useEffect(() => {
const s = localStorage.getItem("qash_session");
if (s) setSession(JSON.parse(s));
}, []);

useEffect(() => {
if (session) localStorage.setItem("qash_session", JSON.stringify(session));
else localStorage.removeItem("qash_session");
}, [session]);

return (
<SessionCtx.Provider value={{ session, setSession }}>
{children}
</SessionCtx.Provider>
);
}

export function useSession() {
return useContext(SessionCtx);
}