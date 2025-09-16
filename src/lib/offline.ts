import type { OfflineIntent, UserPublic } from "@/types";

/** FUTURO: anuncia en LAN/BT tu intención de pagar */
export async function createOfflineIntent(amount: number, to: UserPublic): Promise<OfflineIntent> {
  const id = crypto.randomUUID();
  return {
    id,
    ephKey: Math.random().toString(36).slice(2),
    qr: JSON.stringify({ id, to: to.username, amount }),
    expiresAt: Date.now() + 1000 * 60 * 2,
  };
}

/** FUTURO: escanear/descubrir oferta en LAN */
export async function discoverPeers(): Promise<UserPublic[]> {
  // Real: mDNS/BLE/WebRTC local → listado de peers
  return [];
}

/** FUTURO: confirmar recibo en peer y dejar “held” en backend cuando vuelva internet */
export async function settleWhenOnline(intentId: string): Promise<boolean> {
  // Real: background sync + POST /api/offline/settle
  return true;
}