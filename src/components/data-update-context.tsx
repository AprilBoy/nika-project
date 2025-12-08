import React, { createContext, useContext, useCallback, ReactNode } from 'react';

// Типы для контекста обновлений данных
export type DataType = 'hero' | 'about' | 'process' | 'clients' | 'services' | 'testimonials' | 'projects' | 'all';

interface DataUpdateContextType {
  // Функция для уведомления об обновлении данных
  notifyDataUpdate: (dataType: DataType) => void;
  // Функция для подписки на обновления
  subscribeToUpdates: (callback: (dataType: DataType) => void) => () => void;
}

const DataUpdateContext = createContext<DataUpdateContextType | undefined>(undefined);

export function useDataUpdate() {
  const context = useContext(DataUpdateContext);
  if (!context) {
    throw new Error('useDataUpdate must be used within DataUpdateProvider');
  }
  return context;
}

interface DataUpdateProviderProps {
  children: ReactNode;
}

export function DataUpdateProvider({ children }: DataUpdateProviderProps) {
  // Массив колбэков для подписчиков
  const subscribers = React.useRef<Set<(dataType: DataType) => void>>(new Set());

  const notifyDataUpdate = useCallback((dataType: DataType) => {
    // Уведомляем всех подписчиков об обновлении
    subscribers.current.forEach(callback => {
      try {
        callback(dataType);
      } catch (error) {
        console.error('Error in data update subscriber:', error);
      }
    });
  }, []);

  const subscribeToUpdates = useCallback((callback: (dataType: DataType) => void) => {
    subscribers.current.add(callback);

    // Возвращаем функцию отписки
    return () => {
      subscribers.current.delete(callback);
    };
  }, []);

  const value = {
    notifyDataUpdate,
    subscribeToUpdates,
  };

  return (
    <DataUpdateContext.Provider value={value}>
      {children}
    </DataUpdateContext.Provider>
  );
}
