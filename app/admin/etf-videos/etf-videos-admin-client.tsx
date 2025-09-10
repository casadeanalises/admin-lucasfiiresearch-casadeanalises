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
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        {/* <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciar Vídeos de ETFs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Adicione e gerencie os vídeos relacionados a ETFs
          </p>
        </div> */}

        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingVideo(null);
            setFormData({ title: "", description: "", videoId: "", pdfUrl: "" });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Vídeo
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div
              className="relative aspect-video cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle className="h-12 w-12 text-white" />
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900">{video.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {video.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  ID: {video.videoId}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {editingVideo ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingVideo
                ? "Atualize as informações do vídeo abaixo"
                : "Preencha as informações do vídeo abaixo"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoId" className="text-gray-700">
                ID do Vídeo do YouTube
              </Label>
              <Input
                id="videoId"
                placeholder="Ex: dQw4w9WgXcQ"
                value={editingVideo ? formData.videoId : newVideo.videoId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  editingVideo
                    ? setFormData({ ...formData, videoId: e.target.value })
                    : setNewVideo({ ...newVideo, videoId: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Título
              </Label>
              <Input
                id="title"
                placeholder="Digite o título do vídeo"
                value={editingVideo ? formData.title : newVideo.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  editingVideo
                    ? setFormData({ ...formData, title: e.target.value })
                    : setNewVideo({ ...newVideo, title: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Descrição
              </Label>
              <textarea
                id="description"
                placeholder="Digite a descrição do vídeo"
                value={editingVideo ? formData.description : newVideo.description}
                onChange={(e) =>
                  editingVideo
                    ? setFormData({ ...formData, description: e.target.value })
                    : setNewVideo({ ...newVideo, description: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdfUrl" className="text-gray-700">
                URL do PDF (opcional)
              </Label>
              <Input
                id="pdfUrl"
                placeholder="https://exemplo.com/arquivo.pdf"
                value={editingVideo ? formData.pdfUrl : newVideo.pdfUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  editingVideo
                    ? setFormData({ ...formData, pdfUrl: e.target.value })
                    : setNewVideo({ ...newVideo, pdfUrl: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedVideo(null)}
            >
              X
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold">{selectedVideo.title}</h2>
              <p className="mb-4">{selectedVideo.description}</p>
              {selectedVideo.pdfUrl && (
                <a
                  href={selectedVideo.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
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