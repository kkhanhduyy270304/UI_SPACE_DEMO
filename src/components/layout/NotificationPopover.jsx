import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bell, Info, XCircle } from 'lucide-react';

const initialNotifications = [
  {
    id: 'n1',
    type: 'critical',
    title: 'Camera cua vao mat ket noi',
    description: 'He thong mat ket noi camera cua chinh luc 10:15.',
    time: '2 phut truoc',
    isRead: false
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Canh bao mat do cao',
    description: 'Khu vuc B vuot nguong suc chua (25 nguoi).',
    time: '15 phut truoc',
    isRead: false
  },
  {
    id: 'n3',
    type: 'info',
    title: 'Bao cao ngay da san sang',
    description: 'Bao cao luot khach va chuyen doi da san sang de tai xuong.',
    time: '1 gio truoc',
    isRead: true
  },
  {
    id: 'n4',
    type: 'info',
    title: 'Cap nhat he thong hoan tat',
    description: 'Tien trinh cap nhat du lieu phan tich da thanh cong.',
    time: '3 gio truoc',
    isRead: true
  }
];

const typeStyles = {
  critical: {
    icon: XCircle,
    iconClassName: 'text-rose-500',
    chipClassName: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Nghiem trong'
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'text-amber-500',
    chipClassName: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Canh bao'
  },
  info: {
    icon: Info,
    iconClassName: 'text-teal-500',
    chipClassName: 'bg-teal-50 text-teal-700 border-teal-200',
    label: 'Thong tin'
  }
};

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const containerRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter(item => !item.isRead).length,
    [notifications]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Mo thong bao"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse border border-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-[360px] max-w-[92vw] z-[100] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">Trung tam thong bao</p>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} thong bao chua doc` : 'Khong con thong bao moi'}
                </p>
              </div>
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs text-teal-700 hover:text-teal-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                Danh dau da doc tat ca
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-slate-700">Khong co thong bao moi</p>
                <p className="mt-1 text-xs text-slate-500">He thong dang hoat dong on dinh.</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto p-2 space-y-2 [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-transparent">
                {notifications.map((item) => {
                  const config = typeStyles[item.type] || typeStyles.info;
                  const Icon = config.icon;

                  return (
                    <article
                      key={item.id}
                      className={`rounded-xl border p-3 transition-colors ${
                        item.isRead
                          ? 'border-slate-200 bg-white'
                          : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={18} className={config.iconClassName} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.chipClassName}`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.description}</p>
                          <p className="mt-2 text-[11px] text-slate-500">{item.time}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
