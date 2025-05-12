import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { BellRing, X, Check, Trash2 } from 'lucide-react';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await deleteNotification(id);
  };

  // Format notification timestamp to relative time
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Notifications"
      >
        <BellRing size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              <ul className="py-1">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`px-4 py-3 text-sm border-b border-gray-100 hover:bg-gray-50 ${
                      notification.read ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className={`text-sm ${notification.read ? 'text-gray-800' : 'text-gray-900 font-medium'}`}>
                            {notification.message}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="text-blue-600 hover:text-blue-800 mr-1"
                                title="Mark as read"
                              >
                                <span className="sr-only">Mark as read</span>
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Delete"
                            >
                              <span className="sr-only">Delete</span>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center rounded-md focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;