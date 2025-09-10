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
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-xl font-semibold">PDFs da Carteira de ETFs</h2> */}
        <button
          onClick={() => {
            resetForm();
            setShowPDFForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Adicionar PDF
        </button>
      </div>

      {showPDFForm && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">
            {editingPDF ? "Editar PDF" : "Adicionar Novo PDF"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL do Arquivo
              </label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingPDF ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowPDFForm(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {pdfs.map((pdf) => (
          <div
            key={pdf._id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-medium">{pdf.title}</h3>
                <p className="text-sm text-gray-500">{pdf.description}</p>
                <p className="text-xs text-gray-400">
                  Criado em: {formatDate(pdf.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(pdf)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                title="Editar"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(pdf._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                title="Excluir"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {pdfs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum PDF cadastrado.
          </div>
        )}
      </div>
    </div>
  );
} 