"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FileText, User, Calendar, Download, ChevronDown, ChevronRight, Search, CalendarRange, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/_components/ui/select";
import { Input } from "@/app/_components/ui/input";

interface Report {
  id: string;
  title: string;
  description: string | null;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  month: string;
  year: string;
  videoId?: string | null;
  url?: string | null;
  pageCount?: number | null;
  dividendYield?: string | null;
  price?: string | null;
  createdAt: string;
}

interface ContentManagerProps {
  activeTab: "pdf" | "video";
  onEdit: (item: Report) => void;
  onSetAddMode: () => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  activeTab,
  onEdit,
  onSetAddMode,
}) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterRecent, setFilterRecent] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const months = [
    { value: "all", label: "Todos os meses" },
    { value: "Janeiro", label: "Janeiro" },
    { value: "Fevereiro", label: "Fevereiro" },
    { value: "Março", label: "Março" },
    { value: "Abril", label: "Abril" },
    { value: "Maio", label: "Maio" },
    { value: "Junho", label: "Junho" },
    { value: "Julho", label: "Julho" },
    { value: "Agosto", label: "Agosto" },
    { value: "Setembro", label: "Setembro" },
    { value: "Outubro", label: "Outubro" },
    { value: "Novembro", label: "Novembro" },
    { value: "Dezembro", label: "Dezembro" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: "all", label: "Todos os anos" },
    ...Array.from({ length: currentYear - 2019 }, (_, i) => ({
      value: String(2020 + i),
      label: String(2020 + i),
    })),
  ];

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = activeTab === "pdf" ? "/api/reports/pdfs" : "/api/reports/videos";
      
      console.log(`Buscando ${activeTab === "pdf" ? "PDFs" : "vídeos"} em: ${url}`);
      
      const timestamp = new Date().getTime();
      const requestUrl = `${url}?t=${timestamp}`;
      
      const response = await fetch(requestUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Falha ao carregar itens: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Dados recebidos (${activeTab}):`, data);
      
      if (Array.isArray(data)) {
        setItems(data.map((item: Report) => ({
          ...item,
          type: item.type || (activeTab === "pdf" ? "pdf" : "video")
        })));
        console.log(`${data.length} itens encontrados`);
      } else if (Array.isArray(data.videos)) {
        setItems(data.videos.map((item: Report) => ({
          ...item,
          type: item.type || "video"
        })));
        console.log(`${data.videos.length} vídeos encontrados`);
      } else {
        console.error("Formato de resposta inesperado:", data);
        setItems([]);
      }
    } catch (error) {
      console.error(`Erro ao buscar ${activeTab}:`, error);
      setError(error instanceof Error ? error.message : "Erro ao carregar itens");
      toast.error(`Erro ao carregar ${activeTab === "pdf" ? "PDFs" : "vídeos"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const filteredItems = items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => filterMonth === "all" || item.month === filterMonth)
    .filter((item) => filterYear === "all" || item.year === filterYear)
    .filter((item) => {
      if (!filterRecent) return true;
      const itemDate = new Date(item.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return itemDate >= sevenDaysAgo;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(id));

    try {
      const url =
        activeTab === "pdf"
          ? `/api/reports/pdfs/${id}`
          : `/api/reports/videos/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Este item já foi excluído anteriormente", {
            duration: 4000,
            icon: "❌",
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          });
          
          setItems(current => current.filter(item => item.id !== id));
          await fetchItems();
          return;
        }
        throw new Error("Falha ao excluir item");
      }

      setItems(current => current.filter(item => item.id !== id));

      await fetchItems();

      toast.success(
        `${activeTab === "pdf" ? "PDF" : "Vídeo"} excluído com sucesso!`,
        {
          duration: 4000,
          icon: activeTab === "pdf" ? "📄" : "🎥",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
        },
      );
    } catch (error) {
      console.error(
        `Erro ao excluir ${activeTab === "pdf" ? "PDF" : "vídeo"}:`,
        error,
      );
      toast.error(
        `Ocorreu um erro ao tentar excluir o ${
          activeTab === "pdf" ? "PDF" : "vídeo"
        }. Tente novamente.`,
        {
          duration: 4000,
          icon: "❌",
          style: {
            background: "#ef4444",
            color: "#fff",
          },
        },
      );
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleYearChange = (value: string) => {
    setFilterYear(value);
  };

  const handleMonthChange = (value: string) => {
    setFilterMonth(value);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as "newest" | "oldest");
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            {activeTab === "pdf" ? (
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            Gerenciar {activeTab === "pdf" ? "PDFs" : "Vídeos"}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => fetchItems()}
            className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 px-3 sm:px-4 py-2 text-sm font-medium text-white transition-all duration-200 w-full sm:w-auto"
          >
            <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
          <button
            onClick={onSetAddMode}
            className="inline-flex items-center justify-center rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 px-3 sm:px-4 py-2 text-sm font-medium text-white transition-all duration-200 w-full sm:w-auto"
          >
            <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo {activeTab === "pdf" ? "PDF" : "Vídeo"}
          </button>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="text-xs sm:text-sm text-white/60 italic">
          Ordenado por data (mais recente primeiro)
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/60" />
          <Input
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 text-sm h-10 focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <Select value={filterYear} onValueChange={handleYearChange}>
            <SelectTrigger className="h-10 bg-white/10 backdrop-blur-sm border-white/20 text-white text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20">
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value} className="text-gray-800 hover:bg-white/80">
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-10 bg-white/10 backdrop-blur-sm border-white/20 text-white text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20">
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value} className="text-gray-800 hover:bg-white/80">
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="h-10 bg-white/10 backdrop-blur-sm border-white/20 text-white text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20">
              <SelectItem value="newest" className="text-gray-800 hover:bg-white/80">Mais recentes</SelectItem>
              <SelectItem value="oldest" className="text-gray-800 hover:bg-white/80">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/10 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-white">
                Conteúdo
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-white">
                Autor
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-white">
                Data
              </th>
              <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-white">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-sm sm:text-base text-white/70">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Carregando...
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center">
                        {activeTab === "pdf" ? (
                          <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-white/40 mb-3" />
                        ) : (
                          <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                        <p className="text-white/80">Nenhum {activeTab === "pdf" ? "PDF" : "vídeo"} encontrado</p>
                        <p className="text-xs sm:text-sm text-white/50 mt-1">Tente ajustar os filtros de busca</p>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover border border-white/20"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            {activeTab === "pdf" ? (
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
                            ) : (
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-white truncate">{item.title}</p>
                        <div className="mt-1 sm:hidden text-xs text-white/60 space-y-1">
                          <p className="flex items-center">
                            <User className="inline h-3 w-3 mr-1.5" />
                            {item.author}
                          </p>
                          <p className="flex items-center">
                            <Calendar className="inline h-3 w-3 mr-1.5" />
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 py-3 text-sm text-white/70">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-white/50 mr-2" />
                      {item.author}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 py-3 text-sm text-white/70">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-white/50 mr-2" />
                      {formatDate(item.createdAt)}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 px-2 sm:px-3 py-1.5 text-xs font-medium text-white transition-all duration-200"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden xs:inline ml-1">Editar</span>
                      </button>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 hover:border-purple-400/50 px-2 sm:px-3 py-1.5 text-xs font-medium text-white transition-all duration-200"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline ml-1">Download</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingIds.has(item.id)}
                        className="inline-flex items-center rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 px-2 sm:px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Excluir"
                      >
                        {deletingIds.has(item.id) ? (
                          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        <span className="hidden xs:inline ml-1">Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
