"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { FileText, Plus, Pencil, Trash2, Calendar, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { toast } from "sonner";

interface PDF {
  _id: string;
  title: string;
  description: string;
  url: string;
  date: string;
  category: string;
}

export function PDFAdminClient() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDF | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    date: "",
    category: "",
  });

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      const response = await fetch('/api/update-schedule-pdfs');
      if (!response.ok) throw new Error('Erro ao buscar PDFs');
      const data = await response.json();
      setPdfs(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editingPdf
        ? `/api/update-schedule-pdfs/${editingPdf._id}`
        : '/api/update-schedule-pdfs';
      
      const method = editingPdf ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao salvar PDF');
      
      toast.success(editingPdf ? 'PDF editado com sucesso' : 'PDF criado com sucesso');
      setIsDialogOpen(false);
      resetForm();
      fetchPdfs();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao salvar PDF');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este PDF?')) return;

    try {
      const response = await fetch(`/api/update-schedule-pdfs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao remover PDF');
      
      toast.success('PDF removido com sucesso');
      fetchPdfs();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao remover PDF');
    }
  };

  const handleEdit = (pdf: PDF) => {
    setEditingPdf(pdf);
    // Ajusta o fuso horário para exibir a data correta
    const date = new Date(pdf.date);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    setFormData({
      title: pdf.title,
      description: pdf.description,
      url: pdf.url,
      date: date.toISOString().split('T')[0],
      category: pdf.category,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      date: "",
      category: "",
    });
    setEditingPdf(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPdf ? 'Editar Documento' : 'Novo Documento'}
              </DialogTitle>
              <DialogDescription>
                {editingPdf
                  ? 'Edite os detalhes do documento abaixo.'
                  : 'Adicione um novo documento ao cronograma.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-200">
                  Título
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Digite o título do documento"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">
                  Descrição
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Digite a descrição do documento"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">
                  URL
                </label>
                <Input
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="Digite a URL do documento"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">
                  Data
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">
                  Categoria
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Digite a categoria do documento"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingPdf ? 'Salvar Alterações' : 'Criar Documento'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pdfs.map((pdf) => (
          <div
            key={pdf._id}
            className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(new Date(pdf.date).getTime() + new Date().getTimezoneOffset() * 60000).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                  {pdf.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {pdf.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {pdf.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300"
              >
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visualizar
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(pdf)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(pdf._id)}
                className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {pdfs.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhum documento disponível
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Clique em "Novo Documento" para adicionar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
