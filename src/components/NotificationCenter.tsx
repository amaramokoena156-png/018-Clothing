import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Package,
  Sparkles,
  Tag,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    pushPermission,
    requestPushPermission,
    sendNotification,
  } = useStore();

  if (!isNotificationDrawerOpen) return null;

  const handleSimulateDrop = () => {
    sendNotification(
      'New Limited Run Alert!',
      '018 Bokone Stripe Knit in Sand Beige is back in stock at Klerksdorp studio.',
      'drop'
    );
  };

  const handleSimulateOrderAlert = () => {
    sendNotification(
      'Courier Dispatch Update',
      'The Courier Guy has collected parcel #TCG-018-ZA for same-day transit.',
      'order'
    );
  };

  return (
    <div
      id="notification-center-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsNotificationDrawerOpen(false)}
    >
      <div
        id="notification-center-panel"
        className="w-full max-w-md bg-white dark:bg-[#15181b] h-full shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#f35d1f]" />
            <h2 className="font-bold text-lg text-neutral-900 dark:text-white font-['Syne']">
              Activity & Notifications
            </h2>
            {unreadNotificationCount > 0 && (
              <span className="bg-[#f35d1f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadNotificationCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner */}
        <div className="p-4 bg-orange-50 dark:bg-[#1b1510] border-b border-orange-200 dark:border-orange-900/40">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-[#f35d1f] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-neutral-900 dark:text-white">
                Web Push Notifications:{' '}
                <span className="capitalize font-mono text-[#f35d1f]">
                  {pushPermission}
                </span>
              </p>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Receive instant real-time alerts when drops launch or when your parcel dispatches from Klerksdorp.
              </p>
              {pushPermission !== 'granted' && (
                <button
                  onClick={requestPushPermission}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-[#f35d1f] hover:bg-[#ea580c] text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  Enable Push Notifications
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="p-3 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500 font-medium">Recent Feed</span>
          <button
            onClick={markAllNotificationsAsRead}
            className="text-[#f35d1f] hover:underline font-semibold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 text-xs">
              No recent notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                  n.read
                    ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181b1e] opacity-80'
                    : 'border-orange-300 dark:border-orange-800/80 bg-orange-50/40 dark:bg-orange-950/20 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {n.type === 'order' && <Package className="w-3.5 h-3.5 text-[#f35d1f]" />}
                    {n.type === 'drop' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                    {n.type === 'promo' && <Tag className="w-3.5 h-3.5 text-emerald-500" />}
                    {n.type === 'system' && <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />}
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {n.title}
                    </span>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#f35d1f] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {n.body}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {new Date(n.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Demo Simulation Controls */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101214] space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Interactive Push Test Trigger
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSimulateDrop}
              className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Simulate Drop Alert
            </button>
            <button
              onClick={handleSimulateOrderAlert}
              className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Simulate Courier Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
