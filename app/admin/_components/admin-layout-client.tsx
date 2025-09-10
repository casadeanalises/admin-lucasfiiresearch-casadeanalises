"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, BarChart3, Settings, PlayCircle, Menu, LogOut, Lock, BookOpen, Bell, ChevronLeft, ChevronRight, User, Calendar, Clock, Key } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AdminFooter } from "./admin-footer";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <Home className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Notificações",
    href: "/admin/notifications",
    icon: <Bell className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Relatório Semanal",
    href: "/admin/reports",
    icon: <FileText className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Fatos Relevantes",
    href: "/admin/relevant-facts",
    icon: <FileText className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Teses de Investimento",
    href: "/admin/home-videos",
    icon: <PlayCircle className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Material Educacional",
    href: "/admin/educational",
    icon: <BookOpen className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "ETFs",
    href: "/admin/etf-videos",
    icon: <FileText className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Low Cost",
    href: "/admin/lowcost-videos",
    icon: <FileText className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Guia do Usuário",
    href: "/admin/user-guide-videos",
    icon: <PlayCircle className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Gerenciar Administradores",
    href: "/admin/admins",
    icon: <User className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Restaurar Autenticação",
    href: "/admin/fix-auth",
    icon: <Key className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Relatório Semanal Player 2",
    href: "/admin/reports-videos-player-2",
    icon: <PlayCircle className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Cronograma de Atualizações",
    href: "/admin/update-schedule",
    icon: <Clock className="h-5 w-5" />,
    isNew: false,
  },
];

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollMenu = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Verifica sistema personalizado
        const response = await fetch("/api/admin/check-access", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.isAdmin) {
            setAdminEmail(data.email);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Iniciando logout...");
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer logout");
      }

      console.log("Logout realizado com sucesso");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, redireciona para o login
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-blue-900">
      {/* Header Principal */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-blue-800 shadow-lg">
        <div className="max-w-[1920px] mx-auto">
          {/* Logo e Navegação */}
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Logo" className="h-10 w-10" />
                <div>
                  <h1 className="text-xl font-bold text-white">LUCAS FII RESEARCH</h1>
                  <p className="text-xs text-blue-200">ADMINISTRATIVO</p>
                </div>
              </div>
            </div>

            {/* Menu Mobile Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-blue-700 text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Navegação Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${pathname === "/admin" ? "bg-blue-700" : "hover:bg-blue-700"
                  }`}
              >
                Home
              </Link>
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1">
                  <span>Gerenciar Conteúdo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/admin/notifications" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Notificações
                    </Link>
                    <Link href="/admin/reports" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Relatório Semanal
                    </Link>
                    <Link href="/admin/relevant-facts" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Fatos Relevantes
                    </Link>
                    <Link href="/admin/etf-videos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      ETFs
                    </Link>
                    <Link href="/admin/home-videos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Teses de Investimento
                    </Link>
                    <Link href="/admin/lowcost-videos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Low Cost
                    </Link>
                    <Link href="/admin/educational" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Material Educacional
                    </Link>
                    <Link href="/admin/reports-videos-player-2" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Relatório Semanal Player 2
                    </Link>
                    <Link href="/admin/update-schedule" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Cronograma de Atualizações
                    </Link>
                  </div>
                </div>
              </div>

              {/* <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1">
                  <span>Gerenciar Vídeos</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/admin/home-videos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Teses de Investimento
                    </Link>
                    <Link href="/admin/user-guide-videos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Guia do Usuário
                    </Link>
                    <Link href="/admin/reports-videos-player-2" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Relatório Semanal Player 2
                    </Link>
                  </div>
                </div>
              </div> */}

              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1">
                  <span>Gerenciar Sistema</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">

                    <Link href="/admin/admins" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Gerenciar Administradores
                    </Link>
                    <Link href="/admin/fix-auth" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Restaurar Autenticação
                    </Link>

                    {/* <Link href="/admin/update-schedule" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Cronograma de Atualizações
                      </Link> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Perfil e Logout */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              {!isLoading && adminEmail && (
                <span className="text-white font-medium">{adminEmail}</span>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Menu Mobile Dropdown */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-blue-700">
              <nav className="px-4 py-2 space-y-1">
                <Link
                  href="/admin"
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === "/admin" ? "bg-blue-700 text-white" : "text-white hover:bg-blue-700"
                    }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  href="/admin/notifications"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Notificações
                </Link>
                <Link
                  href="/admin/reports"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Relatório Semanal
                </Link>
                <Link
                  href="/admin/relevant-facts"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Fatos Relevantes
                </Link>
                <Link
                  href="/admin/educational"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Material Educacional
                </Link>
                <Link
                  href="/admin/etf-videos"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  ETFs
                </Link>
                <Link
                  href="/admin/lowcost-videos"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Low Cost
                </Link>
                <Link
                  href="/admin/home-videos"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Teses de Investimento
                </Link>
                <Link
                  href="/admin/user-guide-videos"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Guia do Usuário
                </Link>

                <Link
                  href="/admin/fix-auth"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Restaurar Autenticação
                </Link>
                <Link
                  href="/admin/admins"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Gerenciar Administradores
                </Link>
                {!isLoading && adminEmail && (
                  <div className="px-4 py-2 text-sm text-blue-200 border-t border-blue-700">
                    <span>{adminEmail}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="pt-24 px-6 pb-12">
        <div className="max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>

      {/* === Footer === */}
      <AdminFooter />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
