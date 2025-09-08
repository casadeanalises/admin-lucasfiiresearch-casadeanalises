"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function AdminLoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

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
        const callbackUrl = searchParams.get("callbackUrl") || "/admin";
        console.log("Redirecionando para:", callbackUrl);
        window.location.href = callbackUrl;
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 relative">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl" />
              <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl" />
              
              <div className="relative">
                <div className="text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-75 blur-sm animate-pulse" />
                      <div className="absolute -inset-1 rounded-full bg-blue-400 opacity-50 blur-md animate-pulse [animation-delay:0.2s]" />
                      <div className="absolute -inset-1.5 rounded-full bg-blue-300 opacity-25 blur-lg animate-pulse [animation-delay:0.4s]" />
                      
                      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white p-2 shadow-xl ring-2 ring-white/50">
                        <Image
                          src="/logo.png"
                          alt="Logo"
                          width={120}
                          height={120}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                    Área Administrativa
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    Faça login para acessar o painel administrativo
                  </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white/80"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-white/80"
                      >
                        Senha
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-75"
                  >
                    {isLoading ? (
                      <>
                        <span className="absolute left-1/2 top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span className="opacity-0">Entrando...</span>
                      </>
                    ) : (
                      "Entrar com Email"
                    )}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}