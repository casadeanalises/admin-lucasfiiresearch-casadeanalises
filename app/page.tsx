"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

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
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="h-48 w-48 object-contain"
              />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl font-bold text-white mb-2">
            RESEARCH
          </h1>
          <p className="text-lg text-white/80 mb-16">
            ADMINISTRATIVO
          </p>

          {/* Login Button */}
          {!showLoginForm ? (
            <button
              onClick={() => setShowLoginForm(true)}
              className="bg-white text-blue-900 px-12 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              Entrar
            </button>
          ) : (
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white/90 mb-2"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full bg-transparent border-0 border-b-2 border-white/30 px-0 py-3 text-white placeholder:text-white/50 focus:border-white focus:outline-none transition-all duration-200"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                          <div className="h-6 w-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-yellow-400 border border-white/30" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-white/90 mb-2"
                      >
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full bg-transparent border-0 border-b-2 border-white/30 px-0 py-3 pr-8 text-white placeholder:text-white/50 focus:border-white focus:outline-none transition-all duration-200"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:cursor-not-allowed disabled:opacity-75 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <>
                        <span className="absolute left-1/2 top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span className="opacity-0">Entrando...</span>
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </button>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="w-full text-white/70 hover:text-white transition-colors duration-200 text-sm"
                  >
                    ← Voltar
                  </button>
                </form>
              </div>
            </div>
          )}
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