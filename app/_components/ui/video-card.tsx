"use client";

import { useState, useEffect, useRef } from "react";
import { Play, X, Calendar, User, Eye, Share2, Download, BookmarkPlus } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

interface VideoCardProps {
  report: {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    time: string;
    code: string;
    type: string;
    thumbnail: string;
    videoId?: string;
    premium: boolean;
    tags: string[];
    dividendYield?: string;
    price?: string;
  };
}

const VideoCard = ({ report }: VideoCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  // Gerar a URL do thumbnail do YouTube
  useEffect(() => {
    const videoId = report.videoId || "";
    const thumbnailUrl =
      report.thumbnail ||
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    setImageUrl(thumbnailUrl);
  }, [report.thumbnail, report.videoId]);

  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    const videoId = report.videoId || "";
    setImageUrl(`https://img.youtube.com/vi/${videoId}/0.jpg`);
  };

  return (
    <>
      <div className="transform overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <div className="relative aspect-video bg-gray-200">
            {/* Thumbnail real do vídeo */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt={report.title}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                <div
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-600 transition-colors hover:bg-red-700"
                  onClick={() => setShowModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-0 top-0 w-full bg-gradient-to-b from-black/70 to-transparent px-4 py-2">
            <h3 className="text-sm font-bold text-white">{report.title}</h3>
          </div>
          {report.premium && (
            <div className="absolute right-2 top-2">
              <button className="rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:from-green-500 hover:to-emerald-400">
                PREMIUM
              </button>
            </div>
          )}
          {/* Tag de código do FII */}
          {report.code !== "N/D" && (
            <div className="absolute bottom-2 left-2">
              <span className="rounded bg-blue-800/80 px-2 py-1 text-xs font-bold text-white">
                {report.code}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {report.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-gray-700">
            {report.description}
          </p>
          <div className="mb-3 flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
              {report.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Autor</p>
              <p className="text-sm font-semibold">{report.author}</p>
            </div>
          </div>
          <div className="flex justify-between border-t pt-3 text-xs text-gray-500">
            <div>
              {report.dividendYield && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    DY Mensal
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {report.dividendYield}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <span>{report.date}</span>
              <button
                className="ml-2 rounded-full bg-blue-50 p-1 text-blue-800 transition-colors hover:bg-blue-100"
                onClick={() => setShowModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a7 7 0 1014 0 7 7 0 00-14 0zm6.293-4.707a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L10.586 8 8.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Vídeo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md">
          {/* Backdrop com gradiente animado */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/90 via-purple-900/20 to-black/90"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Principal */}
          <div className="relative mx-auto w-full max-w-6xl animate-in fade-in-0 zoom-in-95 duration-300 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl border border-slate-700/50">
            {/* Header com gradiente */}
            <div className="relative bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 p-4 sm:p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl border border-purple-500/50">
                    <Play className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-1">
                      {report.title}
                    </h2>
                    <p className="text-slate-400 text-sm">Conteúdo em Vídeo</p>
                  </div>
                </div>
                
                {/* Botão de fechar modernizado */}
                <button
                  onClick={() => setShowModal(false)}
                  className="group relative p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/10 transition-all duration-300" />
                </button>
              </div>
            </div>
            
            {/* Player de Vídeo */}
            <div className="relative aspect-video w-full bg-black max-h-[60vh] md:max-h-[70vh] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />
              <iframe
                src={`https://www.youtube.com/embed/${report.videoId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            
            {/* Conteúdo do Vídeo */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Título e Descrição */}
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {report.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed">
                  {report.description || "Sem descrição disponível"}
                </p>
              </div>
              
              {/* Metadados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Data</p>
                    <p className="text-sm font-medium text-white">{report.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <User className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-xs text-slate-400">Autor</p>
                    <p className="text-sm font-medium text-white">{report.author}</p>
                  </div>
                </div>
                
                {/* <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <div>
                    <p className="text-xs text-slate-400">Visualizações</p>
                    <p className="text-sm font-medium text-white">2.1k</p>
                  </div>
                </div> */}

              </div>
              
              {/* ==== Ações ==== */}

              {/* <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700/50">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
                
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2">
                  <BookmarkPlus className="h-4 w-4" />
                  Salvar
                </Button>
              </div> */}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
