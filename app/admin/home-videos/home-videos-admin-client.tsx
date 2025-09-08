"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Switch } from "@/app/_components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { PlayCircle, Plus, Trash2, X, Loader2 } from "lucide-react";
import { Image } from "@/app/_components/ui/image";
import { Textarea } from "@/app/_components/ui/textarea";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Toaster } from "react-hot-toast";

interface HomeVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  videoId: string;
  thumbnail: string;
  order: number;
  active: boolean;
}

export default function HomeVideosAdminClient() {
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<HomeVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/home-videos");
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

  useEffect(() => {
    fetchVideos();
  }, []);

 
  const handleAddVideo = async () => {
    try {
      const response = await fetch("/api/home-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });

      if (!response.ok) throw new Error("Erro ao adicionar vídeo");

      await fetchVideos();
      setShowAddDialog(false);
      setNewVideo({ title: "", description: "", videoId: "" });
      toast.success("Vídeo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar vídeo:", error);
      toast.error("Erro ao adicionar vídeo");
    }
  };

 
  const handleUpdateVideo = async (id: string, data: Partial<HomeVideo>) => {
    try {
      console.log("Atualizando vídeo:", id, data);
      
      const response = await fetch("/api/home-videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          ...data 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na resposta:", errorData);
        throw new Error(errorData.message || "Erro ao atualizar vídeo");
      }

      await fetchVideos();
      toast.success("Vídeo atualizado com sucesso!", {
        duration: 4000,
        icon: "🎥",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
      toast.error("Erro ao atualizar vídeo");
    }
  };

  
  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este vídeo?")) return;

    try {
      const response = await fetch(`/api/home-videos?id=${id}`, {
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

  const handleEdit = (video: HomeVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      videoId: video.videoId,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingVideo) {
        console.log("Editando vídeo existente:", editingVideo._id);
        
       
        if (!editingVideo._id) {
          throw new Error("ID do vídeo inválido");
        }
        
      
        await handleUpdateVideo(editingVideo._id, formData);
      } else {
        
        const response = await fetch("/api/home-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao adicionar vídeo");
        }

        toast.success("Vídeo adicionado com sucesso!");
        await fetchVideos();
      }

      setIsModalOpen(false);
      setEditingVideo(null);
      setFormData({ title: "", description: "", videoId: "" });
    } catch (error: any) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error(error.message || "Erro ao salvar vídeo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
   
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciar Teses de Investimento
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Adicione e gerencie os vídeos que aparecem na página inicial na seção Teses de Investimento
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingVideo(null);
            setFormData({ title: "", description: "", videoId: "" });
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
           
            <div className="relative aspect-video">
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
                value={formData.videoId}
                onChange={(e) =>
                  setFormData({ ...formData, videoId: e.target.value })
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
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Digite uma breve descrição do vídeo"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px] border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
