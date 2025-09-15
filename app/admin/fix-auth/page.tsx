"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Shield, Key, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function FixAuthPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const router = useRouter();

  const handleResetAuth = async () => {
    try {
      setLoading(true);
      setMessage("Limpando cookies antigos...");

      // Primeiro faz logout para limpar qualquer cookie existente
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      setMessage("Realizando novo login...");

      // Tenta fazer login com as credenciais fornecidas
      const loginResponse = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Erro ao fazer login");
      }

      setMessage("Login realizado com sucesso! Redirecionando...");

      // Redireciona para a página de administradores
      setTimeout(() => {
        router.push("/admin/admins");
      }, 2000);
    } catch (error: any) {
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
       
        <br />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
                Restaurar Autenticação
              </h1>
              <p className="text-sm sm:text-base text-white/70 mt-1">
                Corrija problemas de autenticação e cookies
              </p>
            </div>
          </div>
        </div>

        {/* Alert Card */}
        {/* <div className="bg-white/10 backdrop-blur-sm border border-amber-400/30 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 bg-amber-100/80 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Aviso Importante</h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Esta ferramenta é usada para restaurar a autenticação quando há problemas com cookies ou sessões.
                Informe suas credenciais de administrador para realizar o processo de limpeza e novo login.
              </p>
            </div>
          </div>
        </div> */}

        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
          <div className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleResetAuth(); }} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block font-medium text-white mb-3">
                  <Key className="w-4 h-4 inline mr-2" />
                  Email do Administrador
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-medium text-white mb-3">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Senha
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="Sua senha"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading || !adminEmail || !adminPassword}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Restaurar Autenticação
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg backdrop-blur-sm border ${message.includes("Erro")
              ? "bg-red-500/20 border-red-400/30 text-red-200"
              : message.includes("sucesso")
                ? "bg-green-500/20 border-green-400/30 text-green-200"
                : "bg-blue-500/20 border-blue-400/30 text-blue-200"
            }`}>
            <div className="flex items-start gap-3">
              {message.includes("Erro") ? (
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : message.includes("sucesso") ? (
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 mt-0.5 flex-shrink-0 animate-spin" />
              )}
              <div>
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100/80 rounded-lg flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Como Funciona</h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Após o login e restauração da autenticação da limpeza de cookies, você poderá gerenciar conteúdos e administradores normalmente.
                O processo limpa cookies antigos e estabelece uma nova sessão segura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}