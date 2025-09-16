"use client";
import { API } from "@/lib/api";

export default function Roadmap() {
  return (
    <div className="card roadmapCard" style={{ marginTop: 8 }}>
      <div className="roadmapTitle">Roadmap (incluido en UI)</div>
      <ul className="roadmapList">
        <li>👥 Contactos frecuentes <b>(listo)</b></li>
        <li>🔎 Búsqueda por <b>@usuario / correo / teléfono</b> <b>(listo)</b></li>
        <li>🧾 Notas y reacciones en transacciones <b>(UI listo)</b></li>
        <li>🛡️ Confirmación segura (FaceID/Passcode simulado)</li>
        <li>💸 Comisiones por transacción (campos fee/net en modelo – backend pendiente)</li>
        <li>📶 Pagos offline tipo Airdrop (hooks y QR preparados)</li>
        <li>🖼️ Avatares por sexo + personalizados <b>(listo)</b></li>
      </ul>

      <div className="pill" style={{ marginTop: 12 }} title={API}>
        API base: {API}
      </div>
    </div>
  );
}