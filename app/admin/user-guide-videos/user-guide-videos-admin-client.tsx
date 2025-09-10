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
import { PlayCircle, Plus, Trash2, X, Loader2, BookOpen, HelpCircle } from "lucide-react";
import { Image } from "@/app/_components/ui/image";
import { Textarea } from "@/app/_components/ui/textarea";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";

interface UserGuideVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  videoId: string;
  thumbnail: string;
  category: string;
  order: number;
  active: boolean;
}

const categories = ["Geral", "Carteira", "Relatórios", "Configurações", "Primeiros Passos", "Planos", "Material Educacional", "Novidades", "Nova Atualização"];

export default function UserGuideVideosAdminClient() {
  const [videos, setVideos] = useState<UserGuideVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
    category: "Geral",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<UserGuideVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
    category: "Geral",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user-guide-videos");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar vídeos do guia");
      }

      setVideos(Array.isArray(data.videos) ? data.videos : []);
    } catch (error) {
      console.error("Erro ao carregar vídeos do guia:", error);
      setError("Erro ao carregar vídeos do guia. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async () => {
    try {
      const response = await fetch("/api/user-guide-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });

      if (!response.ok) throw new Error("Erro ao adicionar vídeo do guia");

      await fetchVideos();
      setShowAddDialog(false);
      setNewVideo({ title: "", description: "", videoId: "", category: "Geral" });
      toast.success("Vídeo do guia adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar vídeo do guia:", error);
      toast.error("Erro ao adicionar vídeo do guia");
    }
  };

  const handleUpdateVideo = async (id: string, data: Partial<UserGuideVideo>) => {
    try {
      console.log("Atualizando vídeo do guia:", id, data);
      
      const response = await fetch("/api/user-guide-videos", {
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
        throw new Error(errorData.message || "Erro ao atualizar vídeo do guia");
      }

      await fetchVideos();
      toast.success("Vídeo do guia atualizado com sucesso!", {
        duration: 4000,
        icon: "📚",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar vídeo do guia:", error);
      toast.error("Erro ao atualizar vídeo do guia");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este vídeo do guia?")) return;

    try {
      const response = await fetch(`/api/user-guide-videos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover vídeo do guia");

      await fetchVideos();
      toast.success("Vídeo do guia removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover vídeo do guia:", error);
      toast.error("Erro ao remover vídeo do guia");
    }
  };

  const handleEdit = (video: UserGuideVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      videoId: video.videoId,
      category: video.category,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingVideo) {
        console.log("Editando vídeo do guia existente:", editingVideo._id);
        
        if (!editingVideo._id) {
          throw new Error("ID do vídeo inválido");
        }
        
        await handleUpdateVideo(editingVideo._id, formData);
      } else {
        const response = await fetch("/api/user-guide-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao adicionar vídeo do guia");
        }

        toast.success("Vídeo do guia adicionado com sucesso!");
        await fetchVideos();
      }

      setIsModalOpen(false);
      setEditingVideo(null);
      setFormData({ title: "", description: "", videoId: "", category: "Geral" });
    } catch (error) {
      console.error("Erro ao salvar vídeo do guia:", error);
      toast.error("Erro ao salvar vídeo do guia");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchVideos}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* <div className="p-2 bg-blue-100 rounded-lg">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div> */}
          {/* <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Vídeos do Guia do Usuário
            </h2>
            <p className="text-sm text-gray-600">
              {videos.length} vídeo{videos.length !== 1 ? "s" : ""} cadastrado{videos.length !== 1 ? "s" : ""}
            </p>
          </div> */}
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Adicionar Vídeo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Vídeo do Guia</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo vídeo tutorial
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Digite o título do vídeo"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  placeholder="Digite a descrição do vídeo"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="videoId">ID do Vídeo (YouTube)</Label>
                <Input
                  id="videoId"
                  value={newVideo.videoId}
                  onChange={(e) => setNewVideo({ ...newVideo, videoId: e.target.value })}
                  placeholder="Ex: dQw4w9WgXcQ"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={newVideo.category}
                  onValueChange={(value) => setNewVideo({ ...newVideo, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddVideo}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video._id} className="overflow-hidden">
            <div className="relative">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(video)}
                    className="bg-white/90 hover:bg-white"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteVideo(video._id)}
                    className="bg-red-500/90 hover:bg-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {video.category}
                </span>
                <Switch
                  checked={video.active}
                  onCheckedChange={(checked) =>
                    handleUpdateVideo(video._id, { active: checked })
                  }
                />
              </div>
              <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 mb-4">
                {video.description}
              </CardDescription>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>ID: {video.videoId}</span>
                <span>Ordem: {video.order}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum vídeo do guia cadastrado
          </h3>
          <p className="text-gray-600 mb-4">
            Comece adicionando o primeiro vídeo tutorial do guia do usuário
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Primeiro Vídeo
          </Button>
        </div>
      )}

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Vídeo do Guia</DialogTitle>
            <DialogDescription>
              Atualize as informações do vídeo tutorial
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título do vídeo"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Digite a descrição do vídeo"
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-videoId">ID do Vídeo (YouTube)</Label>
              <Input
                id="edit-videoId"
                value={formData.videoId}
                onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                placeholder="Ex: dQw4w9WgXcQ"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 