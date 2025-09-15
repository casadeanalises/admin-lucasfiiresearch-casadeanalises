"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Save
} from "lucide-react";

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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/70">Carregando administradores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">

        <br />

        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                Administradores
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mt-1">
                Gerencie usuários com acesso administrativo
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 transition-all duration-200 w-full xs:w-auto"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="hidden xs:inline">Novo Admin</span>
            <span className="xs:hidden">Novo</span>
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Admins Table */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/10 backdrop-blur-sm border-b border-white/20">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Email</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider hidden sm:table-cell">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">Data de Criação</span>
                      <span className="md:hidden">Data</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex-shrink-0">
                          <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm md:text-base text-white font-medium block truncate">
                            {admin.email}
                          </span>
                          <span className="text-xs text-white/60 sm:hidden">
                            {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-xs sm:text-sm text-white/70">
                        {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowEditModal(true);
                          }}
                          size="sm"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-400/30 hover:border-blue-400/50 p-1.5 sm:p-2"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          size="sm"
                          className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-400/30 hover:border-red-400/50 p-1.5 sm:p-2"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {admins.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white/70" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">Nenhum administrador encontrado</h3>
            <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 px-4">Comece adicionando um novo administrador ao sistema.</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Adicionar Primeiro Admin</span>
              <span className="sm:hidden">Adicionar Admin</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-3 sm:p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Adicionar Administrador</span>
                  <span className="xs:hidden">Novo Admin</span>
                </h2>
                <Button
                  onClick={() => setShowAddModal(false)}
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-1.5 sm:p-2"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block font-medium text-white mb-2 text-sm sm:text-base">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) =>
                      setNewAdminData({ ...newAdminData, email: e.target.value })
                    }
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    placeholder="admin@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-white mb-2 text-sm sm:text-base">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
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
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    placeholder="Senha segura"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-400/30 w-full sm:w-auto"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-3 sm:p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Editar Administrador</span>
                  <span className="xs:hidden">Editar Admin</span>
                </h2>
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmin(null);
                    setEditPassword("");
                  }}
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-1.5 sm:p-2"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              <form onSubmit={handleEditAdmin} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block font-medium text-white mb-2 text-sm sm:text-base">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
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
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-white mb-2 text-sm sm:text-base">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    placeholder="Deixe em branco para manter a atual"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Deixe em branco para manter a senha atual
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAdmin(null);
                      setEditPassword("");
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-400/30 w-full sm:w-auto"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}