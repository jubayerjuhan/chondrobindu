'use client';
import { createContext, useCallback, useContext, useState } from 'react';

export type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' };

type ToastContextType = {
  toasts: Toast[];
  push: (message: string, type?: Toast['type']) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const remove = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-sm border border-slate-800 bg-slate-900/80 backdrop-blur ${
              toast.type === 'success'
                ? 'text-emerald-200 border-emerald-500/30'
                : toast.type === 'error'
                ? 'text-rose-200 border-rose-500/30'
                : 'text-slate-200'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
