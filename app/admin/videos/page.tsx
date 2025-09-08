"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaYoutube } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Button } from "@/app/_components/ui/button";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  order: number;
  active: boolean;
  createdAt: string;
}

interface VideoFormData {
  title: string;
  description: string;
  videoId: string;
  order: number;
  active: boolean;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    videoId: "",
    order: 0,
    active: true,
  });

  // Função para extrair o ID do vídeo do YouTube da URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Função para gerar thumbnail do YouTube
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";
  };

  // Função para listar vídeos
  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/admin/videos");
      if (!response.ok) throw new Error("Erro ao carregar vídeos");
      const data = await response.json();
      setVideos(data.videos);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar vídeos");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Adicionar vídeo
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      videoId: formData.get("videoId") as string,
      order: parseInt(formData.get("order") as string) || 0,
      active: formData.get("active") === "on",
    };

    try {
      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar vídeo");
      }

      toast.success("Vídeo adicionado com sucesso!");
      setShowAddModal(false);
      fetchVideos(); // Recarrega a lista de vídeos
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao adicionar vídeo");
    }
  };

  // Editar vídeo
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVideo) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      videoId: formData.get("videoId") as string,
      order: parseInt(formData.get("order") as string) || 0,
      active: formData.get("active") === "on",
    };

    try {
      const response = await fetch(`/api/admin/videos/${selectedVideo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar vídeo");
      }

      toast.success("Vídeo atualizado com sucesso!");
      setShowEditModal(false);
      fetchVideos(); // Recarrega a lista de vídeos
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao atualizar vídeo");
    }
  };

  // Função para excluir vídeo
  const handleDelete = async (videoId: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir vídeo");

      toast.success("Vídeo excluído com sucesso");
      fetchVideos();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao excluir vídeo");
    }
  };

  // Abrir modal de edição
  const openEditModal = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      videoId: video.videoId,
      order: video.order,
      active: video.active,
    });
    setShowEditModal(true);
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Vídeos</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Adicionar Vídeo
        </button>
      </div>

      {/* Lista de vídeos */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-6 py-3 text-left">Título</th>
              <th className="border-b px-6 py-3 text-left">Descrição</th>
              <th className="border-b px-6 py-3 text-left">URL</th>
              <th className="border-b px-6 py-3 text-center">Ordem</th>
              <th className="border-b px-6 py-3 text-center">Status</th>
              <th className="border-b px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id}>
                <td className="border px-4 py-2">{video.title}</td>
                <td className="border px-4 py-2">{video.description}</td>
                <td className="border px-4 py-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaYoutube className="mr-1 inline" />
                    Ver vídeo
                  </a>
                </td>
                <td className="border px-4 py-2">{video.order}</td>
                <td className="border px-4 py-2">
                  {video.active ? (
                    <span className="text-green-500">Ativo</span>
                  ) : (
                    <span className="text-red-500">Inativo</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedVideo(video);
                        setShowEditModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Adicionar Vídeo */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Vídeo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Digite o título do vídeo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Digite a descrição do vídeo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoId">ID do Vídeo do YouTube</Label>
              <Input
                id="videoId"
                name="videoId"
                placeholder="Ex: GQWd5HomAPQ"
                required
              />
              <p className="text-sm text-gray-500">
                Cole apenas o ID do vídeo (Ex: para
                https://www.youtube.com/watch?v=GQWd5HomAPQ, use GQWd5HomAPQ)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                type="number"
                id="order"
                name="order"
                placeholder="0"
                defaultValue="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="active" name="active" defaultChecked />
              <Label htmlFor="active">Ativo</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Vídeo */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Vídeo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={selectedVideo?.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={selectedVideo?.description}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-videoId">ID do Vídeo do YouTube</Label>
              <Input
                id="edit-videoId"
                name="videoId"
                defaultValue={selectedVideo?.videoId}
                placeholder="Ex: GQWd5HomAPQ"
                required
              />
              <p className="text-sm text-gray-500">
                Cole apenas o ID do vídeo (Ex: para
                https://www.youtube.com/watch?v=GQWd5HomAPQ, use GQWd5HomAPQ)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-order">Ordem</Label>
              <Input
                type="number"
                id="edit-order"
                name="order"
                defaultValue={selectedVideo?.order}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-active"
                name="active"
                defaultChecked={selectedVideo?.active}
              />
              <Label htmlFor="edit-active">Ativo</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
