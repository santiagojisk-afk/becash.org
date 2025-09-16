import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
title: "Beqash",
description: "Login",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="es">
<body className={inter.className}>{children}</body>
</html>
);
}