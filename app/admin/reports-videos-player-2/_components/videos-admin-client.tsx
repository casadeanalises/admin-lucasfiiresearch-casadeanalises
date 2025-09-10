"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { 
  Video, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  RefreshCw, 
  Loader2,
  Save,
  X
} from "lucide-react";

interface VimeoVideo {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  vimeoId: string;
  createdAt: string;
  updatedAt: string;
  type: "video";
}

interface VideosAdminClientProps {
  adminEmail: string;
}

export default function VideosAdminClient({ adminEmail }: VideosAdminClientProps) {
  const [activeSection, setActiveSection] = useState<"add" | "manage">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<VimeoVideo | null>(null);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    vimeoId: "",
  });
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para extrair o ID do Vimeo de uma URL completa
  const extractVimeoId = (vimeoUrl: string): string => {
    // Se já for apenas o ID, retorna ele mesmo
    if (/^\d+$/.test(vimeoUrl)) {
      return vimeoUrl;
    }

    // Tenta extrair o ID da URL
    const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|\/video\/)(\d+)/);
    return match ? match[1] : '';
  };

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/vimeo-videos");
      
      if (!response.ok) {
        throw new Error("Erro ao carregar vídeos");
      }

      const data = await response.json();
      const videosList = Array.isArray(data) ? data : [];
      const transformedVideos = videosList.map((video: any) => ({
        ...video,
        id: video._id,
        type: "video" as const,
        createdAt: video.createdAt || new Date().toISOString(),
      }));
      
      setVideos(transformedVideos);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      toast.error("Erro ao carregar vídeos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle submit (add new video)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Extrai o ID do Vimeo antes de salvar
      const vimeoId = extractVimeoId(videoData.vimeoId);
      
      if (!vimeoId) {
        toast.error("ID do Vimeo inválido");
        setIsSubmitting(false);
        return;
      }

      const dataToSend = {
        title: videoData.title,
        description: videoData.description,
        vimeoId: vimeoId,
      };

      const response = await fetch("/api/admin/vimeo-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar vídeo");
      }

      toast.success("Vídeo adicionado com sucesso!");
      await fetchVideos();
      resetForm();
    } catch (error: any) {
      console.error("Erro ao adicionar vídeo:", error);
      toast.error(error.message || "Erro ao adicionar vídeo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);

    try {
      // Extrai o ID do Vimeo antes de salvar
      const vimeoId = extractVimeoId(videoData.vimeoId);
      
      if (!vimeoId) {
        toast.error("ID do Vimeo inválido");
        setIsSubmitting(false);
        return;
      }

      const dataToSend = {
        id: editingItem._id,
        title: videoData.title,
        description: videoData.description,
        vimeoId: vimeoId,
      };

      const response = await fetch("/api/admin/vimeo-videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar vídeo");
      }

      toast.success("Vídeo atualizado com sucesso!");
      await fetchVideos();
      resetForm();
    } catch (error: any) {
      console.error("Erro ao atualizar vídeo:", error);
      toast.error(error.message || "Erro ao atualizar vídeo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item: VimeoVideo) => {
    setEditingItem(item);
    setVideoData({
      title: item.title,
      description: item.description || "",
      vimeoId: item.vimeoId,
    });
    setActiveSection("add");
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;

    try {
      const response = await fetch(`/api/admin/vimeo-videos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir vídeo");
      }

      toast.success("Vídeo excluído com sucesso!");
      await fetchVideos();
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      toast.error("Erro ao excluir vídeo");
    }
  };

  // Reset form
  const resetForm = () => {
    setVideoData({
      title: "",
      description: "",
      vimeoId: "",
    });
    setEditingItem(null);
  };

  // Filter videos
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => setActiveSection("add")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === "add"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Vídeo</span>
        </button>
        <button
          onClick={() => setActiveSection("manage")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === "manage"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Gerenciar Existentes</span>
        </button>
      </div>

      {/* Add Video Section */}
      {activeSection === "add" && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                <Video className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
                {editingItem ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
              </h3>
            </div>
            {editingItem && (
              <button
                onClick={resetForm}
                className="bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
              >
                Novo Vídeo
              </button>
            )}
          </div>

          {/* Editing Alert */}
          {editingItem && (
            <div className="bg-blue-500/20 border border-blue-400/30 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-blue-200 text-sm">
                <strong>Editando:</strong> {editingItem.title}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-white">
                  Título do Vídeo *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  placeholder="Digite o título do vídeo"
                  value={videoData.title}
                  onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                  style={{ color: 'white' }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="vimeoId" className="text-sm font-medium text-white">
                  ID do Vídeo no Vimeo *
                </label>
                <input
                  type="text"
                  id="vimeoId"
                  required
                  placeholder="Ex: 123456789 ou URL completa"
                  value={videoData.vimeoId}
                  onChange={(e) => setVideoData({ ...videoData, vimeoId: e.target.value })}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                  style={{ color: 'white' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-white">
                Descrição
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Digite uma breve descrição do vídeo"
                value={videoData.description}
                onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none resize-none"
                style={{ color: 'white' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    {editingItem ? "Atualizando..." : "Salvando..."}
                  </>
                ) : (
                  editingItem ? "Atualizar" : "Salvar"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Videos Section */}
      {activeSection === "manage" && (
        <VideosContentManager
          videos={filteredVideos}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchVideos}
          extractVimeoId={extractVimeoId}
        />
      )}
    </div>
  );
}

// Content Manager Component
interface VideosContentManagerProps {
  videos: VimeoVideo[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (video: VimeoVideo) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  extractVimeoId: (url: string) => string;
}

function VideosContentManager({
  videos,
  isLoading,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
  onRefresh,
  extractVimeoId,
}: VideosContentManagerProps) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin mr-2" />
          <span className="text-white">Carregando vídeos...</span>
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
            <Video className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
            Gerenciar Vídeos
          </h3>
        </div>
        <button
          onClick={onRefresh}
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

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-8">
          <Video className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/80 text-sm">Nenhum vídeo encontrado</p>
          <p className="text-white/50 text-xs mt-1">Comece criando um novo vídeo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
            >
              {/* Video Preview */}
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden">
                <iframe
                  src={`https://player.vimeo.com/video/${extractVimeoId(video.vimeoId)}?h=0&badge=0&autopause=0&player_id=0&app_id=58479`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="w-full h-full"
                />
              </div>

              {/* Video Info */}
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-medium text-white truncate">
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-xs text-white/60 line-clamp-2">
                    {video.description}
                  </p>
                )}
                <p className="text-xs text-white/50">
                  ID: {video.vimeoId}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => onEdit(video)}
                  className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white transition-all duration-200"
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => onDelete(video._id)}
                  className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white transition-all duration-200"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}