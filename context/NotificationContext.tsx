import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSound } from '../hooks/useSound';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationContextData {
  addNotification: (type: NotificationType, title: string, message: string) => void;
  removeNotification: (id: string) => void;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { playClick, playChime } = useSound(); // Reutiliza sons existentes

  const removeNotification = useCallback((id: string) => {
    setNotifications((state) => state.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Efeitos sonoros baseados no tipo
    if (type === 'success') playChime();
    else playClick();

    const newNotification = { id, type, title, message };

    setNotifications((state) => [...state, newNotification]);

    // Auto-remove após 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification, playChime, playClick]);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};