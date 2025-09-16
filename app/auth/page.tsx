import "./globals.css";
import { SessionProvider } from "@/lib/session";

export const metadata = {
  title: "Qash",
  description: "Pagos simples y sociales",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}