"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDemoStore } from "@/lib/data/store";
import { PageSpinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  Calendar,
  FileText,
  Video,
  Pill,
  AlertCircle,
  Info
} from "lucide-react";

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const notifications = useDemoStore((s) => s.notifications);
  const markNotificationRead = useDemoStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useDemoStore((s) => s.markAllNotificationsRead);
  const dismissNotification = useDemoStore((s) => s.dismissNotification);
  const clearReadNotifications = useDemoStore((s) => s.clearReadNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <PageSpinner label="Loading notifications…" />;

  const filteredNotifications = notifications
    .filter(n => {
      if (filter === 'unread') return !n.read;
      if (filter === 'read') return n.read;
      return true;
    })
    .filter(n => {
      if (typeFilter === 'all') return true;
      return n.type === typeFilter;
    });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = markNotificationRead;
  const markAllAsRead = markAllNotificationsRead;
  const deleteNotification = dismissNotification;
  const clearAllRead = clearReadNotifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-brand-600" />;
      case 'prescription':
        return <Pill className="w-5 h-5 text-emerald-600" />;
      case 'record':
        return <FileText className="w-5 h-5 text-brand-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-brand-600" />;
      case 'system':
        return <Info className="w-5 h-5 text-slate-500" />;
      default:
        return <Bell className="w-5 h-5 text-brand-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-slate-200 border-l-red-500 bg-white';
      case 'medium':
        return 'border-l-4 border-slate-200 border-l-amber-500 bg-white';
      default:
        return 'border-l-4 border-slate-200 border-l-brand-500 bg-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-slate-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 rounded-lg border border-slate-200">
              <Bell className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink">Notifications</h1>
              <p className="text-slate-600 mt-1">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} className="bg-brand-500 hover:bg-brand-600">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Button onClick={clearAllRead} className="bg-red-500 hover:bg-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Read
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-brand-600" />
            <div>
              <p className="text-2xl font-bold text-ink">{notifications.length}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-ink">{unreadCount}</p>
              <p className="text-sm text-slate-500">Unread</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCheck className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-ink">{notifications.filter(n => n.read).length}</p>
              <p className="text-sm text-slate-500">Read</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-ink">{notifications.filter(n => n.priority === 'high').length}</p>
              <p className="text-sm text-slate-500">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="text-slate-600 font-medium">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-brand-600' : 'bg-mist text-slate-700 hover:bg-slate-200'}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-brand-600' : 'bg-mist text-slate-700 hover:bg-slate-200'}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              onClick={() => setFilter('read')}
              className={filter === 'read' ? 'bg-brand-600' : 'bg-mist text-slate-700 hover:bg-slate-200'}
            >
              Read
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setTypeFilter('all')}
              className={typeFilter === 'all' ? 'bg-brand-500' : 'bg-mist text-slate-700 hover:bg-slate-200'}
            >
              All Types
            </Button>
            <Button
              onClick={() => setTypeFilter('appointment')}
              className={typeFilter === 'appointment' ? 'bg-brand-500' : 'bg-mist text-slate-700 hover:bg-slate-200'}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Appointments
            </Button>
            <Button
              onClick={() => setTypeFilter('prescription')}
              className={typeFilter === 'prescription' ? 'bg-brand-500' : 'bg-mist text-slate-700 hover:bg-slate-200'}
            >
              <Pill className="w-4 h-4 mr-1" />
              Prescriptions
            </Button>
            <Button
              onClick={() => setTypeFilter('record')}
              className={typeFilter === 'record' ? 'bg-brand-500' : 'bg-mist text-slate-700 hover:bg-slate-200'}
            >
              <FileText className="w-4 h-4 mr-1" />
              Records
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
            <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No notifications found</p>
            <p className="text-slate-500 text-sm mt-2">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg p-4 border transition-all ${
                !notification.read
                  ? getPriorityColor(notification.priority)
                  : 'border-slate-200 bg-white opacity-70'
              } ${!notification.read ? 'shadow-sm' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${
                  !notification.read ? 'bg-white' : 'bg-white'
                } border ${
                  !notification.read ? 'border-slate-200' : 'border-slate-200'
                }`}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        !notification.read ? 'text-ink' : 'text-slate-600'
                      }`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-brand-400 rounded-full"></span>
                        )}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>

                    {/* Priority Badge */}
                    {notification.priority === 'high' && !notification.read && (
                      <span className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-600 text-xs font-medium">
                        High Priority
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {notification.actionUrl && (
                      <Button
                        onClick={() => router.push(notification.actionUrl!)}
                        className="bg-brand-600 hover:bg-brand-700 text-sm py-1 px-3"
                      >
                        View Details
                      </Button>
                    )}
                    {!notification.read && (
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        className="bg-brand-500 hover:bg-brand-600 text-sm py-1 px-3"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteNotification(notification.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-600 border border-red-500/50 text-sm py-1 px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
