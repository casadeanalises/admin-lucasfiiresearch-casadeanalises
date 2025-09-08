import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Admin - Lucas FII Research",
  description: "Painel Administrativo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={mulish.className}>
        <Toaster />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
