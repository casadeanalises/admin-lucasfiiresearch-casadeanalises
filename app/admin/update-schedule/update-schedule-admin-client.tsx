"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { 
  Calendar, 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  RefreshCw, 
  Loader2,
  Save,
  X
} from "lucide-react";

interface UpdateScheduleItem {
  _id: string;
  id?: string;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
  createdAt: string;
  type: "schedule";
}

interface PDF {
  _id: string;
  id?: string;
  title: string;
  description: string;
  url: string;
  date: string;
  category: string;
  createdAt: string;
  type: "pdf";
}

interface UpdateScheduleAdminClientProps {
  adminEmail: string;
}

export function UpdateScheduleAdminClient({ adminEmail }: UpdateScheduleAdminClientProps) {
  const [activeTab, setActiveTab] = useState<"schedule" | "pdf">("schedule");
  const [activeSection, setActiveSection] = useState<"add" | "manage">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<UpdateScheduleItem | PDF | null>(null);
  const [scheduleData, setScheduleData] = useState({
    title: "",
    description: "",
    date: "",
    status: "planned",
    category: "",
  });
  const [pdfData, setPdfData] = useState({
    title: "",
    description: "",
    url: "",
    date: "",
    category: "",
  });
  const [schedules, setSchedules] = useState<UpdateScheduleItem[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/update-schedule');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar atualizações');
      }

      const data = await response.json();
      const schedulesList = Array.isArray(data) ? data : [];
      const transformedSchedules = schedulesList.map((item: any) => ({
        ...item,
        id: item._id,
        type: "schedule" as const,
        createdAt: item.createdAt || new Date().toISOString(),
      }));
      
      setSchedules(transformedSchedules);
    } catch (error) {
      console.error('Erro ao carregar atualizações:', error);
      toast.error('Erro ao carregar atualizações');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch PDFs
  const fetchPdfs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/update-schedule-pdfs');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar PDFs');
      }

      const data = await response.json();
      const pdfsList = Array.isArray(data) ? data : [];
      const transformedPdfs = pdfsList.map((item: any) => ({
        ...item,
        id: item._id,
        type: "pdf" as const,
        createdAt: item.createdAt || new Date().toISOString(),
      }));
      
      setPdfs(transformedPdfs);
    } catch (error) {
      console.error('Erro ao carregar PDFs:', error);
      toast.error('Erro ao carregar PDFs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "schedule") {
      fetchSchedules();
    } else {
      fetchPdfs();
    }
  }, [activeTab]);

  // Handle submit (add new item)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isSchedule = activeTab === "schedule";
      const dataToSend = isSchedule ? scheduleData : pdfData;
      const endpoint = isSchedule ? '/api/update-schedule' : '/api/update-schedule-pdfs';

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar ${isSchedule ? 'atualização' : 'PDF'}`);
      }

      toast.success(`${isSchedule ? 'Atualização' : 'PDF'} adicionado com sucesso!`);
      if (isSchedule) {
        await fetchSchedules();
      } else {
        await fetchPdfs();
      }
      resetForm();
    } catch (error: any) {
      console.error(`Erro ao adicionar ${activeTab}:`, error);
      toast.error(error.message || `Erro ao adicionar ${activeTab === "schedule" ? "atualização" : "PDF"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);

    try {
      const isSchedule = editingItem.type === "schedule";
      const dataToSend = isSchedule ? scheduleData : pdfData;
      const endpoint = isSchedule 
        ? `/api/update-schedule/${editingItem._id}`
        : `/api/update-schedule-pdfs/${editingItem._id}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar ${isSchedule ? 'atualização' : 'PDF'}`);
      }

      toast.success(`${isSchedule ? 'Atualização' : 'PDF'} atualizado com sucesso!`);
      if (isSchedule) {
        await fetchSchedules();
      } else {
        await fetchPdfs();
      }
      resetForm();
    } catch (error: any) {
      console.error(`Erro ao atualizar ${editingItem.type}:`, error);
      toast.error(error.message || `Erro ao atualizar ${editingItem.type === "schedule" ? "atualização" : "PDF"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item: UpdateScheduleItem | PDF) => {
    setEditingItem(item);
    if (item.type === "schedule") {
      setScheduleData({
        title: item.title,
        description: item.description,
        date: new Date(item.date).toISOString().split('T')[0],
        status: (item as UpdateScheduleItem).status,
        category: item.category,
      });
    } else {
      const pdfItem = item as PDF;
      setPdfData({
        title: pdfItem.title,
        description: pdfItem.description,
        url: pdfItem.url,
        date: new Date(pdfItem.date).toISOString().split('T')[0],
        category: pdfItem.category,
      });
    }
    setActiveSection("add");
  };

  // Handle delete
  const handleDelete = async (id: string, type: "schedule" | "pdf") => {
    if (!confirm(`Tem certeza que deseja excluir este ${type === "schedule" ? "item" : "PDF"}?`)) return;

    try {
      const endpoint = type === "schedule" 
        ? `/api/update-schedule/${id}`
        : `/api/update-schedule-pdfs/${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir ${type === "schedule" ? "atualização" : "PDF"}`);
      }

      toast.success(`${type === "schedule" ? "Atualização" : "PDF"} excluído com sucesso!`);
      if (type === "schedule") {
        await fetchSchedules();
      } else {
        await fetchPdfs();
      }
    } catch (error) {
      console.error(`Erro ao excluir ${type}:`, error);
      toast.error(`Erro ao excluir ${type === "schedule" ? "atualização" : "PDF"}`);
    }
  };

  // Reset form
  const resetForm = () => {
    setScheduleData({
      title: "",
      description: "",
      date: "",
      status: "planned",
      category: "",
    });
    setPdfData({
      title: "",
      description: "",
      url: "",
      date: "",
      category: "",
    });
    setEditingItem(null);
  };

  // Filter items
  const filteredSchedules = schedules.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPdfs = pdfs.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Tabs Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
              activeTab === "schedule"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Atualizações</span>
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
              activeTab === "pdf"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>PDFs</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => setActiveSection("add")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === "add"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar {activeTab === "schedule" ? "Atualização" : "PDF"}</span>
        </button>
        <button
          onClick={() => setActiveSection("manage")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === "manage"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
        >
          {activeTab === "schedule" ? <Calendar className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          <span>Gerenciar Existentes</span>
        </button>
      </div>

      {/* Add Section */}
      {activeSection === "add" && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                {activeTab === "schedule" ? (
                  <Calendar className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
                {editingItem ? `Editar ${activeTab === "schedule" ? "Atualização" : "PDF"}` : `Adicionar Novo ${activeTab === "schedule" ? "Atualização" : "PDF"}`}
              </h3>
            </div>
            {editingItem && (
              <button
                onClick={resetForm}
                className="bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
              >
                Novo {activeTab === "schedule" ? "Atualização" : "PDF"}
              </button>
            )}
          </div>

          {/* Editing Alert */}
          {editingItem && (
            <div className="bg-blue-500/20 border border-blue-400/30 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-blue-200 text-sm">
                <strong>Editando:</strong> {editingItem.title}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="space-y-4 sm:space-y-6">
            {activeTab === "schedule" ? (
              // Schedule Form
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-white">
                      Título *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      placeholder="Digite o título da atualização"
                      value={scheduleData.title}
                      onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium text-white">
                      Data Prevista *
                    </label>
                    <input
                      type="date"
                      id="date"
                      required
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-white">
                    Descrição *
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    placeholder="Digite a descrição da atualização"
                    value={scheduleData.description}
                    onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none resize-none"
                    style={{ color: 'white' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium text-white">
                      Status *
                    </label>
                    <select
                      id="status"
                      required
                      value={scheduleData.status}
                      onChange={(e) => setScheduleData({ ...scheduleData, status: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    >
                      <option value="planned">Planejado</option>
                      <option value="in_progress">Em Progresso</option>
                      <option value="paused">Em Pausa</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-white">
                      Categoria *
                    </label>
                    <input
                      type="text"
                      id="category"
                      required
                      placeholder="Ex: Nova Funcionalidade, UI/UX"
                      value={scheduleData.category}
                      onChange={(e) => setScheduleData({ ...scheduleData, category: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              // PDF Form
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="pdfTitle" className="text-sm font-medium text-white">
                      Título *
                    </label>
                    <input
                      type="text"
                      id="pdfTitle"
                      required
                      placeholder="Digite o título do documento"
                      value={pdfData.title}
                      onChange={(e) => setPdfData({ ...pdfData, title: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pdfDate" className="text-sm font-medium text-white">
                      Data *
                    </label>
                    <input
                      type="date"
                      id="pdfDate"
                      required
                      value={pdfData.date}
                      onChange={(e) => setPdfData({ ...pdfData, date: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="pdfDescription" className="text-sm font-medium text-white">
                    Descrição *
                  </label>
                  <textarea
                    id="pdfDescription"
                    required
                    rows={4}
                    placeholder="Digite a descrição do documento"
                    value={pdfData.description}
                    onChange={(e) => setPdfData({ ...pdfData, description: e.target.value })}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none resize-none"
                    style={{ color: 'white' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="pdfUrl" className="text-sm font-medium text-white">
                      URL *
                    </label>
                    <input
                      type="url"
                      id="pdfUrl"
                      required
                      placeholder="Digite a URL do documento"
                      value={pdfData.url}
                      onChange={(e) => setPdfData({ ...pdfData, url: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pdfCategory" className="text-sm font-medium text-white">
                      Categoria *
                    </label>
                    <input
                      type="text"
                      id="pdfCategory"
                      required
                      placeholder="Digite a categoria do documento"
                      value={pdfData.category}
                      onChange={(e) => setPdfData({ ...pdfData, category: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    {editingItem ? "Atualizando..." : "Salvando..."}
                  </>
                ) : (
                  editingItem ? "Atualizar" : "Salvar"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Section */}
      {activeSection === "manage" && (
        <UpdateScheduleContentManager
          items={activeTab === "schedule" ? filteredSchedules : filteredPdfs}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={activeTab === "schedule" ? fetchSchedules : fetchPdfs}
          type={activeTab}
        />
      )}
    </div>
  );
}

// Content Manager Component
interface UpdateScheduleContentManagerProps {
  items: (UpdateScheduleItem | PDF)[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (item: UpdateScheduleItem | PDF) => void;
  onDelete: (id: string, type: "schedule" | "pdf") => void;
  onRefresh: () => void;
  type: "schedule" | "pdf";
}

function UpdateScheduleContentManager({
  items,
  isLoading,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
  onRefresh,
  type,
}: UpdateScheduleContentManagerProps) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin mr-2" />
          <span className="text-white">Carregando {type === "schedule" ? "atualizações" : "PDFs"}...</span>
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
            {type === "schedule" ? (
              <Calendar className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">
            Gerenciar {type === "schedule" ? "Atualizações" : "PDFs"}
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
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 xs:pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 text-xs xs:text-sm h-8 xs:h-10 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none w-full rounded-lg"
            style={{ color: 'white' }}
          />
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-8">
          {type === "schedule" ? (
            <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
          ) : (
            <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
          )}
          <p className="text-white/80 text-sm">Nenhum {type === "schedule" ? "item" : "PDF"} encontrado</p>
          <p className="text-white/50 text-xs mt-1">Comece criando um novo {type === "schedule" ? "item" : "PDF"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
            >
              {/* Item Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-2">
                    {type === "schedule" ? (
                      <Calendar className="h-5 w-5 text-white" />
                    ) : (
                      <FileText className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-white/60">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-medium text-white line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-white/60 line-clamp-2">
                  {item.description}
                </p>

                {type === "schedule" && (
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      (item as UpdateScheduleItem).status === 'planned'
                        ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                        : (item as UpdateScheduleItem).status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                          : (item as UpdateScheduleItem).status === 'paused'
                            ? 'bg-orange-500/20 text-orange-200 border border-orange-400/30'
                            : (item as UpdateScheduleItem).status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                              : 'bg-red-500/20 text-red-200 border border-red-400/30'
                    }`}>
                      {(item as UpdateScheduleItem).status === 'planned'
                        ? 'Planejado'
                        : (item as UpdateScheduleItem).status === 'in_progress'
                          ? 'Em Progresso'
                          : (item as UpdateScheduleItem).status === 'paused'
                            ? 'Em Pausa'
                            : (item as UpdateScheduleItem).status === 'completed'
                              ? 'Concluído'
                              : 'Cancelado'}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 text-xs font-medium text-white/70">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white transition-all duration-200"
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => onDelete(item._id, type)}
                  className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white transition-all duration-200"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}