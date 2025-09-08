import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './ui/sheet';
import { Bell, X } from 'lucide-react';
import Image from 'next/image';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotificationsUpdate?: () => void;
}

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  link?: string;
  createdAt: string;
  usersRead: string[];
}

export default function NotificationDrawer({ open, onOpenChange, onNotificationsUpdate }: NotificationDrawerProps) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    setLoading(true);
    fetch(`/api/notifications?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .finally(() => setLoading(false));
  }, [user, open]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, usersRead: [...n.usersRead, user.id] } : n));
    onNotificationsUpdate?.();
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });
    setNotifications(prev => prev.map(n => ({ ...n, usersRead: [...new Set([...n.usersRead, user.id])] })));
    onNotificationsUpdate?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          {/* <div className="flex items-center gap-2 text-xl font-bold">
            <Bell className="h-6 w-6 text-pink-500" /> Notificações
          </div> */}
          <div className="flex items-center gap-2">
            <button
              className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition border border-blue-200"
              onClick={markAllAsRead}
              disabled={notifications.length === 0 || notifications.every(n => n.usersRead.includes(user?.id || ''))}
            >
              Marcar tudo como lido
            </button>
            {/* <SheetClose asChild>
              <button className="text-gray-400 hover:text-gray-700 transition">
                <X className="h-6 w-6" />
              </button>
            </SheetClose> */}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto h-[calc(100vh-72px)] scroll-smooth pr-2 hide-scrollbar">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Nenhuma notificação encontrada.</div>
          ) : (
            <ul className="space-y-4 pb-8">
              {notifications.map((n) => {
                const isRead = n.usersRead.includes(user?.id || '');
                return (
                  <li
                    key={n._id}
                    className={`rounded-lg border p-4 flex gap-4 items-start transition shadow-sm ${
                      !isRead
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-blue-100 bg-white'
                    }`}
                    onClick={() => { if (!isRead) markAsRead(n._id); }}
                    style={{ cursor: !isRead ? 'pointer' : 'default' }}
                  >
                    {n.imageUrl && (
                      <div className="flex-shrink-0">
                        <Image src={n.imageUrl} alt="" width={56} height={56} className="rounded-md object-cover w-14 h-14" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-900">{n.title}</span>
                        {!isRead && <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 inline-block"></span>}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">{n.description}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {formatTimeAgo(n.createdAt)}
                        {n.link && (
                          <a
                            href={n.link}
                            className="ml-4 text-blue-600 hover:underline font-medium"
                          >
                            Ver mais
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
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