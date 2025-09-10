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

interface LowcostVideo {
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

interface LowcostPDF {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
  active: boolean;
}

export default function LowcostVideosAdminClient() {
  const [videos, setVideos] = useState<LowcostVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<LowcostVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
    pdfUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<LowcostVideo | null>(null);
  const [pdfs, setPdfs] = useState<LowcostPDF[]>([]);
  const [editingPDF, setEditingPDF] = useState<LowcostPDF | null>(null);
  const [showPDFForm, setShowPDFForm] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/lowcost-videos");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar vídeos");
      }

      setVideos(Array.isArray(data.videos) ? data.videos : []);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setError("Erro ao carregar vídeos. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPDFs = async () => {
    try {
      const response = await fetch("/api/lowcost-pdfs");
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
      const response = await fetch("/api/lowcost-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao adicionar vídeo");
      }

      await fetchVideos();
      setShowAddDialog(false);
      setFormData({ title: "", description: "", videoId: "", pdfUrl: "" });
      toast.success("Vídeo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar vídeo:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao adicionar vídeo");
    }
  };

  const handleUpdateVideo = async (id: string, data: Partial<LowcostVideo>) => {
    try {
      const response = await fetch("/api/lowcost-videos", {
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
      const response = await fetch(`/api/lowcost-videos?id=${id}`, {
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

  const handleEdit = (video: LowcostVideo) => {
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
      const url = "/api/lowcost-pdfs";
      const body = editingPDF
        ? { id: editingPDF._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao salvar PDF");

      await fetchPDFs();
      setShowPDFForm(false);
      setEditingPDF(null);
      setFormData({ title: "", description: "", videoId: "", pdfUrl: "" });
      toast.success(editingPDF ? "PDF atualizado com sucesso!" : "PDF adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
      toast.error("Erro ao salvar PDF");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este PDF?")) return;

    try {
      const response = await fetch(`/api/lowcost-pdfs?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover PDF");

      await fetchPDFs();
      toast.success("PDF removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover PDF:", error);
      toast.error("Erro ao remover PDF");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", videoId: "", pdfUrl: "" });
    setEditingVideo(null);
    setEditingPDF(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {/* <h2 className="text-2xl font-bold">Vídeos Lowcost</h2>
          <p className="text-gray-600">Gerencie os vídeos da carteira lowcost</p> */}
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Adicionar Vídeo
        </Button>
      </div>

      {/* Lista de Vídeos */}
      <div className="grid gap-4">
        {videos.map((video) => (
          <div key={video._id} className="border rounded-lg p-4 flex items-center gap-4">
            <div className="relative w-24 h-16 rounded overflow-hidden">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Criado em: {formatDate(video.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(video)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteVideo(video._id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Adicionar/Editar Vídeo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do vídeo lowcost
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do vídeo"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do vídeo"
                required
              />
            </div>
            <div>
              <Label htmlFor="videoId">ID do Vídeo (YouTube)</Label>
              <Input
                id="videoId"
                value={formData.videoId}
                onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                placeholder="ID do vídeo do YouTube"
                required
              />
            </div>
            <div>
              <Label htmlFor="pdfUrl">URL do PDF (opcional)</Label>
              <Input
                id="pdfUrl"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="URL do PDF relacionado"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : editingVideo ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 