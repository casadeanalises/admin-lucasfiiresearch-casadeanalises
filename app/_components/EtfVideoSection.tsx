"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, ArrowRightIcon, PlayCircleIcon, LockIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

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
  type: "pdf" | "video";
  tags: string[];
  date: string;
  pdfUrl?: string;
}

export default function EtfVideoSection() {
  const [videos, setVideos] = useState<EtfVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const subscriptionPlan = user?.publicMetadata.subscriptionPlan as string;
  const hasEtfsAccess = subscriptionPlan === "etfs_wallet" || subscriptionPlan === "basic" || subscriptionPlan === "annualbasic";

  useEffect(() => {
    const fetchVideos = async () => {
      try { 
        setLoading(true);
        setError(null);

        const response = await fetch("/api/etf-videos");
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar vídeos: ${response.status}`);
        }

        const data = await response.json();

        if (!data.videos || !Array.isArray(data.videos)) {
          throw new Error("Formato de dados inválido");
        }

        // Ordenar por data e pegar os 6 mais recentes
        const sortedVideos = data.videos
          .filter((video: EtfVideo) => video.active)
          .sort((a: EtfVideo, b: EtfVideo) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 6);

        setVideos(sortedVideos);
      } catch (err) {
        console.error("Erro ao buscar vídeos:", err);
        setError(
          "Erro ao carregar os vídeos. Por favor, tente novamente mais tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl bg-[#1c3276] p-4 shadow-lg lg:p-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-[#1c3276] p-4 shadow-lg lg:p-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!hasEtfsAccess) {
    return (
      <div className="rounded-xl bg-[#1c3276] p-4 shadow-lg lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500 p-2">
              <PlayCircleIcon className="h-5 w-5 text-white lg:h-6 lg:w-6" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white">Vídeos de ETFs</h2>
              <p className="text-sm text-gray-300">Análises e conteúdos sobre ETFs</p>
            </div>
          </div>
          <Link
            href="/subscription"
            className="group flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
          >
            <span>Assine para ver mais</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-blue-500/10 p-4">
            <LockIcon className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Conteúdo Exclusivo</h3>
          <p className="mb-6 text-gray-300">
            Assine agora para ter acesso aos conteúdos exclusivos
          </p>
          <Link
            href="/subscription"
            className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
          >
            Assinar Agora
          </Link>
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="rounded-xl bg-[#1c3276] p-4 shadow-lg lg:p-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-blue-500 font-semibold">
            Nenhum vídeo disponível no momento
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#1c3276] p-4 shadow-lg lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-500 p-2">
            <PlayCircleIcon className="h-5 w-5 text-white lg:h-6 lg:w-6" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white">Vídeos de ETFs</h2>
            <p className="text-sm text-gray-300">Análises e conteúdos sobre ETFs</p>
          </div>
        </div>
        <Link 
          href="/etf-videos"
          className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          <span>Ver mais</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {videos.map((video) => (
          <Link
            key={video._id}
            href={`/etf-videos?video=${video._id}`}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <Play className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </div>

              <div className="absolute right-3 top-3">
                <div className="rounded-full bg-black/30 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
                  {new Date(video.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <div className="relative p-4">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <h3 className="mb-2 line-clamp-2 text-base font-bold text-white transition-colors group-hover:text-blue-400">
                {video.title}
              </h3>

              {/* Indicador de NOVO para vídeos recentes (menos de 7 dias) */}
              {video.createdAt && new Date().getTime() - new Date(video.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                <div className="mb-2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    NOVO
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 