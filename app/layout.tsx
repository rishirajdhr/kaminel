import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaminel",
  description: "A web-based engine for creating text adventure games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
