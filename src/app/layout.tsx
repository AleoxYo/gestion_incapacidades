import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import AppHeader from "@/components/layout/AppHeader";

export const metadata = { title: "Gestión de Incapacidades" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <div style={{ display: "grid", gap: 16, padding: 16 }}>
            <AppHeader />
            <main>{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
