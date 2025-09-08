"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const hideScrollbarStyle = `
  ::-webkit-scrollbar {
    display: none;
  }
  
  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Tentando fazer login...");
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Resposta do servidor:", data);

      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      if (data.success) {
        console.log("Login bem sucedido, redirecionando...");
        router.push("/admin");
      } else {
        throw new Error(data.message || "Erro ao fazer login");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{hideScrollbarStyle}</style>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="rounded-2xl"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Painel Administrativo
              </h2>
              <p className="text-slate-400">
                Faça login para acessar o painel de controle
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  placeholder="Digite seu email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}