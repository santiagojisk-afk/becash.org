// src/components/Avatar.tsx
"use client";

import { pickAvatar, Sex } from "@/lib/avatars";

type Props = {
  src?: string | null;
  sex?: Sex;
  size?: number;       // px
  alt?: string;
  className?: string;
};

export default function Avatar({
  src,
  sex,
  size = 36,
  alt = "avatar",
  className,
}: Props) {
  const url = pickAvatar(src, sex);

  return (
    <img
      src={url}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        objectFit: "cover",
        background: "var(--card)",
        display: "block",
      }}
    />
  );
}