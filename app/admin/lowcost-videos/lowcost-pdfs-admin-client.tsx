"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, TrashIcon, FileText, Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { Toaster } from "sonner";
import { formatDate } from "@/lib/utils/formatters";

interface LowcostPDF {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
  active: boolean;
}

export default function LowcostPDFsAdminClient() {
  const [pdfs, setPdfs] = useState<LowcostPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPDF, setEditingPDF] = useState<LowcostPDF | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/lowcost-pdfs");
      if (!response.ok) throw new Error("Erro ao carregar PDFs");
      const data = await response.json();
      setPdfs(data.pdfs || []);
    } catch (error) {
      console.error("Erro ao buscar PDFs:", error);
      toast.error("Erro ao carregar PDFs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingPDF ? "PUT" : "POST";
      const url = "/api/lowcost-pdfs";
      const body = editingPDF
        ? { id: editingPDF._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao salvar PDF");

      await fetchPDFs();
      setIsModalOpen(false);
      resetForm();
      toast.success(editingPDF ? "PDF atualizado com sucesso!" : "PDF adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
      toast.error("Erro ao salvar PDF");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este PDF?")) return;

    try {
      const response = await fetch(`/api/lowcost-pdfs?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover PDF");

      await fetchPDFs();
      toast.success("PDF removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover PDF:", error);
      toast.error("Erro ao remover PDF");
    }
  };

  const handleEdit = (pdf: LowcostPDF) => {
    setEditingPDF(pdf);
    setFormData({
      title: pdf.title,
      description: pdf.description,
      fileUrl: pdf.fileUrl,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", fileUrl: "" });
    setEditingPDF(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {/* <h2 className="text-2xl font-bold">PDFs Lowcost</h2>
          <p className="text-gray-600">Gerencie os PDFs da carteira lowcost</p> */}
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Adicionar PDF
        </Button>
      </div>

      {/* Lista de PDFs */}
      <div className="grid gap-4">
        {pdfs.map((pdf) => (
          <div key={pdf._id} className="border rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{pdf.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{pdf.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Criado em: {formatDate(pdf.createdAt)}
              </p>
              <a 
                href={pdf.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Ver PDF
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(pdf)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(pdf._id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Adicionar/Editar PDF */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPDF ? "Editar PDF" : "Adicionar Novo PDF"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do PDF lowcost
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do PDF"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do PDF"
                required
              />
            </div>
            <div>
              <Label htmlFor="fileUrl">URL do Arquivo</Label>
              <Input
                id="fileUrl"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="URL do arquivo PDF"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : editingPDF ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 