"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  RefreshCw, 
  Loader2,
  User,
  Calendar,
  X
} from "lucide-react";
import type { IEducational } from "@/app/models/Educational";

interface EducationalAdminClientProps {
  adminEmail: string;
}

export default function EducationalAdminClient({ adminEmail }: EducationalAdminClientProps) {
  const [activeSection, setActiveSection] = useState<"add" | "manage">("manage");
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<IEducational[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<IEducational | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/educational');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar artigos');
      }

      const data = await response.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
      toast.error('Erro ao carregar artigos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle modal
  const openModal = (article: IEducational) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(false);
  };

  // Handle delete
  const handleDelete = async (slug: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;

    try {
      const response = await fetch(`/api/educational?slug=${slug}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setArticles(articles.filter(article => article.slug !== slug));
        toast.success("Artigo excluído com sucesso!");
        closeModal();
      } else {
        throw new Error("Erro ao excluir artigo");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir artigo");
    }
  };

  // Filter articles
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <Toaster position="top-right" />
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href="/admin/educational/new"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-white/20 text-white border border-white/30 hover:bg-white/30"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Artigo</span>
        </Link>
        <button
          onClick={() => setActiveSection("manage")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === "manage"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Gerenciar Existentes</span>
        </button>
      </div>

      {/* Manage Articles Section */}
      {activeSection === "manage" && (
        <EducationalContentManager
          articles={filteredArticles}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDelete={handleDelete}
          onRefresh={fetchArticles}
          onOpenModal={openModal}
        />
      )}

      {/* Modal */}
      {isModalOpen && selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

// Content Manager Component
interface EducationalContentManagerProps {
  articles: IEducational[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDelete: (slug: string) => void;
  onRefresh: () => void;
  onOpenModal: (article: IEducational) => void;
}

function EducationalContentManager({
  articles,
  isLoading,
  searchTerm,
  setSearchTerm,
  onDelete,
  onRefresh,
  onOpenModal,
}: EducationalContentManagerProps) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin mr-2" />
          <span className="text-white">Carregando artigos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <BookOpen className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
            Gerenciar Artigos
          </h3>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-white transition-all duration-200"
        >
          <RefreshCw className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
          <span className="hidden xs:inline">Atualizar</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Buscar por título, descrição ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 xs:pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 text-xs xs:text-sm h-8 xs:h-10 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none w-full rounded-lg"
            style={{ color: 'white' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/10 backdrop-blur-sm">
              <tr>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Artigo
                </th>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                  Autor
                </th>
                <th className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <BookOpen className="w-8 h-8 text-white/40 mb-2" />
                      <p className="text-white/80 text-sm">Nenhum artigo encontrado</p>
                      <p className="text-white/50 text-xs mt-1">Comece criando um novo artigo</p>
                    </div>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr 
                    key={article.slug} 
                    className="hover:bg-white/5 cursor-pointer transition-colors duration-200"
                    onClick={() => onOpenModal(article)}
                  >
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                        <div className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs xs:text-sm sm:text-base font-medium text-white truncate leading-tight">
                            {article.title}
                          </p>
                          <p className="text-xs text-white/60 truncate leading-tight">
                            {article.description}
                          </p>
                          <div className="sm:hidden mt-1">
                            <p className="text-xs text-white/50 leading-tight">
                              {article.author.name} • {new Date(article.publishedAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 xs:h-8 xs:w-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <Image
                            src={article.author.avatar}
                            alt={article.author.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <p className="text-xs xs:text-sm text-white/60 truncate">
                          {article.author.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-2 xs:py-3 sm:py-4 hidden md:table-cell">
                      <p className="text-xs xs:text-sm text-white/60">
                        {new Date(article.publishedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Article Modal Component
interface ArticleModalProps {
  article: IEducational;
  onClose: () => void;
  onDelete: (slug: string) => void;
}

function ArticleModal({ article, onClose, onDelete }: ArticleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Opções do Artigo</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Article Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">
                {article.title}
              </h4>
              <p className="text-xs text-white/60 truncate">
                {article.description}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/admin/educational/edit/${article.slug}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white"
            onClick={onClose}
          >
            <Edit2 className="h-4 w-4" />
            <span>Editar Artigo</span>
          </Link>
          
          <button
            onClick={() => onDelete(article.slug)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white"
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir Artigo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
