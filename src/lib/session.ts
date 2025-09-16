'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type User = { username:string; fullName?:string };
type Session = { user?:User; accessToken?:string };

const Ctx = createContext<{session:Session; setSession:(s:Session)=>void}>({session:{}, setSession:()=>{}});
export function SessionProvider({children}:{children:React.ReactNode}) {
  const [session,setSession]=useState<Session>({});
  useEffect(()=>{ const r=localStorage.getItem('qash_session'); if(r) setSession(JSON.parse(r)); },[]);
  useEffect(()=>{ localStorage.setItem('qash_session', JSON.stringify(session)); },[session]);
  return <Ctx.Provider value={{session,setSession}}>{children}</Ctx.Provider>;
}
export function useSession(){ return useContext(Ctx); }