import { useState, useEffect } from 'react';

/**
 * Simple toast component as a fallback in case react-toastify fails to load
 */
const FallbackToast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${bgColors[type]} text-white p-3 rounded-lg shadow-lg z-50 max-w-sm w-full mx-auto text-center`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

/**
 * Toast manager to handle multiple toasts
 */
export const ToastManager = {
  toasts: [],
  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  notify(message, options = {}) {
    const id = Date.now();
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 5000,
    };
    
    this.toasts.push(toast);
    this.notifyListeners();
    
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.notifyListeners();
    }, toast.duration);
    
    return id;
  },

  success(message, options = {}) {
    return this.notify(message, { ...options, type: 'success' });
  },
  
  error(message, options = {}) {
    return this.notify(message, { ...options, type: 'error' });
  },
  
  info(message, options = {}) {
    return this.notify(message, { ...options, type: 'info' });
  },
  
  warning(message, options = {}) {
    return this.notify(message, { ...options, type: 'warning' });
  },

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.toasts));
  },
};

/**
 * Toast container component to display all toasts
 */
export const FallbackToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    const unsubscribe = ToastManager.subscribe(newToasts => {
      setToasts([...newToasts]);
    });
    
    return unsubscribe;
  }, []);
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <FallbackToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => {
            ToastManager.toasts = ToastManager.toasts.filter(t => t.id !== toast.id);
            ToastManager.notifyListeners();
          }}
        />
      ))}
    </div>
  );
};

export default FallbackToast;