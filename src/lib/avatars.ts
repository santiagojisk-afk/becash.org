// src/lib/avatars.ts
export type Sex = "male" | "female" | "other" | null | undefined;

// Avatares por defecto en data-URI (para no depender de archivos en /public)
const AVATAR_SVG = (bg: string) =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <rect width="100%" height="100%" rx="64" ry="64" fill="${bg}"/>
      <text x="50%" y="58%" font-size="64" text-anchor="middle"
            fill="#ffffff" font-family="Inter, Arial, sans-serif">Q</text>
    </svg>`
  );

export const DEFAULT_AVATARS: Record<Exclude<Sex, undefined | null>, string> = {
  male: AVATAR_SVG("#2563eb"),   // azul
  female: AVATAR_SVG("#a855f7"), // morado
  other: AVATAR_SVG("#10b981"),  // verde
};

/** Devuelve `src` si viene, si no un avatar por sexo, si no el de `other`. */
export function pickAvatar(src?: string | null, sex?: Sex): string {
  if (src && src.trim().length > 0) return src;
  if (sex && DEFAULT_AVATARS[sex]) return DEFAULT_AVATARS[sex];
  return DEFAULT_AVATARS.other;
}