"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { FileText, Search, Plus, Edit2, Trash2, Loader2, RefreshCw, X } from "lucide-react";

interface RelevantFact {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  createdAt: string;
  author?: string;
  date?: string;
  time?: string;
  code?: string;
  premium?: boolean;
  tags?: string[];
}

interface RelevantFactData {
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  premium: boolean;
  tags: string[];
  url: string;
}

export default function RelevantFactsAdminClient() {
  const [activeSection, setActiveSection] = useState<"add" | "manage">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<RelevantFact | null>(null);
  const [relevantFactData, setRelevantFactData] = useState<RelevantFactData>({
    title: "",
    description: "",
    author: "Lucas FII",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "pdf",
    premium: false,
    tags: [],
    url: "",
  });
  const [tagInput, setTagInput] = useState("");

  const addTag = (tag: string) => {
    if (tag.trim()) {
      setRelevantFactData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setRelevantFactData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...relevantFactData,
        pdfUrl: relevantFactData.url,
      };

      const response = await fetch("/api/relevant-facts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Fato relevante criado com sucesso!");
        // Reset form
        setRelevantFactData({
          title: "",
          description: "",
          author: "Lucas FII",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString("pt-BR"),
          code: "N/D",
          type: "pdf",
          premium: false,
          tags: [],
          url: "",
        });
        setTagInput("");
      } else {
        toast.error("Erro ao criar fato relevante");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao criar fato relevante");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsLoading(true);

    try {
      const dataToSend = {
        ...relevantFactData,
        pdfUrl: relevantFactData.url,
      };

      const response = await fetch(`/api/relevant-facts/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Fato relevante atualizado com sucesso!");
        setEditingItem(null);
        // Reset form
        setRelevantFactData({
          title: "",
          description: "",
          author: "Lucas FII",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString("pt-BR"),
          code: "N/D",
          type: "pdf",
          premium: false,
          tags: [],
          url: "",
        });
        setTagInput("");
      } else {
        toast.error("Erro ao atualizar fato relevante");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao atualizar fato relevante");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: RelevantFact) => {
    setEditingItem(item);
    setActiveSection("add");
    
    setRelevantFactData({
      title: item.title,
      description: item.description || "",
      author: item.author || "Lucas FII",
      date: item.date || new Date().toISOString().split('T')[0],
      time: item.time || new Date().toLocaleTimeString("pt-BR"),
      code: item.code || "N/D",
      type: "pdf",
      premium: item.premium || false,
      tags: item.tags || [],
      url: item.pdfUrl || "",
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveSection("add")}
          className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg font-medium transition-all duration-200 text-sm xs:text-base ${
            activeSection === "add"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <span className="block xs:hidden">Adicionar PDF</span>
          <span className="hidden xs:block">Adicionar PDF</span>
        </button>
        <button
          onClick={() => setActiveSection("manage")}
          className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg font-medium transition-all duration-200 text-sm xs:text-base ${
            activeSection === "manage"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <span className="block xs:hidden">Gerenciar</span>
          <span className="hidden xs:block">Gerenciar Existentes</span>
        </button>
      </div>

      {/* Add Section */}
      {activeSection === "add" && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
                {editingItem ? "Editar PDF" : "Novo PDF"}
              </h3>
            </div>
            {editingItem && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setRelevantFactData({
                    title: "",
                    description: "",
                    author: "Lucas FII",
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString("pt-BR"),
                    code: "N/D",
                    type: "pdf",
                    premium: false,
                    tags: [],
                    url: "",
                  });
                  setTagInput("");
                }}
                className="bg-white/10 px-3 py-1.5 text-xs xs:text-sm font-medium text-white hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 w-full xs:w-auto"
              >
                <span className="block xs:hidden">Novo PDF</span>
                <span className="hidden xs:block">Novo PDF</span>
              </button>
            )}
          </div>

          {editingItem && (
            <div className="bg-blue-500/20 border border-blue-400/30 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-blue-200 text-sm sm:text-base">
                Você está editando: <strong>{editingItem.title}</strong>
              </p>
            </div>
          )}

          <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Título */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Título *
              </label>
              <input
                type="text"
                value={relevantFactData.title}
                onChange={(e) => setRelevantFactData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                placeholder="Digite o título do fato relevante"
                required
                style={{ color: 'white' }}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Descrição *
              </label>
              <textarea
                value={relevantFactData.description}
                onChange={(e) => setRelevantFactData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none resize-none"
                placeholder="Digite a descrição do fato relevante"
                rows={3}
                required
                style={{ color: 'white' }}
              />
            </div>

            {/* URL do PDF */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                URL do PDF *
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={relevantFactData.url}
                  onChange={(e) => setRelevantFactData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                  placeholder="https://exemplo.com/arquivo.pdf"
                  required
                  style={{ color: 'white' }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FileText className="w-4 h-4 xs:w-5 xs:h-5 text-white/50" />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs xs:text-sm sm:text-base font-medium text-white mb-1 xs:mb-2">
                Tags
              </label>
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  className="flex-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                  placeholder="Digite uma tag e pressione Enter"
                  style={{ color: 'white' }}
                />
                <Button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base"
                >
                  Adicionar
                </Button>
              </div>
              {relevantFactData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {relevantFactData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-md text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-white/70 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-4">
              <Button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setRelevantFactData({
                    title: "",
                    description: "",
                    author: "Lucas FII",
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString("pt-BR"),
                    code: "N/D",
                    type: "pdf",
                    premium: false,
                    tags: [],
                    url: "",
                  });
                  setTagInput("");
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-3 xs:px-4 py-2 text-xs xs:text-sm"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-3 xs:px-4 py-2 text-xs xs:text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingItem ? "Atualizando..." : "Criando..."}
                  </>
                ) : (
                  editingItem ? "Atualizar" : "Criar"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Section */}
      {activeSection === "manage" && (
        <RelevantFactsContentManager onEdit={handleEdit} />
      )}
    </>
  );
}

// Componente para gerenciar fatos relevantes existentes
function RelevantFactsContentManager({ onEdit }: { onEdit: (item: RelevantFact) => void }) {
  const [items, setItems] = useState<RelevantFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/relevant-facts");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Erro ao buscar fatos relevantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este fato relevante?")) return;

    try {
      const response = await fetch(`/api/relevant-facts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
      toast.success("Fato relevante excluído com sucesso!");
        fetchItems();
      } else {
        toast.error("Erro ao excluir fato relevante");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao excluir fato relevante");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin mr-2" />
          <span className="text-white">Carregando fatos relevantes...</span>
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
            <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
            Gerenciar PDFs
          </h3>
              </div>
                <button
          onClick={fetchItems}
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
            placeholder="Buscar por título ou descrição..."
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
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  PDF
                </th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                  Data
                </th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="w-8 h-8 text-white/40 mb-2" />
                      <p className="text-white/80 text-sm">Nenhum fato relevante encontrado</p>
                      <p className="text-white/50 text-xs mt-1">Comece criando um novo PDF</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4">
                      <div className="flex items-center gap-2 xs:gap-3">
                        <div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs xs:text-sm sm:text-base font-medium text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-white/60 truncate">
                            {item.description}
                          </p>
                          <div className="xs:hidden mt-1">
                            <p className="text-xs text-white/50">
                              {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 hidden sm:table-cell">
                      <p className="text-xs xs:text-sm text-white/60">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4">
                      <div className="flex items-center justify-end gap-1 xs:gap-1.5 sm:gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex items-center px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-1 xs:py-1.5 sm:py-2 text-xs rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white transition-all duration-200 min-w-0"
                        >
                          <Edit2 className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline ml-1 text-xs">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-1 xs:py-1.5 sm:py-2 text-xs rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white transition-all duration-200 min-w-0"
                        >
                          <Trash2 className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline ml-1 text-xs">Excluir</span>
                        </button>
                      </div>
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
