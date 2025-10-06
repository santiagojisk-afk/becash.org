// src/lib/store.ts
export type Sex = "male" | "female" | "unspecified";

export type Profile = {
username: string;
fullName?: string;
sex: Sex;
avatarUrl?: string; // dataURL si sube imagen
};

export type TxQueued = {
id: string;
to: string;
amount: number;
note?: string;
createdAt: string;
};

const K = {
PROFILE: "qash_profile",
BALANCE: "qash_balance",
PASSCODE: "qash_passcode",
};

export function loadProfile(): Profile {
try {
return JSON.parse(localStorage.getItem(K.PROFILE) || "");
} catch {
return { username: "demo", fullName: "Demo", sex: "unspecified" };
}
}

export function saveProfile(p: Profile) {
localStorage.setItem(K.PROFILE, JSON.stringify(p));
}

export function loadBalance(): number {
const v = Number(localStorage.getItem(K.BALANCE));
return Number.isFinite(v) ? v : 0;
}

export function saveBalance(v: number) {
localStorage.setItem(K.BALANCE, String(Math.max(0, v)));
}

export function loadPasscode(): string | null {
return localStorage.getItem(K.PASSCODE);
}
export function savePasscode(p: string) {
localStorage.setItem(K.PASSCODE, p);
}
export function clearPasscode() {
localStorage.removeItem(K.PASSCODE);
}