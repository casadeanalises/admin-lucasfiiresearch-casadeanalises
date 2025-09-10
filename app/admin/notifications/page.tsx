"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/button';
import { Badge } from '@/app/_components/ui/badge';
import { Card, CardContent, CardHeader } from '@/app/_components/ui/card';
import {
  Bell,
  Plus,
  Trash2,
  AlertTriangle,
  Lightbulb,
  Megaphone,
  Video,
  FileText,
  ExternalLink,
  Clock,
  Calendar,
  Loader2
} from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  link?: string;
  createdAt: string;
}

// Função para obter ícone baseado no tipo
const getNotificationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'anuncio':
    case 'anúncio':
      return <Megaphone className="w-6 h-6 text-orange-600" />;
    case 'video':
    case 'vídeo':
      return <Video className="w-6 h-6 text-blue-600" />;
    case 'relatorio':
    case 'relatório':
      return <FileText className="w-6 h-6 text-green-600" />;
    case 'cupom':
      return <Bell className="w-6 h-6 text-purple-600" />;
    default:
      return <Bell className="w-6 h-6 text-gray-600" />;
  }
};

// Função para obter cor do badge baseado no tipo
const getNotificationBadgeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'anuncio':
    case 'anúncio':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'video':
    case 'vídeo':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'relatorio':
    case 'relatório':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cupom':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-6">
          {/* Title and Icon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Gerenciar Notificações
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Controle e monitore todas as notificações do sistema
              </p>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <Badge variant="secondary" className="text-sm sm:text-base px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 border-blue-200 w-fit">
              {notifications.length} {notifications.length === 1 ? 'Notificação' : 'Notificações'}
            </Badge>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link href="/admin/notifications/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Nova Notificação</span>
                  <span className="xs:hidden">Nova</span>
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                disabled={deletingAll || notifications.length === 0}
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                {deletingAll ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                <span className="hidden xs:inline">
                  {deletingAll ? 'Excluindo...' : 'Excluir Todas'}
                </span>
                <span className="xs:hidden">
                  {deletingAll ? 'Excluindo...' : 'Excluir'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div className="border-l-4 border-l-red-500 p-4 sm:p-6 rounded-lg">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-red-100/80 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-red-900 mb-2 text-sm sm:text-base">Aviso Importante</h3>
                <p className="text-red-800 text-xs sm:text-sm leading-relaxed">
                  Para evitar acúmulo de notificações na caixa dos usuários, recomenda-se remover/excluir todas as notificações a cada 1 mês.
                </p>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-l-amber-500 p-4 sm:p-6 rounded-lg">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-amber-100/80 rounded-lg flex-shrink-0">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-amber-900 mb-2 text-sm sm:text-base">Dica de Qualidade</h3>
                <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                  Antes de enviar uma notificação, sempre verifique o título, descrição, tipo, ícone e link da notificação!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div>
          <div className="pb-3 sm:pb-4 px-4 sm:px-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Lista de Notificações</h2>
          </div>
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="flex items-center gap-3 text-gray-500">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  <span className="text-sm sm:text-base lg:text-lg">Carregando notificações...</span>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="p-3 sm:p-4 bg-blue-100/50 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Comece criando sua primeira notificação</p>
                <Link href="/admin/notifications/new">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base shadow-lg hover:shadow-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden xs:inline">Criar Primeira Notificação</span>
                    <span className="xs:hidden">Criar Notificação</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div
                    key={notification._id}
                    className="group hover:shadow-lg transition-all duration-300 border border-gray-200/30 hover:border-gray-300/50 rounded-lg p-6"
                  >
                      <div className="flex items-start gap-6">
                        {/* Icon and Image */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {notification.imageUrl ? (
                              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                                <img
                                  src={notification.imageUrl}
                                  alt={notification.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                {notification.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {notification.description}
                              </p>
                            </div>

                            {/* Type Badge */}
                            <Badge
                              variant="outline"
                              className={`${getNotificationBadgeColor(notification.type)} border font-medium`}
                            >
                              {notification.type}
                            </Badge>
                          </div>

                          {/* Meta Information */}
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(notification.createdAt)}</span>
                            </div>
                            {notification.link && (
                              <a
                                href={notification.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Ver Link
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(notification._id)}
                            disabled={deleting === notification._id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:shadow-md"
                          >
                            {deleting === notification._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">
                              {deleting === notification._id ? 'Excluindo...' : 'Excluir'}
                            </span>
                          </Button>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
