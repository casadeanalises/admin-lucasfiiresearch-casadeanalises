"use client";

import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { useAuth, SignOutButton, useUser } from "@clerk/nextjs";

export function AdminInfo() {
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [authType, setAuthType] = useState<'clerk' | 'custom' | null>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/"; // Volta para página inicial
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setError("");
        
        // Primeiro verifica se está autenticado com Clerk
        if (isSignedIn && user) {
          setAdminEmail(user.primaryEmailAddress?.emailAddress || "Usuário Clerk");
          setAuthType('clerk');
          setIsLoading(false);
          return;
        }
        
        // Se não estiver com Clerk, verifica sistema personalizado
        const res = await fetch("/api/admin/check-access");
        const data = await res.json();
        
        console.log("Resposta do check-access:", data);
        
        if (data.admin?.email) {
          setAdminEmail(data.admin.email);
          setAuthType('custom');
        } else {
          setError("Email não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar informações do admin:", error);
        setError("Erro ao carregar");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [isSignedIn, user]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm">
        <div className="rounded-full bg-white/10 p-2">
          <User className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-3 w-16 animate-pulse rounded bg-white/20"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-white/20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">
        <div className="rounded-full bg-red-500/10 p-2">
          <User className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-red-200/60">Admin</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!adminEmail) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm">
        <div className="rounded-full bg-white/10 p-2">
          <User className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white/60">
            Administrador {authType === 'clerk' ? '(Clerk)' : '(Sistema)'}
          </span>
          <span className="text-sm">{adminEmail}</span>
        </div>
      </div>

      {authType === 'clerk' ? (
        <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
            <LogOut className="h-5 w-5" />
            <span>Sair (Clerk)</span>
          </button>
        </SignOutButton>
      ) : (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair (Sistema)</span>
        </button>
      )}
    </div>
  );
} 
