"use client";

import { useState, useRef } from "react";
import { Video, Plus, Trash, Edit, Save } from "lucide-react";
import { Toaster } from "react-hot-toast";

interface VideosAdminClientProps {
  adminEmail: string;
}

const VideosAdminClient = ({ adminEmail }: VideosAdminClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    vimeoId: "",
    thumbnail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Implementar lógica de salvamento
      
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-12">
      <Toaster position="top-right" />
      
      {/* Formulário de Adição/Edição */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
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
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL da Thumbnail
          </label>
          <input
            type="text"
            value={videoData.thumbnail}
            onChange={(e) => setVideoData({ ...videoData, thumbnail: e.target.value })}
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
        {/* Implementar lista de vídeos aqui */}
      </div>
    </div>
  );
};

export default VideosAdminClient;
