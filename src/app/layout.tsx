import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siam Lux",
  description: "Premium Thai food ordering frontend built with Next.js App Router.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full font-sans text-foreground">{children}</body>
    </html>
  );
}
