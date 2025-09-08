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
    <div className="rounded-lg bg-white p-3 sm:p-4 shadow-md">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold text-blue-800">
          Gerenciar {activeTab === "pdf" ? "PDFs" : "Vídeos"}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => fetchItems()}
            className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100 w-full sm:w-auto"
          >
            <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
          <button
            onClick={onSetAddMode}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 w-full sm:w-auto"
          >
            <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo {activeTab === "pdf" ? "PDF" : "Vídeo"}
          </button>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="text-xs text-gray-500 italic">
          Ordenado por data (mais recente primeiro)
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 bg-white text-gray-800 border-gray-200 text-sm h-9"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Select value={filterYear} onValueChange={handleYearChange}>
            <SelectTrigger className="h-9 bg-white text-gray-800 border-gray-200 text-sm">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-9 bg-white text-gray-800 border-gray-200 text-sm">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="h-9 bg-white text-gray-800 border-gray-200 text-sm">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                Conteúdo
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500">
                Autor
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500">
                Data
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
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
                        <FileText className="h-8 w-8 text-gray-400 mb-2" />
                        <p>Nenhum {activeTab === "pdf" ? "PDF" : "vídeo"} encontrado</p>
                        <p className="text-xs text-gray-400 mt-1">Tente ajustar os filtros de busca</p>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-8 h-8">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <div className="mt-0.5 sm:hidden text-xs text-gray-500 space-y-0.5">
                          <p className="flex items-center">
                            <User className="inline h-3 w-3 mr-1" />
                            {item.author}
                          </p>
                          <p className="flex items-center">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      {item.author}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      {formatDate(item.createdAt)}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingIds.has(item.id)}
                        className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingIds.has(item.id) ? (
                          <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
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
