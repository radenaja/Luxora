import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 translate-y-0 opacity-100 animate-slideUp">
      <div className="p-4 flex items-start gap-3">
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        )}
        
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">
            {type === 'success' ? 'Berhasil' : 'Kesalahan'}
          </p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {message}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Dynamic progress bar */}
      <div 
        className={`h-1 w-full bg-slate-100 relative overflow-hidden`}
      >
        <div 
          className={`absolute inset-y-0 left-0 h-full ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-shrinkWidth`}
          style={{ animationDuration: '4000ms' }}
        />
      </div>
    </div>
  );
}
