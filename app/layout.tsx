import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adventure Game Engine",
  description: "A modern adventure game engine built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
