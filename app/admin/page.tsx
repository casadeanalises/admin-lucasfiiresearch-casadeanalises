import Link from "next/link";
import { FileText, Settings, PlayCircle, BookOpen, Bell, User, Calendar, Key, Home } from "lucide-react";
import { AdminInfo } from "./_components/admin-info";

export default function AdminDashboard() {
  const adminAreas = [
    {
      title: "Notificações",
      description: "Gerencie as Notificações",
      icon: <Bell className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/notifications",
      color: "red",
      isNew: false,
    },

    {
      title: "Relatório Semanal",
      description: "Gerencie PDFs e Vídeos",
      icon: (
        <div className="flex items-center gap-1">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
          <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8" />
        </div>
      ),
      href: "/admin/reports",
      color: "indigo",
      isNew: false,
    },

    {
      title: "ETFs",
      description: "Gerencie PDFs e Vídeos",
      icon: (
        <div className="flex items-center gap-1">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
          <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8" />
        </div>
      ),
      href: "/admin/etf-videos",
      color: "yellow",
      isNew: false,
    },

    {
      title: "Low Cost",
      description: "Gerencie PDFs e Vídeos",
      icon: (
        <div className="flex items-center gap-1">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
          <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8" />
        </div>
      ),
      href: "/admin/lowcost-videos",
      color: "orange",
      isNew: false,
    },

    {
      title: "Fatos Relevantes",
      description: "Gerencie os PDFs",
      icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/relevant-facts",
      color: "indigo",
      isNew: false,
    },

    {
      title: "Relatório Semanal Player 2",
      description: "Gerencie os Vídeos do Relatório Semanal",
      icon: <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/reports-videos-player-2",
      color: "blue",
      isNew: false,
    },

    {
      title: "Teses de Investimento",
      description: "Gerencie os Vídeos",
      icon: <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/home-videos",
      color: "purple",
      isNew: false,
    },

    {
      title: "Guia do Usuário",
      description: "Gerencie os Vídeos",
      icon: <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/user-guide-videos",
      color: "green",
      isNew: false,
    },


    {
      title: "Material Educacional",
      description: "Gerencie o Material Educacional",
      icon: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/educational",
      color: "slate",
      isNew: false,
    },




    {
      title: "Cronograma de Atualizações",
      description: "Gerencie o cronograma de desenvolvimento da plataforma",
      icon: <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/update-schedule",
      color: "cyan",
      isNew: false,
    },
    {
      title: "Gerenciar Administradores",
      description: "Adicionar, Editar e Excluir Administradores",
      icon: <User className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/admins",
      color: "blue-dark",
      isNew: false,
    },
    {
      title: "Restaurar Autenticação",
      description: "Restaurar Acesso",
      icon: <Key className="h-6 w-6 sm:h-8 sm:w-8" />,
      href: "/admin/fix-auth",
      color: "blue-dark",
      isNew: false,
    },
    // {
    //   title: "Configurações",
    //   description: "Gerencie as configurações do sistema ",
    //   icon: <Settings className="h-6 w-6 sm:h-8 sm:w-8" />,
    //   href: "#",
    //   color: "slate",
    //   isNew: true,
    // },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* === Header Section === */}

        <br />

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Home className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
              Dashboard Administrativo
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/70 mt-1">
              Gerencie todos os aspectos do sistema
            </p>
          </div>
        </div>

        {/* Admin Info Component */}
        {/* <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
          <AdminInfo />
        </div> */}

        {/* Cards Grid */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {adminAreas.map((area, index) => (
            <Link
              key={area.title}
              href={area.href}
              className={`group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-4 sm:p-6 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:shadow-xl ${area.href === "#"
                ? "cursor-not-allowed opacity-60"
                : "hover:scale-105"
                }`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Icon Container */}
              <div className="relative mb-3 sm:mb-4">
                <div className="relative inline-flex rounded-lg p-2 sm:p-3 bg-white/20 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {area.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative space-y-1 sm:space-y-2">
                <h3 className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-white/90 transition-colors duration-300">
                  <span className="truncate">{area.title}</span>
                  {area.isNew && (
                    <span className="inline-flex items-center rounded-full bg-blue-500/20 border border-blue-400/30 px-2 py-1 text-xs font-semibold text-blue-200 flex-shrink-0">
                      Em breve
                    </span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300 line-clamp-2">
                  {area.description}
                </p>
              </div>

              {/* Bottom Accent */}
              {!area.isNew && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b-lg">
                  <div className="h-full w-full bg-gradient-to-r from-white/40 to-white/60 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
