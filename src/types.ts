export type Sex = "male" | "female" | "other";
export type Id = string;

export type UserPublic = {
  id: Id; username: string; fullName: string;
  email?: string; phone?: string; sex?: Sex; avatarUrl?: string;
};

export type Tx = {
  id: Id; from: UserPublic; to: UserPublic;
  amount: number; currency: "MXN" | "USD" | string;
  note?: string; method: "username" | "email" | "phone";
  status: "pending" | "held" | "completed" | "failed" | "reverted";
  createdAt: string;
  // Social
  likes?: number; likedByMe?: boolean; messageCount?: number;
  // Fees
  fee?: number; net?: number;
};

export type OfflineIntent = {
  id: Id;
  /** ephemeral key used in LAN handshake (future) */
  ephKey: string;
  /** QR payload (future) */
  qr: string;
  /** target peer ip/mac signature (future) */
  peerHint?: string;
  expiresAt: number;
};