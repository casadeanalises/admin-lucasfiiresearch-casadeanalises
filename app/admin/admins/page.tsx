"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaUserPlus } from "react-icons/fa";

interface Admin {
  _id: string;
  email: string;
  createdAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [newAdminData, setNewAdminData] = useState({ email: "", password: "" });
  const [editPassword, setEditPassword] = useState("");

 
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/list", {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar administradores");
      }

      setAdmins(data.admins);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar administradores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newAdminData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao adicionar administrador");
      }

      setShowAddModal(false);
      setNewAdminData({ email: "", password: "" });
      fetchAdmins();
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar administrador");
      console.error(err);
    }
  };


  const handleDeleteAdmin = async (adminId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este administrador?"))
      return;

    try {
      const response = await fetch(`/api/admin/delete/${adminId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      fetchAdmins();
    } catch (err) {
      setError("Erro ao excluir administrador");
      console.error(err);
    }
  };

  
  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const updateData: any = { email: selectedAdmin.email };

      
      if (editPassword) {
        updateData.password = editPassword;
      }

      const response = await fetch(`/api/admin/update/${selectedAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setShowEditModal(false);
      setSelectedAdmin(null);
      setEditPassword("");
      fetchAdmins();
    } catch (err) {
      setError("Erro ao atualizar administrador");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Administradores</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          <FaUserPlus /> Novo Admin
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="whitespace-nowrap px-6 py-4">{admin.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Adicionar Administrador</h2>
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) =>
                    setNewAdminData({ ...newAdminData, email: e.target.value })
                  }
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Senha
                </label>
                <input
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) =>
                    setNewAdminData({
                      ...newAdminData,
                      password: e.target.value,
                    })
                  }
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Editar Administrador</h2>
            <form onSubmit={handleEditAdmin}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedAdmin.email}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      email: e.target.value,
                    })
                  }
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Nova Senha (deixe em branco para manter a atual)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Digite a nova senha ou deixe em branco"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmin(null);
                    setEditPassword("");
                  }}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
