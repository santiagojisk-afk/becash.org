export type CashMethod = "spei" | "oxxo" | "seven";

export type TopupResult =
| { ok:true; method:"spei"; amount:number; expiresAt?:string; spei:{ clabe:string; beneficiario:string; concepto:string } }
| { ok:true; method:"oxxo"; amount:number; expiresAt?:string; oxxo:{ referencia:string } }
| { ok:true; method:"seven"; amount:number; expiresAt?:string; seven:{ referencia:string } }
| { ok:false; message:string };

export type WithdrawResult =
| { ok:true; method:"spei"; amount:number; spei:{ rastreo:string; beneficiario:string; banco:string; concepto:string } }
| { ok:true; method:"oxxo"; amount:number; oxxo:{ retiro:string; pin:string; expiresAt?:string } }
| { ok:true; method:"seven"; amount:number; seven:{ retiro:string; pin:string; expiresAt?:string } }
| { ok:false; message:string };

const rnd = (n:number)=>Math.floor(Math.random()*n);
const pad = (n:number,l=2)=>n.toString().padStart(l,"0");

// 👉 Sustituye solo el contenido de estas funciones cuando conectes el proveedor real.
export async function providerTopupInit(params:{ amount:number; method:CashMethod; userId?:string }): Promise<TopupResult> {
const { amount, method } = params;
const expiresAt = new Date(Date.now()+2*60*60*1000).toISOString();

if (method === "spei") {
const clabe = `646180${pad(rnd(999999999999),12)}`.slice(0,18);
const concepto = `USR${pad(rnd(999999),6)}-${pad(rnd(9999),4)}`;
return { ok:true, method, amount, expiresAt, spei:{ clabe, beneficiario:"QASH Recargas", concepto } };
}
if (method === "oxxo") {
const referencia = `${pad(rnd(9999),4)} ${pad(rnd(9999),4)} ${pad(rnd(9999),4)} ${pad(rnd(9999),4)}`;
return { ok:true, method, amount, expiresAt, oxxo:{ referencia } };
}
const referencia = `${pad(rnd(99999999),8)}-${pad(rnd(9999),4)}`;
return { ok:true, method:"seven", amount, expiresAt, seven:{ referencia } };
}

export async function providerWithdrawInit(params:{ amount:number; method:CashMethod; userId?:string; destClabe?:string }): Promise<WithdrawResult> {
const { amount, method } = params;

if (method === "spei") {
const rastreo = `RST-${pad(rnd(999999),6)}-${pad(rnd(9999),4)}`;
return { ok:true, method, amount, spei:{ rastreo, beneficiario:"Beneficiario CLABE", banco:"Banco destino", concepto:"RETIRO-QASH" } };
}
const expiresAt = new Date(Date.now()+2*60*60*1000).toISOString();
const retiro = `RTO-${pad(rnd(999999),6)}-${pad(rnd(999),3)}`;
const pin = `${pad(rnd(9999),4)}`;

if (method === "oxxo") return { ok:true, method, amount, oxxo:{ retiro, pin, expiresAt } };
return { ok:true, method:"seven", amount, seven:{ retiro, pin, expiresAt } };
}