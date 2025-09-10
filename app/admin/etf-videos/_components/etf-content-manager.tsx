"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

type EtfItem = {
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
};

interface EtfContentManagerProps {
  onEdit: (item: EtfItem) => void;
  activeTab: "pdf" | "video";
  filterByType?: "pdf" | "video";
}

const EtfContentManager = ({ onEdit, activeTab, filterByType }: EtfContentManagerProps) => {
  const [items, setItems] = useState<EtfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "pdf" | "video">(filterByType || "all");

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (filterByType) {
      setFilterType(filterByType);
    }
  }, [filterByType]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Buscar PDFs e vídeos separadamente
      const [pdfsResponse, videosResponse] = await Promise.all([
        fetch("/api/etf-pdfs"),
        fetch("/api/etf-videos")
      ]);

      const pdfsData = pdfsResponse.ok ? await pdfsResponse.json() : { pdfs: [] };
      const videosData = videosResponse.ok ? await videosResponse.json() : { videos: [] };

      // Transformar os dados para o formato esperado
      const allItems = [
        ...(pdfsData.pdfs || []).map((pdf: any) => ({
          id: pdf._id,
          title: pdf.title,
          description: pdf.description,
          author: pdf.author || "Lucas FII",
          date: pdf.date || new Date(pdf.createdAt).toISOString().split('T')[0],
          time: pdf.time || new Date(pdf.createdAt).toLocaleTimeString("pt-BR"),
          code: pdf.code || "N/D",
          type: "pdf",
          thumbnail: pdf.thumbnail || "",
          premium: pdf.premium || false,
          tags: pdf.tags || [],
          month: pdf.month || "",
          year: pdf.year || "",
          url: pdf.fileUrl || pdf.url || "",
          pageCount: pdf.pageCount || 1,
          createdAt: pdf.createdAt
        })),
        ...(videosData.videos || []).map((video: any) => ({
          id: video._id,
          title: video.title,
          description: video.description,
          author: video.author || "Lucas FII",
          date: video.date || new Date(video.createdAt).toISOString().split('T')[0],
          time: video.time || new Date(video.createdAt).toLocaleTimeString("pt-BR"),
          code: video.code || "N/D",
          type: "video",
          thumbnail: video.thumbnail || "",
          premium: video.premium || false,
          tags: video.tags || [],
          month: video.month || "",
          year: video.year || "",
          videoId: video.videoId || "",
          url: video.url || "",
          createdAt: video.createdAt
        }))
      ];

      setItems(allItems);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      toast.error("Erro ao carregar itens");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const apiUrl = type === "pdf" ? "/api/etf-pdfs" : "/api/etf-videos";
      const response = await fetch(`${apiUrl}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir item");

      await fetchItems();
      toast.success("Item excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      toast.error("Erro ao excluir item");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-6">
        <div className="flex items-center gap-2 xs:gap-3">
          <div className="p-2 xs:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
            Gerenciar {filterByType === "pdf" ? "PDFs" : filterByType === "video" ? "Vídeos" : "Conteúdo"}
          </h3>
        </div>
        <div className="flex items-center gap-2 xs:gap-3">
          <button
            onClick={fetchItems}
            className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-white transition-all duration-200"
          >
            <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden xs:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-3 xs:mb-4 sm:mb-6 space-y-2 xs:space-y-3 sm:space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 xs:pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 xs:h-5 xs:w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 xs:pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 text-xs xs:text-sm h-8 xs:h-10 focus:ring-2 focus:ring-white/30 focus:border-transparent w-full rounded-lg"
          />
        </div>
        
        {!filterByType && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "pdf" | "video")}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-sm h-10 focus:ring-2 focus:ring-white/30 focus:border-transparent rounded-lg px-3"
            >
              <option value="all">Todos os tipos</option>
              <option value="pdf">Apenas PDFs</option>
              <option value="video">Apenas Vídeos</option>
            </select>
          </div>
        )}
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-4 sm:p-6">
            <svg className="h-8 w-8 sm:h-12 sm:w-12 text-white/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-white/80 text-sm sm:text-base">
              {searchTerm ? "Nenhum item encontrado" : "Nenhum item cadastrado"}
            </p>
            <p className="text-white/50 text-xs sm:text-sm mt-1">
              {searchTerm ? "Tente ajustar os filtros de busca" : "Adicione o primeiro item para começar"}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/10 backdrop-blur-sm">
                <tr>
                  <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden xs:table-cell">
                    Tipo
                  </th>
                  <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                    Data
                  </th>
                  <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
            <tbody className="divide-y divide-white/10">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-2 xs:px-3 sm:px-6 py-3 xs:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12">
                        {item.thumbnail ? (
                          <img
                            className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-lg object-cover border border-white/20"
                            src={item.thumbnail}
                            alt={item.title}
                          />
                        ) : (
                          <div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            {item.type === "pdf" ? (
                              <svg className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 xs:ml-3 sm:ml-4 min-w-0 flex-1">
                        <div className="text-xs xs:text-sm sm:text-base font-medium text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-white/60 truncate">
                          {item.description}
                        </div>
                        <div className="xs:hidden mt-1">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            item.type === "pdf" 
                              ? "bg-blue-500/20 text-blue-200 border border-blue-400/30" 
                              : "bg-red-500/20 text-red-200 border border-red-400/30"
                          }`}>
                            {item.type === "pdf" ? "PDF" : "Vídeo"}
                          </span>
                          <span className="text-xs text-white/60 ml-2">
                            {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 xs:px-3 sm:px-6 py-3 xs:py-4 whitespace-nowrap hidden xs:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === "pdf" 
                        ? "bg-blue-500/20 text-blue-200 border border-blue-400/30" 
                        : "bg-red-500/20 text-red-200 border border-red-400/30"
                    }`}>
                      {item.type === "pdf" ? "PDF" : "Vídeo"}
                    </span>
                  </td>
                  <td className="px-2 xs:px-3 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-white/60 hidden sm:table-cell">
                    {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-2 xs:px-3 sm:px-6 py-3 xs:py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 xs:gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 border border-transparent text-xs font-medium rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white transition-all duration-200"
                      >
                        <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden xs:inline ml-1">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.type)}
                        className="inline-flex items-center px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 border border-transparent text-xs font-medium rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white transition-all duration-200"
                      >
                        <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden xs:inline ml-1">Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
};

export default EtfContentManager;
