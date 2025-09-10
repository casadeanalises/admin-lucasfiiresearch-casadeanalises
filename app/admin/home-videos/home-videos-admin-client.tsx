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
  PlayCircle
} from "lucide-react";

interface HomeVideo {
  _id: string;
  id?: string;
  title: string;
  description: string;
  url: string;
  videoId: string;
  thumbnail: string;
  order: number;
  active: boolean;
  createdAt: string;
  type: "video";
}

interface HomeVideosAdminClientProps {
  adminEmail: string;
}

export default function HomeVideosAdminClient({ adminEmail }: HomeVideosAdminClientProps) {
  const [activeSection, setActiveSection] = useState<"add" | "manage">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<HomeVideo | null>(null);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoId: "",
  });
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/home-videos");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar vídeos");
      }

      const videosList = Array.isArray(data.videos) ? data.videos : [];
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
      const dataToSend = {
        title: videoData.title,
        description: videoData.description,
        videoId: videoData.videoId,
      };

      const response = await fetch("/api/home-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar vídeo");
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
      const dataToSend = {
        id: editingItem._id,
        title: videoData.title,
        description: videoData.description,
        videoId: videoData.videoId,
      };

      const response = await fetch("/api/home-videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar vídeo");
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
  const handleEdit = (item: HomeVideo) => {
    setEditingItem(item);
    setVideoData({
      title: item.title,
      description: item.description,
      videoId: item.videoId,
    });
    setActiveSection("add");
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;

    try {
      const response = await fetch(`/api/home-videos?id=${id}`, {
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
      videoId: "",
    });
    setEditingItem(null);
  };

  // Filter videos
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                <label htmlFor="videoId" className="text-sm font-medium text-white">
                  ID do Vídeo do YouTube *
                </label>
                <input
                  type="text"
                  id="videoId"
                  required
                  placeholder="Ex: dQw4w9WgXcQ"
                  value={videoData.videoId}
                  onChange={(e) => setVideoData({ ...videoData, videoId: e.target.value })}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                  style={{ color: 'white' }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-white">
                  Título *
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
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-white">
                Descrição *
              </label>
              <textarea
                id="description"
                required
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
        <HomeVideosContentManager
          videos={filteredVideos}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchVideos}
        />
      )}
    </div>
  );
}

// Content Manager Component
interface HomeVideosContentManagerProps {
  videos: HomeVideo[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (video: HomeVideo) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

function HomeVideosContentManager({
  videos,
  isLoading,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
  onRefresh,
}: HomeVideosContentManagerProps) {
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

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/10 backdrop-blur-sm">
              <tr>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Item
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
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <Video className="w-8 h-8 text-white/40 mb-2" />
                      <p className="text-white/80 text-sm">Nenhum vídeo encontrado</p>
                      <p className="text-white/50 text-xs mt-1">Comece criando um novo vídeo</p>
                    </div>
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id} className="hover:bg-white/5">
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                        <div className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Video className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs xs:text-sm sm:text-base font-medium text-white truncate leading-tight">
                            {video.title}
                          </p>
                          <p className="text-xs text-white/60 truncate leading-tight">
                            {video.description}
                          </p>
                          <div className="sm:hidden mt-1">
                            <p className="text-xs text-white/50 leading-tight">
                              {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4 hidden sm:table-cell">
                      <p className="text-xs xs:text-sm text-white/60">
                        {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </td>
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                        <button
                          onClick={() => onEdit(video)}
                          className="inline-flex items-center px-1 xs:px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 xs:py-1 sm:py-1.5 md:py-2 text-xs rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white transition-all duration-200 min-w-0"
                        >
                          <Edit2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden md:inline ml-1 text-xs">Editar</span>
                        </button>
                        <button
                          onClick={() => onDelete(video._id)}
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