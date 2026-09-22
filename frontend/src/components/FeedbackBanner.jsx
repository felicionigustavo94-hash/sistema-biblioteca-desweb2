import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function FeedbackBanner({ mensagem, onClose }) {
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [mensagem, onClose]);

  if (!mensagem) return null;

  const isErro = mensagem.tipo === 'erro';
  const isAviso = mensagem.tipo === 'aviso';
  const isSucesso = mensagem.tipo === 'sucesso' || !mensagem.tipo;

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div 
        className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border ${
          isErro 
            ? 'bg-[#FBEDEC] border-[#A43535] text-[#A43535]' 
            : isAviso 
              ? 'bg-[#FFF3D8] border-[#80520E] text-[#80520E]' 
              : 'bg-[#EAF4ED] border-[#216044] text-[#216044]'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isErro && <AlertCircle className="w-5 h-5" />}
          {isAviso && <AlertCircle className="w-5 h-5" />}
          {isSucesso && <CheckCircle2 className="w-5 h-5" />}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {mensagem.texto}
        </div>
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar notificação"
          className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
