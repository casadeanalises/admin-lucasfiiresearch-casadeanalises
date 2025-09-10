import Link from "next/link";
import { FileText, Settings, PlayCircle, BookOpen, Bell, User, Calendar } from "lucide-react";
import { AdminInfo } from "./_components/admin-info";

export default function AdminDashboard() {
  const adminAreas = [
    {
      title: "Notificações",
      description: "Gerencie as Notificações",
      icon: <Bell className="h-8 w-8" />,
      href: "/admin/notifications",
      color: "red",
      isNew: false,
    },
    {
      title: "Relatório Semanal",
      description: "Gerencie PDFs e Vídeos",
      icon: <FileText className="h-8 w-8" />,
      href: "/admin/reports",
      color: "indigo",
      isNew: false,
    },
    {
      title: "Fatos Relevantes",
      description: "Gerencie os PDFs",
      icon: <FileText className="h-8 w-8" />,
      href: "/admin/relevant-facts",
      color: "indigo",
      isNew: false,
    },
    {
      title: "Teses de Investimento",
      description: "Gerencie os Vídeos",
      icon: <PlayCircle className="h-8 w-8" />,
      href: "/admin/home-videos",
      color: "purple",
      isNew: false,
    },
    {
      title: "Material Educacional",
      description: "Gerencie o Material Educacional",
      icon: <BookOpen className="h-8 w-8" />,
      href: "/admin/educational",
      color: "slate",
      isNew: false,
    },
    {
      title: "ETFs",
      description: "Gerencie PDFs e Vídeos",
      icon: <FileText className="h-8 w-8" />,
      href: "/admin/etf-videos",
      color: "yellow",
      isNew: false,
    },
    {
      title: "Low Cost",
      description: "Gerencie PDFs e Vídeos",
      icon: <FileText className="h-8 w-8" />,
      href: "/admin/lowcost-videos",
      color: "orange",
      isNew: false,
    },
    {
      title: "Guia do Usuário",
      description: "Gerencie os Vídeos",
      icon: <PlayCircle className="h-8 w-8" />,
      href: "/admin/user-guide-videos",
      color: "green",
      isNew: false,
    },
    {
      title: "Relatório Semanal Player 2",
      description: "Gerencie os Vídeos do Relatório Semanal",
      icon: <PlayCircle className="h-8 w-8" />,
      href: "/admin/reports-videos-player-2",
      color: "blue",
      isNew: false,
    },
    {
      title: "Cronograma de Atualizações",
      description: "Gerencie o cronograma de desenvolvimento da plataforma",
      icon: <Calendar className="h-8 w-8" />,
      href: "/admin/update-schedule",
      color: "cyan",
      isNew: false,
    },
    {
      title: "Gerenciar Administradores",
      description: "Adicionar e Restaurar Acesso",
      icon: <User className="h-8 w-8" />,
      href: "/admin/fix-auth",
      color: "blue-dark",
      isNew: false,
    },
    {
      title: "Configurações",
      description: "Gerencie as configurações do sistema ",
      icon: <Settings className="h-8 w-8" />,
      href: "#",
      color: "slate",
      isNew: true,
    },
  ];

  const getGradientClass = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-600 to-blue-800";
      case "indigo":
        return "from-indigo-600 to-indigo-800";
      case "purple":
        return "from-purple-600 to-purple-800";
      case "cyan":
        return "from-cyan-600 to-cyan-800";
      case "red":
        return "from-red-600 to-red-800";
      case "green":
        return "from-green-600 to-green-800";
      case "yellow":
        return "from-yellow-600 to-yellow-800";
      case "orange":
        return "from-orange-600 to-orange-800";
      case "blue-dark":
        return "from-blue-900 to-blue-800";
      default:
        return "from-slate-600 to-slate-800";
    }
  };

  const getIconClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600";
      case "indigo":
        return "bg-indigo-50 text-indigo-600";
      case "purple":
        return "bg-purple-50 text-purple-600";
      case "cyan":
        return "bg-cyan-50 text-cyan-600";
      case "red":
        return "bg-red-50 text-red-600";
      case "green":
        return "bg-green-50 text-green-600";
      case "yellow":
        return "bg-yellow-50 text-yellow-600";
      case "orange":
        return "bg-orange-50 text-orange-600";
      case "blue-dark":
        return "bg-blue-900 text-blue-50";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getProgressClass = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-600";
      case "indigo":
        return "from-indigo-500 to-indigo-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "cyan":
        return "from-cyan-500 to-cyan-600";
      case "red":
        return "from-red-500 to-red-600";
      case "green":
        return "from-green-500 to-green-600";
      case "yellow":
        return "from-yellow-500 to-yellow-600";
      case "orange":
        return "from-orange-500 to-orange-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Título da Seção */}
      {/* <h2 className="text-3xl font-bold text-white mt-8">
        Gerenciar Sistema
      </h2> */}

      <br />


      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {adminAreas.map((area, index) => (
          <Link
            key={area.title}
            href={area.href}
            className={`group relative overflow-hidden rounded-xl bg-white p-6 transition-all duration-300 hover:shadow-xl ${area.href === "#"
                ? "cursor-not-allowed opacity-60"
                : "hover:scale-105 hover:shadow-2xl"
              }`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${getGradientClass(
                area.color
              )}`}
            />

            {/* Icon Container */}
            <div className="relative mb-4">
              <div
                className={`absolute inset-0 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-300 ${area.color === "blue"
                    ? "bg-blue-500"
                    : area.color === "indigo"
                      ? "bg-indigo-500"
                      : area.color === "purple"
                        ? "bg-purple-500"
                        : area.color === "cyan"
                          ? "bg-cyan-500"
                          : area.color === "orange"
                            ? "bg-orange-500"
                            : area.color === "red"
                              ? "bg-red-500"
                              : area.color === "green"
                                ? "bg-green-500"
                                : area.color === "yellow"
                                  ? "bg-yellow-500"
                                  : "bg-slate-500"
                  }`}
              />
              <div className={`relative inline-flex rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform duration-300 ${getIconClass(area.color)}`}>
                {area.icon}
              </div>
            </div>

            {/* Content */}
            <div className="relative space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                {area.title}
                {area.isNew && (
                  <span className="inline-flex items-center rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                    Em breve
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {area.description}
              </p>
            </div>

            {/* Bottom Accent */}
            {!area.isNew && (
              <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-xl">
                <div
                  className={`h-full w-full bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${getProgressClass(
                    area.color
                  )}`}
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}