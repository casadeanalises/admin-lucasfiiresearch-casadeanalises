"use client";

import { useState, useEffect } from "react";
import { Video, Plus, Trash, Edit, Save, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

interface VimeoVideo {
  _id: string;
  title: string;
  description?: string;
  vimeoId: string;
  createdAt: string;
  updatedAt: string;
}

interface VideosAdminClientProps {
  adminEmail: string;
}

const VideosAdminClient = ({ adminEmail }: VideosAdminClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    vimeoId: "",
  });
  const [editingVideo, setEditingVideo] = useState<VimeoVideo | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Extrai o ID do Vimeo antes de salvar
    const vimeoId = extractVimeoId(videoData.vimeoId);
    
    if (!vimeoId) {
      toast.error("ID do Vimeo inválido");
      setIsLoading(false);
      return;
    }

    try {
      if (editingVideo) {
        const response = await fetch("/api/admin/vimeo-videos", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingVideo._id,
            ...videoData,
            vimeoId, // Usa o ID extraído
          }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar vídeo");
        toast.success("Vídeo atualizado com sucesso!");
      } else {
        const response = await fetch("/api/admin/vimeo-videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...videoData,
            vimeoId, // Usa o ID extraído
          }),
        });

        if (!response.ok) throw new Error("Erro ao salvar vídeo");
        toast.success("Vídeo salvo com sucesso!");
      }

      setVideoData({
        title: "",
        description: "",
        vimeoId: "",
      });
      setEditingVideo(null);
      fetchVideos();
    } catch (error) {
      console.error("Erro ao salvar/atualizar vídeo:", error);
      toast.error("Erro ao salvar/atualizar vídeo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (video: VimeoVideo) => {
    setEditingVideo(video);
    setVideoData({
      title: video.title,
      description: video.description || "",
      vimeoId: video.vimeoId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;

    try {
      const response = await fetch(`/api/admin/vimeo-videos?id=${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir vídeo");

      toast.success("Vídeo excluído com sucesso!");
      fetchVideos();
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      toast.error("Erro ao excluir vídeo");
    }
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setVideoData({
      title: "",
      description: "",
      vimeoId: "",
    });
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/admin/vimeo-videos");
      if (!response.ok) throw new Error("Erro ao carregar vídeos");
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      toast.error("Erro ao carregar vídeos");
    }
  };

  return (
    <div className="mb-12">
      <Toaster position="top-right" />
      
      {/* Formulário de Adição/Edição */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingVideo ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
          </h2>
          {editingVideo && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título do Vídeo
          </label>
          <input
            type="text"
            value={videoData.title}
            onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ID do Vídeo no Vimeo
          </label>
          <input
            type="text"
            value={videoData.vimeoId}
            onChange={(e) => setVideoData({ ...videoData, vimeoId: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            value={videoData.description}
            onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            "Salvando..."
          ) : editingVideo ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Vídeo
            </>
          )}
        </button>
      </form>

      {/* Lista de Vídeos */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Vídeos Cadastrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="aspect-video w-full mb-4">
                <iframe
                  src={`https://player.vimeo.com/video/${extractVimeoId(video.vimeoId)}?h=0&badge=0&autopause=0&player_id=0&app_id=58479`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="w-full h-full rounded-md"
                ></iframe>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{video.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{video.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">ID: {video.vimeoId}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosAdminClient;
