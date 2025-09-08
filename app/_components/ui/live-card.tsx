/**
 * LiveCard Component
 * =================
 * Este componente renderiza um card para transmissões ao vivo ou gravadas.
 *
 * RECURSOS:
 * - Exibe thumbnail com botão de play
 * - Mostra indicador "AO VIVO" para transmissões em tempo real
 * - Contador de visualizações simulado para transmissões ao vivo
 * - Reproduz o vídeo do YouTube incorporado quando clicado
 * - Exibe data e duração para transmissões gravadas
 * - Mostra tags relacionadas ao conteúdo
 * - Lista FIIs mencionados na transmissão com seus dividend yields
 * - Exibe informações do autor
 * - Botões para assistir no YouTube
 *
 * COMO MODIFICAR:
 * 1. Para adicionar novos campos, expanda a interface LiveCardProps
 * 2. O contador de visualizações usa uma simulação aleatória para transmissões ao vivo
 * 3. Os estilos são baseados em Tailwind CSS e podem ser personalizados
 * 4. Para alterar a exibição de FIIs, modifique a seção "FIIs mencionados"
 * 5. Os links para YouTube são gerados automaticamente usando o videoId
 * 6. As thumbnails são carregadas do YouTube, com fallback se a imagem principal falhar
 */

"use client";

import { useState, useEffect } from "react";

interface LiveCardProps {
  live: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    videoId: string;
    isLive: boolean;
    thumbnail?: string;
    tags: string[];
    author: {
      name: string;
      role: string;
    };
    stats?: {
      viewers?: number;
      likes?: number;
    };
    fiis?: Array<{
      code: string;
      dividendYield: string;
    }>;
  };
}

const LiveCard = ({ live }: LiveCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewerCount, setViewerCount] = useState(live.stats?.viewers || 0);

  // Simulando atualização do contador de visualizações para lives
  useEffect(() => {
    if (live.isLive) {
      const interval = setInterval(() => {
        // Aumenta ou diminui aleatoriamente o número de espectadores para simular atividade
        setViewerCount((prev) => {
          const change = Math.floor(Math.random() * 5) - 2; // -2 a +2
          return Math.max(1, prev + change); // Garante que nunca seja menor que 1
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [live.isLive]);

  // Formata o número de espectadores
  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        {!isPlaying ? (
          <>
            <div className="aspect-video w-full">
              <img
                src={
                  live.thumbnail ||
                  `https://img.youtube.com/vi/${live.videoId}/maxresdefault.jpg`
                }
                alt={live.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = `https://img.youtube.com/vi/${live.videoId}/0.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20"></div>
            </div>

            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-transparent transition-all duration-300 hover:bg-black/10"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 transition-transform duration-300 hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>

            {/* Indicador de live */}
            {live.isLive && (
              <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
                <span className="text-xs font-bold">AO VIVO</span>
                {viewerCount > 0 && (
                  <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs backdrop-blur-sm">
                    {formatViewerCount(viewerCount)} assistindo
                  </span>
                )}
              </div>
            )}

            {/* Data da live passada */}
            {!live.isLive && (
              <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {live.date} • {live.time}
              </div>
            )}

            {/* Tags */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
              {live.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {live.tags.length > 2 && (
                <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  +{live.tags.length - 2}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${live.videoId}?autoplay=1&rel=0`}
              title={live.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            ></iframe>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold">{live.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {live.description}
        </p>

        {/* FIIs mencionados na live */}
        {live.fiis && live.fiis.length > 0 && (
          <div className="mb-3 space-y-1 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm">
            <p className="font-medium text-blue-800">FIIs Analisados:</p>
            <div className="grid grid-cols-2 gap-2">
              {live.fiis.map((fii, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                  <span className="font-medium">{fii.code}:</span>
                  <span className="ml-1 text-green-600">
                    {fii.dividendYield}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
              {live.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{live.author.name}</p>
              <p className="text-xs text-gray-500">{live.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {live.isLive ? (
              <a
                href={`https://www.youtube.com/watch?v=${live.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
              >
                <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
                Assistir no YouTube
              </a>
            ) : (
              <a
                href={`https://www.youtube.com/watch?v=${live.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-300"
              >
                Ver gravação
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCard;
