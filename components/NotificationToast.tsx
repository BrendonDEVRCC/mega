import React from 'react';
import { useNotification, Notification } from '../context/NotificationContext';

const Icons = {
  success: () => <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  error: () => <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  info: () => <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  warning: () => <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

const ToastItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotification();
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeNotification(notification.id), 400);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 4600); // Começa a animar saída um pouco antes de remover
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`
        relative w-full max-w-sm overflow-hidden rounded-lg shadow-2xl border pointer-events-auto
        flex items-start gap-4 p-4 mb-3 transition-all duration-500 ease-out transform
        bg-white/90 dark:bg-[#111]/90 backdrop-blur-md
        ${notification.type === 'error' ? 'border-red-200 dark:border-red-900/50' : 'border-amber-200 dark:border-amber-500/30'}
        ${isExiting ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'}
        animate-in slide-in-from-right-full fade-in duration-500
      `}
    >
      {/* Barra de Progresso/Tempo decorativa */}
      <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50 w-full animate-[shimmer_5s_linear_forwards]
          ${notification.type === 'error' ? 'text-red-500' : 'text-amber-500'}
      `}></div>

      {/* Ícone */}
      <div className="flex-shrink-0 mt-1">
        {Icons[notification.type]()}
      </div>

      {/* Conteúdo */}
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-editorial tracking-wide">
          {notification.title}
        </h4>
        <p className="mt-1 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {/* Botão Fechar */}
      <button 
        onClick={handleClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

const NotificationToast = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-20 right-0 z-[100] p-4 w-full md:w-auto flex flex-col items-end pointer-events-none gap-2">
      {notifications.map((notification) => (
        <ToastItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationToast;