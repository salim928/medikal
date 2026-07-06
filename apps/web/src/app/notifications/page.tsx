"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Notification {
  id: string;
  type: 'appointment' | 'prescription' | 'record' | 'system' | 'video';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'Your video consultation with Dr. Sarah Smith is scheduled for tomorrow at 2:00 PM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/appointments/1',
    priority: 'high'
  },
  {
    id: '2',
    type: 'prescription',
    title: 'Prescription Ready',
    message: 'Your prescription for Amoxicillin is ready for pickup at CVS Pharmacy',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/prescriptions/1',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'record',
    title: 'Lab Results Available',
    message: 'Your blood test results from October 15 are now available to view',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/records/3',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'video',
    title: 'Consultation Recording Available',
    message: 'The recording of your consultation with Dr. Michael Johnson is now available',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/consultation/5',
    priority: 'low'
  },
  {
    id: '6',
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: 'Your appointment on October 20 at 10:00 AM has been confirmed',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/appointments/6',
    priority: 'low'
  },
  {
    id: '7',
    type: 'prescription',
    title: 'Prescription Expiring Soon',
    message: 'Your prescription for Lisinopril will expire in 7 days. Request a refill.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/prescriptions/2',
    priority: 'medium'
  },
];

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

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

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-brand-600" />;
      case 'prescription':
        return <Pill className="w-5 h-5 text-green-400" />;
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
        return 'border-red-500/50 bg-red-500/5';
      case 'medium':
        return 'border-yellow-500/50 bg-yellow-500/5';
      default:
        return 'border-slate-200 bg-mist';
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

        <div className="bg-white border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCheck className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-ink">{notifications.filter(n => n.read).length}</p>
              <p className="text-sm text-slate-500">Read</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-yellow-400" />
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
              className={filter === 'all' ? 'bg-brand-600' : 'bg-mist'}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-brand-600' : 'bg-mist'}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              onClick={() => setFilter('read')}
              className={filter === 'read' ? 'bg-brand-600' : 'bg-mist'}
            >
              Read
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setTypeFilter('all')}
              className={typeFilter === 'all' ? 'bg-brand-500' : 'bg-mist'}
            >
              All Types
            </Button>
            <Button
              onClick={() => setTypeFilter('appointment')}
              className={typeFilter === 'appointment' ? 'bg-brand-500' : 'bg-mist'}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Appointments
            </Button>
            <Button
              onClick={() => setTypeFilter('prescription')}
              className={typeFilter === 'prescription' ? 'bg-brand-500' : 'bg-mist'}
            >
              <Pill className="w-4 h-4 mr-1" />
              Prescriptions
            </Button>
            <Button
              onClick={() => setTypeFilter('record')}
              className={typeFilter === 'record' ? 'bg-brand-500' : 'bg-mist'}
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
                  : 'border-slate-200 bg-white/20'
              } ${!notification.read ? 'shadow-lg' : ''}`}
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
