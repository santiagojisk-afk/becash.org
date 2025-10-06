// src/components/Avatar.tsx
"use client";

import Image from "next/image";

export default function Avatar({
src,
alt,
size = 40,
}: {
src?: string;
alt?: string;
size?: number;
}) {
return (
<div className="rounded-full overflow-hidden bg-gray-200" style={{ width: size, height: size }}>
{src ? (
<Image src={src} alt={alt || "avatar"} width={size} height={size} />
) : (
<div
className="w-full h-full flex items-center justify-center text-gray-500 text-sm"
style={{ fontSize: size * 0.4 }}
>
?
</div>
)}
</div>
);
}