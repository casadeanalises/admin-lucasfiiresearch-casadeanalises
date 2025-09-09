"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/button';

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  link?: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/notifications?userId=admin')
      .then(res => res.json())
      .then(data => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notificação?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir');
      setNotifications(notifications.filter(n => n._id !== id));
    } catch {
      alert('Erro ao excluir notificação');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Tem certeza que deseja excluir TODAS as notificações? Esta ação não pode ser desfeita.')) return;
    setDeletingAll(true);
    try {
      const res = await fetch('/api/notifications', { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir todas as notificações');
      setNotifications([]);
    } catch {
      alert('Erro ao excluir todas as notificações');
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Notificações</h1>
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">{notifications.length}</span>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/notifications/new">
              <Button className="bg-white text-blue-900 hover:bg-blue-50">Adicionar Notificação</Button>
            </Link>
            <Button variant="destructive" onClick={handleDeleteAll} disabled={deletingAll || notifications.length === 0}>
              {deletingAll ? 'Excluindo tudo...' : 'Excluir Todas'}
            </Button>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-400 text-red-800 rounded">
            <strong>Aviso:</strong> Para evitar acúmulo de notificações na caixa dos usuários, recomenda-se remover/excluir todas as notificações a cada 1 mês.
          </div>
          <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
            <strong>Dica:</strong> Antes de enviar uma notificação, sempre verifique o titulo, descrição, tipo, icone e link da notificação!
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Nenhuma notificação encontrada.</div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((n) => (
                <li key={n._id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-100">
              {n.imageUrl && (
                <img src={n.imageUrl} alt="" className="w-16 h-16 object-cover rounded-md" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-lg">{n.title}</div>
                <div className="text-gray-600 text-sm mb-1">{n.description}</div>
                <div className="text-xs text-gray-400">{formatTimeAgo(n.createdAt)}</div>
                <div className="text-xs text-blue-600 mt-1">Tipo: {n.type}</div>
                {n.link && <a href={n.link} className="text-pink-600 hover:underline text-xs" target="_blank">Ver link</a>}
              </div>
              <div className="flex flex-col gap-2 min-w-[100px]">
                {/* <Link href={`/admin/notifications/edit/${n._id}`}>
                  <Button variant="outline" size="sm">Editar</Button>
                </Link> */}
                <Button variant="destructive" size="sm" onClick={() => handleDelete(n._id)} disabled={deleting === n._id}>
                  {deleting === n._id ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seg atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return date.toLocaleDateString('pt-BR');
} 