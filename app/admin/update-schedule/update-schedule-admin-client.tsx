"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { toast } from "sonner";

interface UpdateScheduleItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
}

export function UpdateScheduleAdminClient() {
  const [items, setItems] = useState<UpdateScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UpdateScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    status: "planned",
    category: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/update-schedule');
      if (!response.ok) throw new Error('Erro ao buscar atualizações');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar atualizações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem
        ? `/api/update-schedule/${editingItem._id}`
        : '/api/update-schedule';

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao salvar atualização');

      toast.success(editingItem ? 'Atualização editada com sucesso' : 'Atualização criada com sucesso');
      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao salvar atualização');
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Tem certeza que deseja remover esta atualização?')) return;

    try {
      const response = await fetch(`/api/update-schedule/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao remover atualização');

      toast.success('Atualização removida com sucesso');
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao remover atualização');
    }
  };

  const handleEdit = (item: UpdateScheduleItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: new Date(item.date).toISOString().split('T')[0],
      status: item.status,
      category: item.category,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      status: "planned",
      category: "",
    });
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Atualização
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Atualização' : 'Nova Atualização'}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? 'Edite os detalhes da atualização abaixo.'
                  : 'Adicione uma nova atualização ao cronograma.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Título
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Digite o título da atualização"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Descrição
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Digite a descrição da atualização"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Data Prevista
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
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planejado</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="paused">Em Pausa</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">
                  Versão
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Digite a categoria (ex: Nova Funcionalidade, UI/UX)"
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
                  {editingItem ? 'Salvar Alterações' : 'Criar Atualização'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-500/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${item.status === 'planned'
                    ? 'bg-blue-500/20'
                    : item.status === 'in_progress'
                      ? 'bg-amber-500/20'
                      : item.status === 'paused'
                        ? 'bg-orange-500/20'
                        : item.status === 'completed'
                          ? 'bg-emerald-500/20'
                          : 'bg-red-500/20'
                    }`}>
                    <Calendar className={`h-5 w-5 ${item.status === 'planned'
                      ? 'text-blue-400'
                      : item.status === 'in_progress'
                        ? 'text-amber-400'
                        : item.status === 'paused'
                          ? 'text-orange-400'
                          : item.status === 'completed'
                            ? 'text-emerald-400'
                            : 'text-red-400'
                      }`} />
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === 'planned'
                      ? 'bg-blue-500/20 text-blue-300'
                      : item.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-300'
                        : item.status === 'paused'
                          ? 'bg-orange-500/20 text-orange-300'
                          : item.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                      }`}
                  >
                    {item.status === 'planned'
                      ? 'Planejado'
                      : item.status === 'in_progress'
                        ? 'Em Progresso'
                        : item.status === 'paused'
                          ? 'Em Pausa'
                          : item.status === 'completed'
                            ? 'Concluído'
                            : 'Cancelado'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleEdit(item)}
                className="flex-1 bg-white/5"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(item._id)}
                className="bg-white/5 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
