"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, BarChart3, Settings, PlayCircle, Menu, LogOut, Lock, BookOpen, Bell, ChevronLeft, ChevronRight, User, Calendar, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
    href: "/admin/fix-auth",
    icon: <User className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Vídeos Player 2",
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
        const response = await fetch("/api/admin/check-access", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setAdminEmail(data.email);
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
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header Principal */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-lg">
        <div className="max-w-[1920px] mx-auto">
          {/* Logo e Info */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-blue-700">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">Gerencie todos os aspectos do sistema | admin: v1.2.1</p>
              </div>
            </div>

            {/* Menu Mobile Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6 text-blue-700" />
            </button>

            {/* Perfil e Logout */}
            <div className="hidden lg:flex items-center space-x-4">
              {!isLoading && adminEmail && (
                <span className="text-sm text-gray-600">{adminEmail}</span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Menu Desktop com Scroll */}
          <div className="hidden lg:flex items-center px-4 relative py-1">
            <button
              onClick={() => scrollMenu('left')}
              className="absolute left-0 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-md"
            >
              <ChevronLeft className="h-5 w-5 text-blue-700" />
            </button>
            
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-x-auto scrollbar-hide py-2 px-8"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <nav className="flex items-center space-x-2 min-w-max">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap
                        ${isActive 
                          ? "bg-blue-100 text-blue-700" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={() => scrollMenu('right')}
              className="absolute right-0 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-md"
            >
              <ChevronRight className="h-5 w-5 text-blue-700" />
            </button>
          </div>

          {/* Menu Mobile Dropdown */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200">
              <nav className="px-4 py-2 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
                        ${isActive 
                          ? "bg-blue-100 text-blue-700" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
      <main className="pt-32 px-4 pb-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 backdrop-blur-lg bg-opacity-95 mt-10">
            {children}
          </div>
        </div>
      </main>

      {/* === Footer === */}

      {/* <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 py-2">
        <div className="max-w-[1920px] mx-auto px-4 flex items-center justify-between">
          <Link
            href="/admin/fix-auth"
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <Lock className="h-4 w-4" />
            <span>Restaurar Autenticação</span>
          </Link>
          <span className="text-xs text-gray-400">admin v1.2.1</span>
        </div>
      </footer> */}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
