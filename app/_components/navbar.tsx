"use client";

import { UserButton, useAuth, useUser, SignOutButton, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  LogInIcon,
  Menu,
  X,
  ShieldCheck,
  BarChart3Icon,
  ArrowRightIcon,
  Wallet,
  Heart,
  Trophy,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  User,
  CreditCard,
  BookOpen,
  MessageCircle,
  Package,
  GraduationCap,
  Building2,
  TrendingUp,
  ChevronDown,
  Newspaper,
  LineChart,
  FileText,
  Star,
  BarChart3,
  ChevronRight,
  LifeBuoy,
  Wrench,
  Calendar,
  Clock,
  Users2Icon

} from "lucide-react";
import { toast } from "sonner";
import { MouseEvent, useState, useEffect, FormEvent, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { mongoFiiService } from "@/app/services/mongoFiiService";
import { FII } from "@/app/types/FII";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUnreadNotificationsCount } from "@/app/hooks/useUnreadNotificationsCount";
import NotificationDrawer from "./NotificationDrawer";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Funções de formatação
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

interface MenuItem {
  label: string;
  href: string;
  beta?: boolean;
  soon?: boolean;
  new?: boolean;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FII[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { count: unreadCount, refetch: refetchNotifications } = useUnreadNotificationsCount();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const menuItems: Record<string, MenuItem[]> = {
    Research: [
      { label: "Relatório Semanal", href: "/reports" },
      { label: "Fatos Relevantes", href: "/relevant-facts" },
      { label: "Fundos Recomendados", href: "/recommended-funds" },
      { label: "Teses de Investimento", href: "/videos" },
      { label: "Fundos não Recomendados", href: "/non-recommended-funds", },
      { label: "Material Educacional", href: "/educational" },
    ],

    "Dados de Mercado": [
      { label: "Selic", href: "/selic" },
      { label: "IPCA", href: "/ipca" },
      { label: "IPCA-15", href: "/ipca-15" },
      { label: "IGP-M", href: "/igpm", new: true },
      { label: "IGP-DI", href: "/igpdi", new: true },
      { label: "Meta de Inflação", href: "/inflation-target", new: true },
      // { label: "Juros Futuros", href: "/future-interest", new: true },
      // { label: "Boletim Focus", href: "/focus-bulletin", new: true },

    ],

    "Fundos": [
      // { label: "Lista de Fundos", href: "/fundlists", new: true },
      { label: "Lista de Fundos", href: "/", soon: true },

    ],

    "Produtos": [
      { label: "ETFs", href: "/etf-videos", new: true },
      { label: "Low Cost", href: "#", soon: true },
    ],

    "Ferramentas": [
      // { label: "Calculadoras", href: "/calculators", new: true },
      { label: "Calculadoras", href: "/", soon: true },

      // { label: "Minha Carteira", href: "/my-wallet", soon: true },
    ],

    // "Gratuito": [
    //   { label: "Material Educacional", href: "/educational" },
    // ],


  };

  // Função para extrair todos os itens do menu em uma única lista
  const getAllMenuItems = () => {
    const allItems: MenuItem[] = [];
    Object.entries(menuItems).forEach(([_, items]) => {
      allItems.push(...items);
    });
    return allItems;
  };

  useEffect(() => {
    const hasAdminToken = document.cookie.includes("admin_token=");
    setIsAdmin(hasAdminToken);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setIsSearching(true);

      const timer = setTimeout(async () => {
        try {

          const results = await mongoFiiService.searchFIIs(searchTerm);

          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error("Erro ao buscar FIIs:", error);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  // Efeito para fechar a barra de pesquisa quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (showSearchBar && !(event.target as Element).closest('.search-container')) {
        setShowSearchBar(false);
        setSearchTerm("");
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchBar]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/fundlists?search=${encodeURIComponent(searchTerm)}`);
      setShowSearchResults(false);
    } else {
      router.push("/fundlists");
    }
  };

  const navigateToFII = (ticker: string) => {
    router.push(`/fundlists/${ticker}`);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  // Aparência responsiva do Clerk
  const userButtonAppearance = {
    elements: {
      avatarBox: "h-8 w-8",
      userButtonTrigger: "focus:shadow-none hover:opacity-80",
      userButtonPopoverCard: "lg:relative lg:top-auto lg:left-auto lg:transform-none lg:!w-[240px] !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[90%] !max-w-[360px] !z-[100] shadow-lg border border-gray-100",
      userButtonPopoverActions: "p-2 flex flex-col gap-1",
      userButtonPopoverActionButton: "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors",
      userButtonPopoverActionButtonText: "text-gray-700",
      userButtonPopoverActionButtonIcon: "w-4 h-4 text-gray-700",
    },
  };

  const handleRestrictedLink = (
    e: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (!isSignedIn) {
      e.preventDefault();

      if (path === "/dashboard" || path === "/reports") {
        toast.error(
          "Você deve logar e assinar o plano para acessar esta funcionalidade.",
        );
      } else {
        toast.error("Faça login para acessar esta página");
      }
    }
    setIsOpen(false);
  };

  const handleMouseEnter = (menu: string) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const NavLinks = () => (
    <>
      <div className="flex items-center gap-6">
        {Object.entries(menuItems).map(([menu, items]) => (
          <div
            key={menu}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(menu)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:text-gray-300">
              {menu === "Research" && <BookOpen className="h-4 w-4" />}
              {menu === "Produtos" && <Package className="h-4 w-4" />}
              {menu === "Dados de Mercado" && <TrendingUp className="h-4 w-4" />}
              {menu === "Fundos" && <Building2 className="h-4 w-4" />}
              {menu === "Ferramentas" && <Wrench className="h-4 w-4" />}
              {menu === "Gratuito" && <GraduationCap className="h-4 w-4" />}
              {menu}
              <ChevronDown className="h-4 w-4" />
            </button>

            {activeDropdown === menu && (
              <div className="absolute left-0 top-[calc(100%-4px)] z-50 w-56 rounded-md bg-[#1c1f26] border border-[#0d2b50] shadow-lg">
                <div className="py-2 max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
                  {items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleRestrictedLink(e, item.href)}
                      className={cn(
                        "block px-4 py-2 text-sm text-white hover:bg-[#2a2f3a] transition-colors",
                        {
                          "opacity-50 cursor-not-allowed": item.soon,
                          "relative": item.beta || item.new,
                        }
                      )}
                    >
                      <span className="flex items-center justify-between">
                        {item.label}
                        {item.soon && (
                          <span className="text-xs text-gray-400">Em breve</span>
                        )}
                        {item.beta && (
                          <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">Beta</span>
                        )}
                        {item.new && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">Novo</span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <ShieldCheck className="h-5 w-5" />
          Admin
        </Link>
      )}
    </>
  );

  if (pathname === "/admin/login") return null;

  return (
    <>


      {/* Banner de Aviso Manutenção */}

      {/* <div className="bg-yellow-500 py-2 text-center text-sm font-medium text-white">
        🚧 Site em Manutenção • Algumas funcionalidades estão em desenvolvimento e temporariamente indisponíveis • Site versão 0.1.0 Beta 🚧
      </div> */}

      {/* <div className="bg-blue-500 py-2 text-center text-sm font-medium text-white">
        🚧 Estamos evoluindo! 🚀 Estamos fazendo um upgrade na plataforma para trazer novas funcionalidades e melhorar a experiência do usuário! • Obrigado por acompanhar o Lucas FII Research! Em poucos minutos, tudo estará de volta ao normal! 😉
      </div> */}

      {/* <div className="bg-blue-500 py-2 text-center text-sm font-medium text-white">
        🚧 Estamos fazendo um upgrade na plataforma para trazer novas funcionalidades e melhorar a experiência do usuário! • Em poucos minutos, tudo estará de volta ao normal! 😉
      </div> */}

      {/* Banner de Anúncios */}

      {/* <div className="bg-blue-500 py-2 text-center text-sm font-medium text-white">
        Olá, seja bem-vindo(a) ao Lucas FII Research! 🚀
      </div> */}

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#0d2b50] bg-[#1c1f26]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  width={40}
                  height={40}
                  alt="Logo"
                  className="rounded-full"
                />
                <span className="text-lg font-semibold text-white">Research</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {isSignedIn && (
              <div className="hidden lg:flex lg:items-center lg:space-x-6">
                <NavLinks />
              </div>
            )}

            {/* Menu do Usuário */}
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-3">
                  {/* === Botão Especial Carteira === */}
                  {/* <Link
                    href="/my-wallet"
                    className="hidden lg:flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full bg-[#172039] border border-[#172039] text-white hover:bg-[#1a2547] transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-medium">Carteira</span>
                  </Link> */}

                  {/* === Botão de Busca === */}

                  {/* <button
                    onClick={() => setShowSearchBar(!showSearchBar)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1c1f26] border border-[#192747] text-white hover:bg-[#2a2f3a] transition-all duration-200"
                  >
                    <Search className="h-5 w-5" />
                  </button>  */}

                  {/* <span className="hidden text-sm font-medium text-black-500 md:block">
                  Minha Conta
                </span> */}

                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-4 rounded-full bg-[#1c1f26] px-2 py-1.5 outline-none transition-all duration-200 border border-[#192747] relative">
                        <Menu className="h-6 w-6 text-white" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                        <UserButton
                          appearance={{
                            elements: {
                              avatarBox: "h-8 w-8",
                              userButtonTrigger: "pointer-events-none"
                            }
                          }}
                        />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-64 bg-[#1c1f26] border border-[#0d2b50] rounded-lg shadow-lg py-2 max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar"
                      align="end"
                      sideOffset={8}
                    >
                      <div className="px-4 pb-3">
                        <p className="text-sm font-medium text-white text-center">Minha Conta</p>
                        <p className="text-xs text-gray-400 text-center mt-1">{user?.username || user?.emailAddresses[0].emailAddress.split('@')[0]}</p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            openUserProfile();
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors w-full"
                        >
                          <User className="h-4 w-4" />
                          <span>Gerenciar Conta</span>
                        </button>

                        <DropdownMenuItem className="p-0">
                          <Link
                            href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${user?.emailAddresses[0].emailAddress}`}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors w-full"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Gerenciar Assinatura</span>
                          </Link>
                        </DropdownMenuItem>

                        <Link
                          href="/subscription"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Planos</span>
                        </Link>

                        <DropdownMenuItem className="p-0" onSelect={() => setNotificationDrawerOpen(true)}>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              setNotificationDrawerOpen(true);
                            }}
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors w-full"
                          >
                            <div className="flex items-center gap-3">
                              <Bell className="h-4 w-4" />
                              <span>Notificações</span>
                            </div>
                            {unreadCount > 0 && (
                              <span className="bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                        </DropdownMenuItem>

                        {/* <Link
                        href="/mywallet"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Wallet className="h-4 w-4" />
                        <span>Minha Carteira</span>
                      </Link> */}


                      </div>

                      <div className="border-t border-[#0d2b50] pt-3 px-4 pb-2">
                        <p className="text-sm font-medium text-white text-center">Catálogo</p>
                      </div>

                      {/* <div> */}
                      <div
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors cursor-pointer"
                        onClick={() => setOpenSubmenu(openSubmenu === "Research" ? null : "Research")}
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4" />
                          <span>Research</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${openSubmenu === "Research" ? 'rotate-90' : ''}`} />
                      </div>

                      {openSubmenu === "Research" && (
                        <div className="bg-[#141619]">
                          {menuItems["Research"].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center justify-between px-8 py-2 text-sm text-gray-300 hover:bg-[#2a2f3a] transition-colors"
                              onClick={() => {
                                setDropdownOpen(false);
                                setOpenSubmenu(null);
                              }}
                            >
                              <span>{item.label}</span>
                              {item.soon && (
                                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  Em breve
                                </span>
                              )}
                              {item.new && (
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Novo
                                </span>
                              )}
                              {item.beta && (
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                  Beta
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                      {/* </div> */}

                      {/* <div className="border-t border-[#0d2b50]"> */}
                      <div
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors cursor-pointer"
                        onClick={() => setOpenSubmenu(openSubmenu === "Dados de Mercado" ? null : "Dados de Mercado")}
                      >
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-4 w-4" />
                          <span>Dados de Mercado</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${openSubmenu === "Dados de Mercado" ? 'rotate-90' : ''}`} />
                      </div>

                      {openSubmenu === "Dados de Mercado" && (
                        <div className="bg-[#141619]">
                          {menuItems["Dados de Mercado"].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center justify-between px-8 py-2 text-sm text-gray-300 hover:bg-[#2a2f3a] transition-colors"
                              onClick={() => {
                                setDropdownOpen(false);
                                setOpenSubmenu(null);
                              }}
                            >
                              <span>{item.label}</span>
                              {item.soon && (
                                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  Em breve
                                </span>
                              )}
                              {item.new && (
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Novo
                                </span>
                              )}
                              {item.beta && (
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                  Beta
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                      {/* </div> */}

                      {/* <div className="border-t border-[#0d2b50]">  */}
                      <div
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors cursor-pointer"
                        onClick={() => setOpenSubmenu(openSubmenu === "Fundos" ? null : "Fundos")}
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4" />
                          <span>Fundos</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${openSubmenu === "Fundos" ? 'rotate-90' : ''}`} />
                      </div>

                      {openSubmenu === "Fundos" && (
                        <div className="bg-[#141619]">
                          {menuItems["Fundos"].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center justify-between px-8 py-2 text-sm text-gray-300 hover:bg-[#2a2f3a] transition-colors"
                              onClick={() => {
                                setDropdownOpen(false);
                                setOpenSubmenu(null);
                              }}
                            >
                              <span>{item.label}</span>
                              {item.soon && (
                                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  Em breve
                                </span>
                              )}
                              {item.new && (
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Novo
                                </span>
                              )}
                              {item.beta && (
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                  Beta
                                </span>
                              )}
                            </Link>

                          ))}
                        </div>
                      )}
                      {/* </div>  */}

                      {/* <div className="border-t border-[#0d2b50]"> */}
                      <div
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors cursor-pointer"
                        onClick={() => setOpenSubmenu(openSubmenu === "Produtos" ? null : "Produtos")}
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4" />
                          <span>Produtos</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${openSubmenu === "Produtos" ? 'rotate-90' : ''}`} />
                      </div>

                      {openSubmenu === "Produtos" && (
                        <div className="bg-[#141619]">
                          {menuItems["Produtos"].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center justify-between px-8 py-2 text-sm text-gray-300 hover:bg-[#2a2f3a] transition-colors"
                              onClick={() => {
                                setDropdownOpen(false);
                                setOpenSubmenu(null);
                              }}
                            >
                              <span>{item.label}</span>
                              {item.soon && (
                                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  Em breve
                                </span>
                              )}
                              {item.new && (
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Novo
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                      {/* </div> */}

                      <div
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors cursor-pointer"
                        onClick={() => setOpenSubmenu(openSubmenu === "Ferramentas" ? null : "Ferramentas")}
                      >
                        <div className="flex items-center gap-3">
                          <Wrench className="h-4 w-4" />
                          <span>Ferramentas</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${openSubmenu === "Ferramentas" ? 'rotate-90' : ''}`} />
                      </div>

                      {openSubmenu === "Ferramentas" && (
                        <div className="bg-[#141619]">
                          {menuItems["Ferramentas"].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center justify-between px-8 py-2 text-sm text-gray-300 hover:bg-[#2a2f3a] transition-colors"
                              onClick={() => {
                                setDropdownOpen(false);
                                setOpenSubmenu(null);
                              }}
                            >
                              <span>{item.label}</span>
                              {item.soon && (
                                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  Em breve
                                </span>
                              )}
                              {item.beta && (
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                  Beta
                                </span>
                              )}
                              {item.new && (
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Novo
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* <div className="border-t border-[#0d2b50]"> */}

                      {/* <Link
                        href="/my-wallet"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Wallet className="h-4 w-4" />
                        <span>Minha Carteira</span>
                      </Link> */}

                      {/* <Link
                        href="/educational"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <GraduationCap className="h-4 w-4" />
                        <span>Material Educacional</span>
                      </Link> */}


                      {/* </div>   */}

                      <div className="border-t border-[#0d2b50] pt-3 px-4 pb-2 mt-2">
                        <p className="text-sm font-medium text-white text-center">Mais Opções</p>
                      </div>

                      <div>

                        <Link
                          href="/contact"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Suporte</span>
                        </Link>

                        <Link
                          href="/faq"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>FAQ</span>
                        </Link>

                        <Link
                          href="/userguide"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Users2Icon className="h-4 w-4" />
                          <span>Guia do Usuário</span>
                        </Link>

                        <Link
                          href="/update-schedule"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Clock className="h-4 w-4" />
                          <span>Cronograma</span>
                        </Link>


                        <Link
                          href="/terms"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Termos de Uso</span>
                        </Link>

                        <Link
                          href="/privacy"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2f3a] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>Política de Privacidade</span>
                        </Link>


                      </div>

                      <div className="border-t border-[#0d2b50] py-2 mt-2">
                        <SignOutButton>
                          <button
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[#2a2f3a] transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sair</span>
                          </button>
                        </SignOutButton>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* === Notificações === */}

                  <NotificationDrawer
                    open={notificationDrawerOpen}
                    onOpenChange={setNotificationDrawerOpen}
                    onNotificationsUpdate={refetchNotifications}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="relative text-white overflow-hidden group px-6 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                      <span className="relative flex items-center">
                        <LogInIcon className="h-5 w-5 md:mr-2 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="hidden md:inline">Entrar</span>
                      </span>
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      variant="default"
                      className="relative overflow-hidden group px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-full bg-[url('/sparkles.svg')] bg-repeat-x bg-contain animate-slide"></div>
                      </span>
                      <span className="relative flex items-center">
                        <User className="h-5 w-5 md:mr-2 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="hidden md:inline">Cadastrar</span>
                      </span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Barra de Pesquisa */}
      {showSearchBar && (
        <div className="search-container fixed top-16 left-0 right-0 z-40 bg-gradient-to-br from-[#1c1f26]/95 to-[#0d2b50]/95 backdrop-blur-xl border-b border-[#0d2b50]/50 shadow-2xl">
          <div className="mx-auto max-w-4xl px-6 py-6">
            <div className="relative group">
              {/* Ícone de busca com animação */}
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-all duration-300 group-focus-within:scale-110" />
              </div>

              {/* Input principal com gradiente e efeitos */}
              <Input
                type="text"
                placeholder="Pesquise pelo ativo desejado..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim()) {
                    setShowSearchResults(true);
                  } else {
                    setShowSearchResults(false);
                  }
                }}
                className="pl-14 pr-12 py-4 bg-gradient-to-r from-[#2a2f3a]/80 to-[#1c1f26]/80 border-2 border-[#0d2b50]/50 text-white placeholder-gray-400 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all duration-300 shadow-lg backdrop-blur-sm text-lg font-medium"
                autoFocus
              />

              {/* Botão de limpar com animação */}
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 group"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Efeito de brilho no foco */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            {/* Resultados da Busca */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-6 max-h-96 overflow-y-auto bg-gradient-to-br from-[#2a2f3a]/90 to-[#1c1f26]/90 backdrop-blur-xl rounded-2xl border border-[#0d2b50]/50 shadow-2xl">
                <div className="p-2">
                  {searchResults.map((fii, index) => (
                    <div
                      key={fii.ticker}
                      onClick={() => {
                        navigateToFII(fii.ticker);
                        setShowSearchBar(false);
                        setSearchTerm("");
                        setShowSearchResults(false);
                      }}
                      className="group flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 cursor-pointer rounded-xl border border-transparent hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      {/* Ícone com gradiente animado */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-600/20 rounded-xl border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-blue-300 font-bold text-lg group-hover:text-blue-200 transition-colors">{fii.ticker.charAt(0)}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Informações do FII */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors truncate">{fii.ticker}</p>
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                                FII
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">{fii.name}</p>
                          </div>

                          {/* Valores financeiros */}
                          <div className="text-right ml-4">
                            <p className="font-bold text-white text-lg group-hover:text-green-300 transition-colors">{formatCurrency(fii.price)}</p>
                            <p className="text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">{formatPercent(fii.dividendYield)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Seta indicativa */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estado de carregamento */}
            {isSearching && (
              <div className="mt-6 flex items-center justify-center p-8 bg-gradient-to-br from-[#2a2f3a]/90 to-[#1c1f26]/90 backdrop-blur-xl rounded-2xl border border-[#0d2b50]/50 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500/20 border-t-blue-400"></div>
                    <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full border-2 border-blue-400/30"></div>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-300 font-medium">Buscando ativos...</span>
                    <div className="flex gap-1 mt-2 justify-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remover o overlay escuro */}
      <style jsx global>{`
        [data-overlay-ref="overlay"] {
          display: none !important;
        }
        .fixed.inset-0.z-50.bg-background\/80.backdrop-blur-sm.data-\[state\=open\]\:animate-in.data-\[state\=closed\]\:animate-out.data-\[state\=closed\]\:fade-out-0.data-\[state\=open\]\:fade-in-0 {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;
