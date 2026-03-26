import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Settings, AlertTriangle, Info, XCircle, User, MoreVertical, Trash2, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { markAsRead, markAllAsRead, deleteNotification } from '../../redux/slices/notificationSlice';
import { Card } from '../../components/common';

/**
 * Trang Thông báo - Notifications Page
 * Giao diện glassmorphism với danh sách thông báo đầy đủ
 */
export const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector(state => state.notifications);

  const [activeTab, setActiveTab] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const typeStyles = {
    critical: {
      icon: XCircle,
      iconClassName: 'text-rose-500',
      chipClassName: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Nghiêm trọng'
    },
    warning: {
      icon: AlertTriangle,
      iconClassName: 'text-amber-500',
      chipClassName: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Cảnh báo'
    },
    info: {
      icon: Info,
      iconClassName: 'text-teal-500',
      chipClassName: 'bg-teal-50 text-teal-700 border-teal-200',
      label: 'Thông tin'
    },
    user: {
      icon: User,
      iconClassName: 'text-blue-500',
      chipClassName: 'bg-blue-50 text-blue-700 border-blue-200',
      label: 'Người dùng'
    }
  };

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'alerts':
        return notifications.filter(n => n.type === 'critical' || n.type === 'warning');
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      dispatch(deleteNotification(id));
      setDeletingId(null);
    }, 300);
  };

  const tabs = [
    { id: 'all', label: 'Tất cả', count: notifications.length },
    { id: 'unread', label: 'Chưa đọc', count: unreadCount },
    { id: 'alerts', label: 'Cảnh báo', count: notifications.filter(n => n.type === 'critical' || n.type === 'warning').length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Section */}
        <Card className="p-6 bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-100 p-2">
                <Bell className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
                <p className="text-sm text-slate-600">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCheck size={16} />
                Đánh dấu tất cả đã đọc
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Settings size={16} />
                Cài đặt
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 rounded-lg bg-slate-100 p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === tab.id ? 'bg-slate-200 text-slate-700' : 'bg-slate-300 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Notifications List */}
        <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-sm">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Không có thông báo</h3>
              <p className="mt-1 text-sm text-slate-600">
                {activeTab === 'unread' ? 'Tất cả thông báo đã được đọc' :
                 activeTab === 'alerts' ? 'Không có cảnh báo nào' :
                 'Hệ thống đang hoạt động ổn định'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const config = typeStyles[notification.type] || typeStyles.info;
                  const Icon = config.icon;
                  const isDeleting = deletingId === notification.id;

                  return (
                    <motion.article
                      key={notification.id}
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-6 transition-colors hover:bg-slate-50/50 ${
                        !notification.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`rounded-lg p-2 ${config.iconClassName.replace('text-', 'bg-').replace('-500', '-100')}`}>
                            <Icon size={20} className={config.iconClassName} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-slate-900">
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed mb-2">
                                {notification.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${config.chipClassName}`}>
                                  {config.label}
                                </span>
                                <time className="text-xs text-slate-500">
                                  {notification.time}
                                </time>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <div className="relative">
                                <button className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                  <MoreVertical size={16} />
                                </button>
                                {/* Dropdown menu would go here */}
                              </div>
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Xóa thông báo"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};