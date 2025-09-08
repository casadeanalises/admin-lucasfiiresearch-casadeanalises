"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { SignInButton, useAuth } from "@clerk/nextjs";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth();

  // Debug do estado do Clerk
  useEffect(() => {
    console.log("Estado do Clerk:", { isLoaded, isSignedIn });
  }, [isLoaded, isSignedIn]);

  // Redireciona para admin se já estiver logado com Clerk - mas apenas uma vez
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Adiciona um pequeno delay para evitar loops e verificar se realmente está autenticado
      const timeoutId = setTimeout(() => {
        window.location.href = "/admin";
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoaded, isSignedIn]);

  // Mostra loading apenas se estiver carregando ou redirecionando
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se estiver logado mas ainda não redirecionou, mostra tela de redirecionamento
  if (isLoaded && isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto mb-4" />
          <p>Redirecionando...</p>
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

                {/* Divisor */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/5 px-3 text-white/60">ou</span>
                  </div>
                </div>

                {/* Login com Google - Mostra quando Clerk está carregado e não há erro */}
                {isLoaded && !isSignedIn ? (
                  <SignInButton 
                    mode="modal" 
                    forceRedirectUrl="/admin"
                  >
                    <button className="w-full bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 rounded-lg font-medium border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Entrar com Google
                    </button>
                  </SignInButton>
                ) : !isLoaded ? (
                  <div className="w-full bg-white/10 animate-pulse px-4 py-2.5 rounded-lg">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-5 w-5 bg-white/20 rounded"></div>
                      <div className="h-4 w-32 bg-white/20 rounded"></div>
                    </div>
                  </div>
                ) : null}
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