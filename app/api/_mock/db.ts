// ❗️Solo para desarrollo: se reinicia al reiniciar el server.
export type Tx = { id:string; amount:number; note?:string; from?:string; to?:string; createdAt:string; type:"in"|"out" };
let balance = 1250; // saldo inicial demo
let seq = 1;
const txs: Tx[] = [];

export const db = {
getBalance: () => balance,
setBalance: (v:number) => (balance = v),
addTx: (t: Omit<Tx,"id"|"createdAt">) => {
const tx: Tx = { id:String(seq++), createdAt:new Date().toISOString(), ...t };
txs.unshift(tx);
return tx;
},
listTxs: () => txs,
};