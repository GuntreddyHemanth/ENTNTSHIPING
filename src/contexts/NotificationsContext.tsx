import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Notification } from '../types';
import { 
  getNotifications, 
  getUnreadNotificationsCount,
  addNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '../utils/localStorageUtils';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<Notification>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationData = getNotifications();
        setNotifications(notificationData);
        setUnreadCount(getUnreadNotificationsCount());
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Add a new notification
  const addNotificationHandler = async (notificationData: Omit<Notification, 'id'>): Promise<Notification> => {
    try {
      const newNotification = addNotification(notificationData);
      setNotifications(prevNotifications => [...prevNotifications, newNotification]);
      setUnreadCount(prevCount => prevCount + 1);
      return newNotification;
    } catch (err) {
      setError('Failed to add notification');
      throw err;
    }
  };

  // Mark a notification as read
  const markAsReadHandler = async (id: string): Promise<void> => {
    try {
      markNotificationAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(getUnreadNotificationsCount());
    } catch (err) {
      setError('Failed to mark notification as read');
      throw err;
    }
  };

  // Mark all notifications as read
  const markAllAsReadHandler = async (): Promise<void> => {
    try {
      markAllNotificationsAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to mark all notifications as read');
      throw err;
    }
  };

  // Delete a notification
  const deleteNotificationHandler = async (id: string): Promise<void> => {
    try {
      const notification = notifications.find(n => n.id === id);
      deleteNotification(id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      if (notification && !notification.read) {
        setUnreadCount(prevCount => prevCount - 1);
      }
    } catch (err) {
      setError('Failed to delete notification');
      throw err;
    }
  };

  // Refresh notifications data
  const refreshNotifications = () => {
    try {
      const notificationData = getNotifications();
      setNotifications(notificationData);
      setUnreadCount(getUnreadNotificationsCount());
    } catch (err) {
      setError('Failed to refresh notifications');
      console.error(err);
    }
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      error,
      addNotification: addNotificationHandler,
      markAsRead: markAsReadHandler,
      markAllAsRead: markAllAsReadHandler,
      deleteNotification: deleteNotificationHandler,
      refreshNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};