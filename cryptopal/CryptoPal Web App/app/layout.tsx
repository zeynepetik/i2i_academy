import type { Metadata } from "next";
import "./globals.css";
import AuthHydrator from "@/components/terminal/AuthHydrator";

export const metadata: Metadata = {
  title: "CryptoPal — Real-Time Trading Terminal",
  description: "Simulated crypto trading terminal with an AI trading assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthHydrator />
        {children}
      </body>
    </html>
  );
}
