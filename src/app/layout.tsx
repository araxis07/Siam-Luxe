import type { Metadata } from "next";
import "@fontsource/sarabun/400.css";
import "@fontsource/sarabun/500.css";
import "@fontsource/sarabun/600.css";
import "@fontsource/sarabun/700.css";
import "@fontsource/pridi/500.css";
import "@fontsource/pridi/600.css";
import "@fontsource/pridi/700.css";
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
      <body suppressHydrationWarning className="min-h-full font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
