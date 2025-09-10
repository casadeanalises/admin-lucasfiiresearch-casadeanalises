"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { toast } from "sonner";
import { FileText, Calendar, Search, X, Plus } from "lucide-react";

interface RelevantFact {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  createdAt: string;
}

export default function RelevantFactsAdminClient() {
  const [relevantFacts, setRelevantFacts] = useState<RelevantFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFact, setEditingFact] = useState<RelevantFact | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdfUrl: "",
  });
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchRelevantFacts();
  }, []);

  const fetchRelevantFacts = async () => {
    try {
      const response = await fetch("/api/relevant-facts");
      const data = await response.json();
      console.log("Dados carregados:", data);
      console.log("Primeiro fato:", data[0]);
      setRelevantFacts(data);
    } catch (error) {
      console.error("Erro ao carregar fatos relevantes:", error);
      toast.error("Erro ao carregar fatos relevantes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Editando fato:", editingFact);
      console.log("ID do fato sendo editado:", editingFact?.id);
      
      const url = editingFact
        ? `/api/relevant-facts/${editingFact.id}`
        : "/api/relevant-facts";
      const method = editingFact ? "PUT" : "POST";
      
      console.log("URL da requisição:", url);
      console.log("Método:", method);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao salvar fato relevante");

      toast.success(
        editingFact
          ? "Fato relevante atualizado com sucesso!"
          : "Fato relevante criado com sucesso!"
      );
      setIsDialogOpen(false);
      setEditingFact(null);
      setFormData({ title: "", description: "", pdfUrl: "" });
      fetchRelevantFacts();
    } catch (error) {
      console.error("Erro ao salvar fato relevante:", error);
      toast.error("Erro ao salvar fato relevante");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este fato relevante?")) return;

    try {
      const response = await fetch(`/api/relevant-facts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir fato relevante");

      toast.success("Fato relevante excluído com sucesso!");
      fetchRelevantFacts();
    } catch (error) {
      console.error("Erro ao excluir fato relevante:", error);
      toast.error("Erro ao excluir fato relevante");
    }
  };

  const handleEdit = (fact: RelevantFact) => {
    setEditingFact(fact);
    setFormData({
      title: fact.title,
      description: fact.description,
      pdfUrl: fact.pdfUrl,
    });
    setIsDialogOpen(true);
  };

  // Filtragem
  const filteredFacts = relevantFacts.filter((fact) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      fact.title.toLowerCase().includes(s) ||
      fact.description.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
          <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          Carregando Fatos Relevantes...
        </h3>
        <p className="text-white/70 text-sm sm:text-base">
          Aguarde enquanto preparamos os documentos para você
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Cabeçalho com Busca e Botão Adicionar */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row items-center">
            {/* Busca */}
            <div className="relative flex-grow w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-2.5 sm:py-3 pl-10 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
              />
              {search && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearch("")}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-white/60 hover:text-white transition-colors" />
                </button>
              )}
            </div>

            {/* Botão Adicionar */}
            <button
              onClick={() => {
                setEditingFact(null);
                setFormData({ title: '', description: '', pdfUrl: '' });
                setIsDialogOpen(true);
              }}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Adicionar Fato Relevante</span>
            </button>
          </div>
        </div>

        {/* Lista de Fatos Relevantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredFacts.slice(0, visibleCount).map((fact) => (
            <div
              key={fact.id}
              className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-4 sm:p-6 transition-all hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-2 sm:p-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-blue-200 transition-colors text-sm sm:text-base line-clamp-2">
                    {fact.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/70 line-clamp-2">
                    {fact.description}
                  </p>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs text-white/60">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {new Date(fact.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(fact)}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(fact.id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Carregar Mais */}
        {filteredFacts.length > visibleCount && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-lg font-medium transition-all duration-200"
            >
              Carregar Mais
            </button>
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
              {editingFact ? "Editar Fato Relevante" : "Novo Fato Relevante"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Título
              </label>
              <Input
                placeholder="Digite o título do fato relevante"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Descrição
              </label>
              <Textarea
                placeholder="Digite a descrição do fato relevante"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                URL do PDF
              </label>
              <Input
                placeholder="https://exemplo.com/documento.pdf"
                value={formData.pdfUrl}
                onChange={(e) =>
                  setFormData({ ...formData, pdfUrl: e.target.value })
                }
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                {editingFact ? "Salvar Alterações" : "Criar"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 
