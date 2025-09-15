"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, TrashIcon, PlayCircle, FileText, Trash2, Edit2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { Toaster } from "sonner";
import { formatDate } from "@/lib/utils/formatters";

interface EtfVideo {
  _id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  pdfUrl?: string;
}

interface EtfPDF {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
  active: boolean;
}

export default function EtfVideosAdminClient() {
  const [videos, setVideos] = useState<EtfVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
    pdfUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<EtfVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
    pdfUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<EtfVideo | null>(null);
  const [pdfs, setPdfs] = useState<EtfPDF[]>([]);
  const [editingPDF, setEditingPDF] = useState<EtfPDF | null>(null);
  const [showPDFForm, setShowPDFForm] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/etf-videos");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar vídeos");
      }

      setVideos(
        Array.isArray(data.videos)
          ? data.videos.sort((a: EtfVideo, b: EtfVideo): number => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : []
      );
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setError("Erro ao carregar vídeos. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPDFs = async () => {
    try {
      const response = await fetch("/api/etf-pdfs");
      if (!response.ok) throw new Error("Erro ao carregar PDFs");
      const data = await response.json();
      setPdfs(data.pdfs);
    } catch (error) {
      console.error("Erro ao buscar PDFs:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchPDFs();
  }, []);

  const handleAddVideo = async () => {
    try {
      const response = await fetch("/api/etf-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });

      if (!response.ok) throw new Error("Erro ao adicionar vídeo");

      await fetchVideos();
      setShowAddDialog(false);
      setNewVideo({ title: "", description: "", videoId: "", pdfUrl: "" });
      toast.success("Vídeo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar vídeo:", error);
      toast.error("Erro ao adicionar vídeo");
    }
  };

  const handleUpdateVideo = async (id: string, data: Partial<EtfVideo>) => {
    try {
      const response = await fetch("/api/etf-videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar vídeo");
      }

      await fetchVideos();
      toast.success("Vídeo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
      toast.error("Erro ao atualizar vídeo");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este vídeo?")) return;

    try {
      const response = await fetch(`/api/etf-videos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover vídeo");

      await fetchVideos();
      toast.success("Vídeo removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover vídeo:", error);
      toast.error("Erro ao remover vídeo");
    }
  };

  const handleEdit = (video: EtfVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      videoId: video.videoId,
      pdfUrl: video.pdfUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingVideo) {
        await handleUpdateVideo(editingVideo._id, formData);
      } else {
        await handleAddVideo();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error("Erro ao salvar vídeo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingPDF ? "PUT" : "POST";
      const url = "/api/etf-pdfs";
      const body = editingPDF
        ? { ...formData, _id: editingPDF._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao salvar PDF");

      await fetchPDFs();
      resetForm();
      setShowPDFForm(false);
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este PDF?")) return;

    try {
      const response = await fetch(`/api/etf-pdfs?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir PDF");

      await fetchPDFs();
    } catch (error) {
      console.error("Erro ao excluir PDF:", error);
    }
  };

  const resetForm = () => {
    setEditingPDF(null);
    setFormData({
      title: "",
      description: "",
      pdfUrl: "",
      videoId: "",
    });
  };

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
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingVideo(null);
            setFormData({ title: "", description: "", videoId: "", pdfUrl: "" });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Adicionar Vídeo</span>
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-4 sm:p-6 transition-all hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:-translate-y-1"
          >
            <div
              className="relative aspect-video cursor-pointer rounded-lg overflow-hidden mb-4"
              onClick={() => setSelectedVideo(video)}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-white text-sm sm:text-base line-clamp-2">{video.title}</h3>
              <p className="text-xs sm:text-sm text-white/70 line-clamp-2">
                {video.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-white/60">
                  ID: {video.videoId}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 p-2 text-white transition-all duration-200"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 p-2 text-white transition-all duration-200"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
              {editingVideo ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                ID do Vídeo do YouTube
              </label>
              <Input
                id="videoId"
                placeholder="Ex: dQw4w9WgXcQ"
                value={editingVideo ? formData.videoId : newVideo.videoId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  editingVideo
                    ? setFormData({ ...formData, videoId: e.target.value })
                    : setNewVideo({ ...newVideo, videoId: e.target.value })
                }
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Título
              </label>
              <Input
                id="title"
                placeholder="Digite o título do vídeo"
                value={editingVideo ? formData.title : newVideo.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  editingVideo
                    ? setFormData({ ...formData, title: e.target.value })
                    : setNewVideo({ ...newVideo, title: e.target.value })
                }
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                placeholder="Digite a descrição do vídeo"
                value={editingVideo ? formData.description : newVideo.description}
                onChange={(e) =>
                  editingVideo
                    ? setFormData({ ...formData, description: e.target.value })
                    : setNewVideo({ ...newVideo, description: e.target.value })
                }
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                URL do PDF (opcional)
              </label>
              <Input
                id="pdfUrl"
                placeholder="https://exemplo.com/arquivo.pdf"
                value={editingVideo ? formData.pdfUrl : newVideo.pdfUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  editingVideo
                    ? setFormData({ ...formData, pdfUrl: e.target.value })
                    : setNewVideo({ ...newVideo, pdfUrl: e.target.value })
                }
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl">
            <button
              className="absolute top-3 right-3 text-white hover:text-white/70 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              onClick={() => setSelectedVideo(null)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-t-lg"
              />
            </div>
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{selectedVideo.title}</h2>
              <p className="text-sm sm:text-base text-white/70 mb-4">{selectedVideo.description}</p>
              {selectedVideo.pdfUrl && (
                <a
                  href={selectedVideo.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 px-4 py-2 text-white transition-all duration-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF do Relatório
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 