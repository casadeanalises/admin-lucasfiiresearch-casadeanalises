"use client";

import { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Edit2, Trash2, X } from "lucide-react";
import EtfContentManager from "./_components/etf-content-manager";

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

interface EtfAdminClientProps {
  adminEmail: string;
  initialSection?: "add" | "manage";
  initialTab?: "pdf" | "video";
}

const EtfAdminClient = ({
  adminEmail,
  initialSection = "add",
  initialTab = "pdf",
}: EtfAdminClientProps) => {
  const [activeTab, setActiveTab] = useState<"pdf" | "video">(initialTab);
  const [activeSection, setActiveSection] = useState<"add" | "manage">(
    initialSection,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [editingItem, setEditingItem] = useState<EtfItem | null>(null);

  const [etfData, setEtfData] = useState<Partial<EtfItem>>({
    title: "",
    description: "",
    author: "Lucas FII",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "pdf",
    premium: false,
    tags: [],
    pageCount: 1,
  });

  const [videoData, setVideoData] = useState<Partial<EtfItem>>({
    title: "",
    description: "",
    author: "Lucas FII",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "video",
    premium: false,
    tags: [],
    videoId: "",
    url: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [videoTagInput, setVideoTagInput] = useState("");
  const [selectedItem, setSelectedItem] = useState<EtfItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function obterMesAtual(monthIndex?: number) {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return monthIndex !== undefined ? meses[monthIndex] : meses[new Date().getMonth()];
  }


  const addTag = (tag: string, isVideo: boolean = false) => {
    if (tag.trim()) {
      if (isVideo) {
        setVideoData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tag.trim()]
        }));
        setVideoTagInput("");
      } else {
        setEtfData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tag.trim()]
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (index: number, isVideo: boolean = false) => {
    if (isVideo) {
      setVideoData(prev => ({
        ...prev,
        tags: prev.tags?.filter((_, i) => i !== index) || []
      }));
    } else {
      setEtfData(prev => ({
        ...prev,
        tags: prev.tags?.filter((_, i) => i !== index) || []
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentData = activeTab === "pdf" ? etfData : videoData;
      const apiUrl = activeTab === "pdf" ? "/api/etf-pdfs" : "/api/etf-videos";

      // Preparar dados para envio
      const dataToSend = activeTab === "pdf" ? {
        title: currentData.title,
        description: currentData.description,
        author: currentData.author || "Lucas FII",
        date: currentData.date || new Date().toISOString().split('T')[0],
        time: currentData.time || new Date().toLocaleTimeString("pt-BR"),
        code: currentData.code || "N/D",
        type: activeTab,
        premium: currentData.premium || false,
        tags: currentData.tags || [],
        pageCount: currentData.pageCount || 1,
        fileUrl: currentData.url 
      } : {
        title: currentData.title,
        description: currentData.description,
        videoId: currentData.videoId,
        pdfUrl: currentData.url || null
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar item");
      }

      toast.success(`${activeTab === "pdf" ? "PDF" : "Vídeo"} salvo com sucesso!`);
      
      // Reset form
      if (activeTab === "pdf") {
        setEtfData({
          title: "",
          description: "",
          author: "Lucas FII",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString("pt-BR"),
          code: "N/D",
          type: "pdf",
          premium: false,
          tags: [],
          pageCount: 1,
          url: "",
        });
        setTagInput("");
      } else {
        setVideoData({
          title: "",
          description: "",
          author: "Lucas FII",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString("pt-BR"),
          code: "N/D",
          type: "video",
          premium: false,
          tags: [],
          videoId: "",
          url: "",
        });
        setVideoTagInput("");
      }

    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsLoading(true);

    try {
      const currentData = activeTab === "pdf" ? etfData : videoData;
      const apiUrl = activeTab === "pdf" ? "/api/etf-pdfs" : "/api/etf-videos";

      // Preparar dados para envio
      const dataToSend = activeTab === "pdf" ? {
        _id: editingItem.id,
        title: currentData.title,
        description: currentData.description,
        author: currentData.author || "Lucas FII",
        date: currentData.date || new Date().toISOString().split('T')[0],
        time: currentData.time || new Date().toLocaleTimeString("pt-BR"),
        code: currentData.code || "N/D",
        type: activeTab,
        premium: currentData.premium || false,
        tags: currentData.tags || [],
        pageCount: currentData.pageCount || 1,
        fileUrl: currentData.url 
      } : {
        id: editingItem.id,
        title: currentData.title,
        description: currentData.description,
        videoId: currentData.videoId,
        pdfUrl: currentData.url || null
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar item");
      }

      toast.success(`${activeTab === "pdf" ? "PDF" : "Vídeo"} atualizado com sucesso!`);
      setEditingItem(null);
      
      // Reset form
      if (activeTab === "pdf") {
        setEtfData({
          title: "",
          description: "",
          author: "Lucas FII",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString("pt-BR"),
          code: "N/D",
          type: "pdf",
          premium: false,
          tags: [],
          pageCount: 1,
          url: "",
        });
        setTagInput("");
      } else {
        setVideoData({
          title: "",
          description: "",
          author: "Lucas FII",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString("pt-BR"),
          code: "N/D",
          type: "video",
          premium: false,
          tags: [],
          videoId: "",
          url: "",
        });
        setVideoTagInput("");
      }

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: EtfItem) => {
    setEditingItem(item);
    setActiveTab(item.type as "pdf" | "video");
    setActiveSection("add");
    
    if (item.type === "pdf") {
      setEtfData({
        title: item.title,
        description: item.description || "",
        author: item.author,
        date: item.date,
        time: item.time,
        code: item.code,
        type: "pdf",
        premium: item.premium,
        tags: item.tags || [],
        pageCount: item.pageCount || 1,
        url: item.url || "",
      });
    } else {
      setVideoData({
        title: item.title,
        description: item.description || "",
        author: item.author,
        date: item.date,
        time: item.time,
        code: item.code,
        type: "video",
        premium: item.premium,
        tags: item.tags || [],
        videoId: item.videoId || "",
        url: item.url || "",
      });
    }
  };

  // Handle modal
  const openModal = (item: EtfItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Tabs Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 mb-6">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "pdf"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "video"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Vídeo</span>
            <span className="sm:hidden">Vídeo</span>
          </button>
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveSection("add")}
          className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg font-medium transition-all duration-200 text-sm xs:text-base ${
            activeSection === "add"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <span className="block xs:hidden">{activeTab === "pdf" ? "Adicionar PDF" : "Adicionar Vídeo"}</span>
          <span className="hidden xs:block">{activeTab === "pdf" ? "Adicionar PDF" : "Adicionar Vídeo"}</span>
        </button>
        <button
          onClick={() => setActiveSection("manage")}
          className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg font-medium transition-all duration-200 text-sm xs:text-base ${
            activeSection === "manage"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <span className="block xs:hidden">Gerenciar</span>
          <span className="hidden xs:block">Gerenciar Existentes</span>
        </button>
      </div>

      {/* Content */}
      {activeSection === "add" ? (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4 mb-4 sm:mb-6">
            <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
              {editingItem ? `Editar ${activeTab === "pdf" ? "PDF" : "Vídeo"}` : `Novo ${activeTab === "pdf" ? "PDF" : "Vídeo"}`}
            </h3>
            {editingItem && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  if (activeTab === "pdf") {
                    setEtfData({
                      title: "",
                      description: "",
                      author: "Lucas FII",
                      date: new Date().toISOString().split('T')[0],
                      time: new Date().toLocaleTimeString("pt-BR"),
                      code: "N/D",
                      type: "pdf",
                      premium: false,
                      tags: [],
                      pageCount: 1,
          url: "",
                    });
                    setTagInput("");
                  } else {
                    setVideoData({
                      title: "",
                      description: "",
                      author: "Lucas FII",
                      date: new Date().toISOString().split('T')[0],
                      time: new Date().toLocaleTimeString("pt-BR"),
                      code: "N/D",
                      type: "video",
                      premium: false,
                      tags: [],
                      videoId: "",
                      url: "",
                    });
                    setVideoTagInput("");
                  }
                }}
                className="bg-white/10 px-3 py-1.5 text-xs xs:text-sm font-medium text-white hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 w-full xs:w-auto"
              >
                <span className="block xs:hidden">Novo {activeTab === "pdf" ? "PDF" : "Vídeo"}</span>
                <span className="hidden xs:block">Novo {activeTab === "pdf" ? "PDF" : "Vídeo"}</span>
              </button>
            )}
          </div>

          {editingItem && (
            <div className="bg-blue-500/20 border border-blue-400/30 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-blue-200 text-sm sm:text-base">
                Você está editando: <strong>{editingItem.title}</strong>
              </p>
            </div>
          )}

          <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="space-y-3 xs:space-y-4 sm:space-y-6">
            {/* Título */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Título *
              </label>
              <input
                type="text"
                value={activeTab === "pdf" ? etfData.title || "" : videoData.title || ""}
                onChange={(e) => {
                  if (activeTab === "pdf") {
                    setEtfData(prev => ({ ...prev, title: e.target.value }));
                  } else {
                    setVideoData(prev => ({ ...prev, title: e.target.value }));
                  }
                }}
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                placeholder={`Digite o título do ${activeTab === "pdf" ? "PDF" : "vídeo"}`}
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Descrição *
              </label>
              <textarea
                value={activeTab === "pdf" ? etfData.description || "" : videoData.description || ""}
                onChange={(e) => {
                  if (activeTab === "pdf") {
                    setEtfData(prev => ({ ...prev, description: e.target.value }));
                  } else {
                    setVideoData(prev => ({ ...prev, description: e.target.value }));
                  }
                }}
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                placeholder={`Digite a descrição do ${activeTab === "pdf" ? "PDF" : "vídeo"}`}
                rows={3}
                required
              />
            </div>

            {/* Campos específicos para PDF */}
            {activeTab === "pdf" && (
              <>
                {/* URL do PDF */}
                <div>
                  <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                    URL do PDF *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={etfData.url || ""}
                      onChange={(e) => setEtfData(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      placeholder="https://exemplo.com/arquivo.pdf"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 xs:w-5 xs:h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Campos específicos para Vídeo */}
            {activeTab === "video" && (
              <>
                {/* YouTube ID */}
                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    ID do YouTube *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={videoData.videoId || ""}
                      onChange={(e) => setVideoData(prev => ({ ...prev, videoId: e.target.value }))}
                      className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      placeholder="Ex: dQw4w9WgXcQ"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* URL do PDF */}
                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    URL do PDF (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={videoData.url || ""}
                      onChange={(e) => setVideoData(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      placeholder="https://exemplo.com/arquivo.pdf"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

              </>
            )}

            {/* Tags */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(activeTab === "pdf" ? etfData.tags : videoData.tags)?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index, activeTab === "video")}
                      className="text-white/70 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeTab === "pdf" ? tagInput : videoTagInput}
                  onChange={(e) => {
                    if (activeTab === "pdf") {
                      setTagInput(e.target.value);
                    } else {
                      setVideoTagInput(e.target.value);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(activeTab === "pdf" ? tagInput : videoTagInput, activeTab === "video");
                    }
                  }}
                  className="flex-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                  placeholder="Digite uma tag e pressione Enter"
                />
                <button
                  type="button"
                  onClick={() => addTag(activeTab === "pdf" ? tagInput : videoTagInput, activeTab === "video")}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-3 xs:pt-4 sm:pt-6">
              <button
                type="button"
                onClick={() => setActiveSection("manage")}
                className="w-full xs:w-auto bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-3 xs:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs xs:text-sm"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full xs:w-auto bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-3 xs:px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 text-xs xs:text-sm"
              >
                {isLoading ? "Salvando..." : editingItem ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <EtfContentManager
          onEdit={handleEdit}
          onOpenModal={openModal}
          activeTab={activeTab}
          filterByType={activeTab}
        />
      )}

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <EtfItemModal
          item={selectedItem}
          onClose={closeModal}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default EtfAdminClient;

// Modal Component
interface EtfItemModalProps {
  item: EtfItem;
  onClose: () => void;
  onEdit: (item: EtfItem) => void;
}

function EtfItemModal({ item, onClose, onEdit }: EtfItemModalProps) {
  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const apiUrl = type === "pdf" ? "/api/etf-pdfs" : "/api/etf-videos";
      const response = await fetch(`${apiUrl}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir item");

      toast.success("Item excluído com sucesso!");
      onClose();
      // Recarregar a página para atualizar a lista
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      toast.error("Erro ao excluir item");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Opções do {item.type === "pdf" ? "PDF" : "Vídeo"}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Item Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              {item.type === "pdf" ? (
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">
                {item.title}
              </h4>
              <p className="text-xs text-white/60 truncate">
                {item.description}
              </p>
              <p className="text-xs text-white/50 mt-1">
                Criado em: {new Date(item.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onEdit(item);
              onClose();
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white"
          >
            <Edit2 className="h-4 w-4" />
            <span>Editar {item.type === "pdf" ? "PDF" : "Vídeo"}</span>
          </button>
          
          <button
            onClick={() => handleDelete(item.id, item.type)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white"
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir {item.type === "pdf" ? "PDF" : "Vídeo"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
