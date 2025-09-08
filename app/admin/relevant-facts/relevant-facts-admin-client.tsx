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
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 rounded-full bg-[#172039] flex items-center justify-center mb-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent"></div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Carregando Fatos Relevantes...
        </h3>
        <p className="text-gray-400">
          Aguarde enquanto preparamos os documentos para você
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Cabeçalho com Busca e Botão Adicionar */}
        <div className="rounded-2xl bg-[#0c1424] p-6 shadow-lg border border-[#1c3276]/30">
          <div className="flex flex-col gap-4 lg:flex-row items-center">
            {/* Busca */}
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-xl border border-[#1c3276] bg-[#172039] py-3 pl-10 pr-10 text-white placeholder-gray-400 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all"
              />
              {search && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearch("")}
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                </button>
              )}
            </div>

            {/* Botão Adicionar */}
            <Button
              onClick={() => {
                setEditingFact(null);
                setFormData({ title: '', description: '', pdfUrl: '' });
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#2563eb]/90 text-white px-6"
            >
              <Plus className="h-5 w-5" />
              Adicionar Fato Relevante
            </Button>
          </div>
        </div>

        {/* Lista de Fatos Relevantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacts.slice(0, visibleCount).map((fact) => (
            <Card
              key={fact.id}
              className="group relative overflow-hidden rounded-2xl border border-[#1c3276]/30 bg-[#0c1424] p-6 transition-all hover:border-[#2563eb]/30 hover:bg-[#131b2e]"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-[#1c3276]/30 bg-[#172039] p-2">
                  <FileText className="h-6 w-6 text-[#2563eb]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-[#2563eb] transition-colors">
                    {fact.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {fact.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(fact.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      onClick={() => handleEdit(fact)}
                      className="flex-1 bg-[#172039] text-white hover:bg-[#1c2847] border border-[#2563eb]/20 hover:border-[#2563eb]/40"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(fact.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Botão Carregar Mais */}
        {filteredFacts.length > visibleCount && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              variant="outline"
              className="px-6"
            >
              Carregar Mais
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0c1424] border border-[#1c3276]/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              {editingFact ? "Editar Fato Relevante" : "Novo Fato Relevante"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Título"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-[#172039] border-[#1c3276] text-white placeholder-gray-400 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
              />
            </div>
            <div>
              <Textarea
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-[#172039] border-[#1c3276] text-white placeholder-gray-400 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
              />
            </div>
            <div>
              <Input
                placeholder="URL do PDF"
                value={formData.pdfUrl}
                onChange={(e) =>
                  setFormData({ ...formData, pdfUrl: e.target.value })
                }
                className="bg-[#172039] border-[#1c3276] text-white placeholder-gray-400 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-[#172039] text-white hover:bg-[#1c2847] border-[#1c3276]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white"
              >
                {editingFact ? "Salvar Alterações" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 
