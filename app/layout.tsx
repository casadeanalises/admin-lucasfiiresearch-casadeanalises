import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';

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
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            title: "Entrar no Lucas FII Research",
            subtitle: "Bem-vindo de volta! Faça login para continuar"
          }
        },
        signUp: {
          start: {
            title: "Criar conta no Lucas FII Research",
            subtitle: "Crie sua conta para acessar o painel administrativo"
          }
        }
      }}
    >
      <html lang="pt-BR">
        <body className={mulish.className}>
          <Toaster />
          <main className="min-h-screen">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
