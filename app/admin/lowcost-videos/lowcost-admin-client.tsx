"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { FileText, Video, Search, Plus, Edit2, Trash2, Loader2, RefreshCw, X } from "lucide-react";

interface LowcostItem {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  premium: boolean;
  tags: string[];
  videoId?: string;
  url?: string;
  pdfUrl?: string;
  fileUrl?: string;
  createdAt: string;
}

interface LowcostData {
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  premium: boolean;
  tags: string[];
  videoId?: string;
  url?: string;
  pdfUrl?: string;
}

interface LowcostAdminClientProps {
  adminEmail: string;
}

export default function LowcostAdminClient({ adminEmail }: LowcostAdminClientProps) {
  const [activeTab, setActiveTab] = useState<"pdf" | "video">("pdf");
  const [activeSection, setActiveSection] = useState<"add" | "manage">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<LowcostItem | null>(null);
  
  const [pdfData, setPdfData] = useState<LowcostData>({
    title: "",
    description: "",
    author: "Lucas FII",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "pdf",
    premium: false,
    tags: [],
    pdfUrl: "",
  });

  const [videoData, setVideoData] = useState<LowcostData>({
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

  const addTag = (tag: string, isVideo: boolean = false) => {
    if (tag.trim()) {
      if (isVideo) {
        setVideoData(prev => ({
          ...prev,
          tags: [...prev.tags, tag.trim()]
        }));
        setVideoTagInput("");
      } else {
        setPdfData(prev => ({
          ...prev,
          tags: [...prev.tags, tag.trim()]
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (index: number, isVideo: boolean = false) => {
    if (isVideo) {
      setVideoData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index)
      }));
    } else {
      setPdfData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = activeTab === "pdf" ? "/api/lowcost-pdfs" : "/api/lowcost-videos";
      let dataToSend;

      if (activeTab === "pdf") {
        dataToSend = {
          title: pdfData.title,
          description: pdfData.description,
          fileUrl: pdfData.pdfUrl,
        };
      } else {
        dataToSend = {
          title: videoData.title,
          description: videoData.description,
          videoId: videoData.videoId,
          pdfUrl: videoData.url,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(`${activeTab === "pdf" ? "PDF" : "Vídeo"} criado com sucesso!`);
        // Reset form
        if (activeTab === "pdf") {
          setPdfData({
            title: "",
            description: "",
            author: "Lucas FII",
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString("pt-BR"),
            code: "N/D",
            type: "pdf",
            premium: false,
            tags: [],
            pdfUrl: "",
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
      } else {
        toast.error(`Erro ao criar ${activeTab === "pdf" ? "PDF" : "vídeo"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error(`Erro ao criar ${activeTab === "pdf" ? "PDF" : "vídeo"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsLoading(true);

    try {
      const endpoint = activeTab === "pdf" ? "/api/lowcost-pdfs" : "/api/lowcost-videos";
      let dataToSend;

      if (activeTab === "pdf") {
        dataToSend = {
          id: editingItem.id,
          title: pdfData.title,
          description: pdfData.description,
          fileUrl: pdfData.pdfUrl,
        };
      } else {
        dataToSend = {
          id: editingItem.id,
          title: videoData.title,
          description: videoData.description,
          videoId: videoData.videoId,
          pdfUrl: videoData.url,
        };
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(`${activeTab === "pdf" ? "PDF" : "Vídeo"} atualizado com sucesso!`);
        setEditingItem(null);
        // Reset form
        if (activeTab === "pdf") {
          setPdfData({
            title: "",
            description: "",
            author: "Lucas FII",
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString("pt-BR"),
            code: "N/D",
            type: "pdf",
            premium: false,
            tags: [],
            pdfUrl: "",
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
      } else {
        toast.error(`Erro ao atualizar ${activeTab === "pdf" ? "PDF" : "vídeo"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error(`Erro ao atualizar ${activeTab === "pdf" ? "PDF" : "vídeo"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: LowcostItem) => {
    setEditingItem(item);
    setActiveTab(item.type as "pdf" | "video");
    setActiveSection("add");
    
    if (item.type === "pdf") {
      setPdfData({
        title: item.title,
        description: item.description || "",
        author: item.author || "Lucas FII",
        date: item.date || new Date().toISOString().split('T')[0],
        time: item.time || new Date().toLocaleTimeString("pt-BR"),
        code: item.code || "N/D",
        type: "pdf",
        premium: item.premium || false,
        tags: item.tags || [],
        pdfUrl: item.pdfUrl || item.fileUrl || "",
      });
    } else {
      setVideoData({
        title: item.title,
        description: item.description || "",
        author: item.author || "Lucas FII",
        date: item.date || new Date().toISOString().split('T')[0],
        time: item.time || new Date().toLocaleTimeString("pt-BR"),
        code: item.code || "N/D",
        type: "video",
        premium: item.premium || false,
        tags: item.tags || [],
        videoId: item.videoId || "",
        url: item.url || item.pdfUrl || "",
      });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Tabs Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 mb-4 sm:mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg font-medium transition-all duration-200 text-sm xs:text-base ${
              activeTab === "pdf"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg font-medium transition-all duration-200 text-sm xs:text-base ${
              activeTab === "video"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Video className="h-4 w-4" />
              <span>Vídeo</span>
            </div>
          </button>
        </div>
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
          <span className="block xs:hidden">Adicionar {activeTab === "pdf" ? "PDF" : "Vídeo"}</span>
          <span className="hidden xs:block">Adicionar {activeTab === "pdf" ? "PDF" : "Vídeo"}</span>
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

      {/* Add Section */}
      {activeSection === "add" && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                {activeTab === "pdf" ? (
                  <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Video className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
                {editingItem ? `Editar ${activeTab === "pdf" ? "PDF" : "Vídeo"}` : `Novo ${activeTab === "pdf" ? "PDF" : "Vídeo"}`}
              </h3>
            </div>
            {editingItem && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  if (activeTab === "pdf") {
                    setPdfData({
                      title: "",
                      description: "",
                      author: "Lucas FII",
                      date: new Date().toISOString().split('T')[0],
                      time: new Date().toLocaleTimeString("pt-BR"),
                      code: "N/D",
                      type: "pdf",
                      premium: false,
                      tags: [],
                      pdfUrl: "",
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

          <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Título */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Título *
              </label>
              <input
                type="text"
                value={activeTab === "pdf" ? pdfData.title : videoData.title}
                onChange={(e) => {
                  if (activeTab === "pdf") {
                    setPdfData(prev => ({ ...prev, title: e.target.value }));
                  } else {
                    setVideoData(prev => ({ ...prev, title: e.target.value }));
                  }
                }}
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                placeholder={`Digite o título do ${activeTab === "pdf" ? "PDF" : "vídeo"}`}
                required
                style={{ color: 'white' }}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Descrição *
              </label>
              <textarea
                value={activeTab === "pdf" ? pdfData.description : videoData.description}
                onChange={(e) => {
                  if (activeTab === "pdf") {
                    setPdfData(prev => ({ ...prev, description: e.target.value }));
                  } else {
                    setVideoData(prev => ({ ...prev, description: e.target.value }));
                  }
                }}
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none resize-none"
                placeholder={`Digite a descrição do ${activeTab === "pdf" ? "PDF" : "vídeo"}`}
                rows={3}
                required
                style={{ color: 'white' }}
              />
            </div>

            {/* Campos específicos para PDF */}
            {activeTab === "pdf" && (
              <div>
                <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                  URL do PDF *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={pdfData.pdfUrl || ""}
                    onChange={(e) => setPdfData(prev => ({ ...prev, pdfUrl: e.target.value }))}
                    className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                    placeholder="https://exemplo.com/arquivo.pdf"
                    required
                    style={{ color: 'white' }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FileText className="w-4 h-4 xs:w-5 xs:h-5 text-white/50" />
                  </div>
                </div>
              </div>
            )}

            {/* Campos específicos para Vídeo */}
            {activeTab === "video" && (
              <>
                <div>
                  <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                    ID do YouTube *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={videoData.videoId || ""}
                      onChange={(e) => setVideoData(prev => ({ ...prev, videoId: e.target.value }))}
                      className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      placeholder="dQw4w9WgXcQ"
                      required
                      style={{ color: 'white' }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Video className="w-4 h-4 xs:w-5 xs:h-5 text-red-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                    URL do PDF (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={videoData.url || ""}
                      onChange={(e) => setVideoData(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      placeholder="https://exemplo.com/arquivo.pdf"
                      style={{ color: 'white' }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FileText className="w-4 h-4 xs:w-5 xs:h-5 text-white/50" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tags */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Tags
              </label>
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
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
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(activeTab === "pdf" ? tagInput : videoTagInput, activeTab === "video");
                    }
                  }}
                  className="flex-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                  placeholder="Digite uma tag e pressione Enter"
                  style={{ color: 'white' }}
                />
                <Button
                  type="button"
                  onClick={() => addTag(activeTab === "pdf" ? tagInput : videoTagInput, activeTab === "video")}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base"
                >
                  Adicionar
                </Button>
              </div>
              {(activeTab === "pdf" ? pdfData.tags : videoData.tags).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(activeTab === "pdf" ? pdfData.tags : videoData.tags).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-md text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index, activeTab === "video")}
                        className="text-white/70 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-4">
              <Button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  if (activeTab === "pdf") {
                    setPdfData({
                      title: "",
                      description: "",
                      author: "Lucas FII",
                      date: new Date().toISOString().split('T')[0],
                      time: new Date().toLocaleTimeString("pt-BR"),
                      code: "N/D",
                      type: "pdf",
                      premium: false,
                      tags: [],
                      pdfUrl: "",
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
                className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-3 xs:px-4 py-2 text-xs xs:text-sm"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-3 xs:px-4 py-2 text-xs xs:text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingItem ? "Atualizando..." : "Criando..."}
                  </>
                ) : (
                  editingItem ? "Atualizar" : "Criar"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Section */}
      {activeSection === "manage" && (
        <LowcostContentManager onEdit={handleEdit} filterByType={activeTab} />
      )}
    </>
  );
}

// Componente para gerenciar itens existentes
function LowcostContentManager({ onEdit, filterByType }: { onEdit: (item: LowcostItem) => void; filterByType: "pdf" | "video" }) {
  const [items, setItems] = useState<LowcostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(filterByType);

  useEffect(() => {
    setFilterType(filterByType);
  }, [filterByType]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [pdfsResponse, videosResponse] = await Promise.all([
        fetch("/api/lowcost-pdfs"),
        fetch("/api/lowcost-videos")
      ]);

      const pdfsData = pdfsResponse.ok ? await pdfsResponse.json() : { pdfs: [] };
      const videosData = videosResponse.ok ? await videosResponse.json() : { videos: [] };

      const allItems = [
        ...(pdfsData.pdfs || []).map((pdf: any) => ({ 
          ...pdf, 
          id: pdf._id || pdf.id,
          type: "pdf",
          pdfUrl: pdf.fileUrl || pdf.pdfUrl,
          createdAt: pdf.createdAt || new Date().toISOString()
        })),
        ...(videosData.videos || []).map((video: any) => ({ 
          ...video, 
          id: video._id || video.id,
          type: "video",
          url: video.pdfUrl || video.url,
          createdAt: video.createdAt || new Date().toISOString()
        }))
      ];

      setItems(allItems);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const endpoint = type === "pdf" ? "/api/lowcost-pdfs" : "/api/lowcost-videos";
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Item excluído com sucesso!");
        fetchItems();
      } else {
        toast.error("Erro ao excluir item");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao excluir item");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterByType ? item.type === filterByType : true;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin mr-2" />
          <span className="text-white">Carregando itens...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            {filterByType === "pdf" ? (
              <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <Video className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
            Gerenciar {filterByType === "pdf" ? "PDFs" : "Vídeos"}
          </h3>
        </div>
        <button
          onClick={fetchItems}
          className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-white transition-all duration-200"
        >
          <RefreshCw className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
          <span className="hidden xs:inline">Atualizar</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 xs:pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 text-xs xs:text-sm h-8 xs:h-10 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none w-full rounded-lg"
            style={{ color: 'white' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/10 backdrop-blur-sm">
              <tr>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Item
                </th>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden xs:table-cell">
                  Tipo
                </th>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                  Data
                </th>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      {filterByType === "pdf" ? (
                        <FileText className="w-8 h-8 text-white/40 mb-2" />
                      ) : (
                        <Video className="w-8 h-8 text-white/40 mb-2" />
                      )}
                      <p className="text-white/80 text-sm">Nenhum item encontrado</p>
                      <p className="text-white/50 text-xs mt-1">Comece criando um novo {filterByType === "pdf" ? "PDF" : "vídeo"}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                        <div className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.type === "pdf" ? (
                            <FileText className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                          ) : (
                            <Video className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs xs:text-sm sm:text-base font-medium text-white truncate leading-tight">
                            {item.title}
                          </p>
                          <p className="text-xs text-white/60 truncate leading-tight">
                            {item.description}
                          </p>
                          <div className="xs:hidden mt-1">
                            <p className="text-xs text-white/50 leading-tight">
                              {item.type === "pdf" ? "PDF" : "Vídeo"} • {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4 hidden xs:table-cell">
                      <span className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-xs font-medium ${
                        item.type === "pdf" 
                          ? "bg-blue-500/20 text-blue-200 border border-blue-400/30" 
                          : "bg-red-500/20 text-red-200 border border-red-400/30"
                      }`}>
                        {item.type === "pdf" ? "PDF" : "Vídeo"}
                      </span>
                    </td>
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4 hidden sm:table-cell">
                      <p className="text-xs xs:text-sm text-white/60">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </td>
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex items-center px-1 xs:px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 xs:py-1 sm:py-1.5 md:py-2 text-xs rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white transition-all duration-200 min-w-0"
                        >
                          <Edit2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden md:inline ml-1 text-xs">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.type)}
                          className="inline-flex items-center px-1 xs:px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 xs:py-1 sm:py-1.5 md:py-2 text-xs rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white transition-all duration-200 min-w-0"
                        >
                          <Trash2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden md:inline ml-1 text-xs">Excluir</span>
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
    </div>
  );
}
