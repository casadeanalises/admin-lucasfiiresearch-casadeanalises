"use client";

import React, { useState, useEffect } from "react";
import { FileText, Trash2, Edit2, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";

interface EtfPDF {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
  active: boolean;
}

export default function EtfPDFsAdminClient() {
  const [pdfs, setPdfs] = useState<EtfPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPDF, setEditingPDF] = useState<EtfPDF | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
  });
  const [showPDFForm, setShowPDFForm] = useState(false);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await fetch("/api/etf-pdfs");
      if (!response.ok) throw new Error("Erro ao carregar PDFs");
      const data = await response.json();
      setPdfs(data.pdfs);
    } catch (error) {
      console.error("Erro ao buscar PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingPDF ? "PUT" : "POST";
      const url = "/api/etf-pdfs";
      const body = editingPDF
        ? { ...formData, _id: editingPDF._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao salvar PDF");

      await fetchPDFs();
      resetForm();
      setShowPDFForm(false);
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este PDF?")) return;

    try {
      const response = await fetch(`/api/etf-pdfs?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir PDF");

      await fetchPDFs();
    } catch (error) {
      console.error("Erro ao excluir PDF:", error);
    }
  };

  const handleEdit = (pdf: EtfPDF) => {
    setEditingPDF(pdf);
    setFormData({
      title: pdf.title,
      description: pdf.description,
      fileUrl: pdf.fileUrl,
    });
    setShowPDFForm(true);
  };

  const resetForm = () => {
    setEditingPDF(null);
    setFormData({
      title: "",
      description: "",
      fileUrl: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            resetForm();
            setShowPDFForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Adicionar PDF</span>
        </button>
      </div>

      {showPDFForm && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
            {editingPDF ? "Editar PDF" : "Adicionar Novo PDF"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                placeholder="Digite o título do PDF"
                required
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                placeholder="Digite a descrição do PDF"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                URL do Arquivo
              </label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none"
                placeholder="https://exemplo.com/arquivo.pdf"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                {editingPDF ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowPDFForm(false);
                }}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {pdfs.map((pdf) => (
          <div
            key={pdf._id}
            className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-4 sm:p-6 transition-all hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-2 sm:p-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm sm:text-base truncate">{pdf.title}</h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 line-clamp-2">{pdf.description}</p>
                  <p className="text-xs text-white/60 mt-1">
                    Criado em: {formatDate(pdf.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(pdf)}
                  className="rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 p-2 text-white transition-all duration-200"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(pdf._id)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 p-2 text-white transition-all duration-200"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {pdfs.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-4 sm:p-6">
              <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/80 text-sm sm:text-base">Nenhum PDF cadastrado</p>
              <p className="text-white/50 text-xs sm:text-sm mt-1">Adicione o primeiro PDF para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 