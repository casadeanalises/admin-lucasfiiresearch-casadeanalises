/**
 * Componente PDFCard moderno e compacto
 * Card para exibição de relatórios PDF com design minimalista e eficiente
 */

"use client";

import { useState, useEffect, useRef } from "react";

interface PDFCardProps {
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
    url?: string; // Tornando url opcional para resolver erros de tipo
    premium: boolean;
    tags: string[];
    pageCount?: number; // Tornando pageCount opcional
  };
}

const PDFCard = ({ report }: PDFCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  // Usar o thumbnail fornecido ou um placeholder
  useEffect(() => {
    const thumbnailUrl = report.thumbnail || "/reports/pdf-placeholder.jpg";
    setImageUrl(thumbnailUrl);
  }, [report.thumbnail]);

  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    setImageUrl("/reports/pdf-placeholder.jpg");
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-white/80 px-2 py-1 text-xs font-medium text-blue-900 backdrop-blur-sm">
          {report.date}
        </div>

        {/* Parte superior - thumbnail e informações sobrepostas */}
        <div className="relative h-40">
          {/* Thumbnail */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt={report.title}
            className="h-full w-full object-cover object-center"
            onError={handleImageError}
          />

          {/* Overlay com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>

          {/* Ícone de PDF */}
          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-white/20 backdrop-blur-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </div>

          {/* Tags na parte superior */}
          {report.tags && report.tags.length > 0 && (
            <div className="absolute left-3 top-12 flex max-w-[80%] flex-wrap gap-1">
              {report.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {report.tags.length > 2 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  +{report.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Informações na parte inferior da imagem */}
          <div className="absolute bottom-0 w-full p-3 text-white">
            <h3 className="line-clamp-2 text-sm font-bold">{report.title}</h3>
          </div>

          {/* Badge premium */}
          {report.premium && (
            <div className="absolute right-2 top-2">
              <span className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                PREMIUM
              </span>
            </div>
          )}
        </div>

        {/* Parte inferior - detalhes do relatório */}
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                {report.author.charAt(0)}
              </div>
              <span className="line-clamp-1 text-xs text-gray-700">
                {report.author}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {report.pageCount && (
                <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-blue-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                    <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  <span className="text-xs font-medium text-blue-700">
                    {report.pageCount}
                  </span>
                </div>
              )}

              {report.code !== "N/D" && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  {report.code}
                </span>
              )}
            </div>
          </div>

          {/* Descrição */}
          <p className="mb-3 line-clamp-2 text-xs text-gray-600">
            {report.description}
          </p>

          {/* Botões de ação */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Visualizar
            </button>

            {report.url && (
              <a
                href={report.url}
                download
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal de PDF */}
      {showModal && report.url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="line-clamp-1 text-lg font-bold text-blue-900">
                  {report.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {report.author} • {report.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {report.url && (
                  <a
                    href={report.url}
                    download
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download
                  </a>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-gray-200 p-2 transition-colors hover:bg-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-[70vh] w-full">
              <iframe
                src={`${report.url}#toolbar=0`}
                className="h-full w-full"
                title={`PDF: ${report.title}`}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFCard;
