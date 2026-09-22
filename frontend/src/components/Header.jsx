import React from 'react';
import { Menu, Calendar, LogIn } from 'lucide-react';

export default function Header({ 
  tituloContexto, 
  subtituloContexto, 
  user, 
  setMenuAberto,
  setPagina
}) {
  // Data operacional formatada em Português conforme Seção 13 do design.md
  const hoje = new Date();
  const opcoesData = { day: 'numeric', month: 'long', year: 'numeric' };
  const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoesData);

  return (
    <header className="h-16 shrink-0 bg-[#FFFFFF] border-b border-[#D5DED7] px-4 sm:px-8 flex items-center justify-between z-20">
      {/* Lado Esquerdo: Mobile Trigger & Título de Contexto */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          className="lg:hidden p-2 rounded-[6px] text-[#5C6D65] hover:bg-[#F0F2ED] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-[#0A372F] leading-tight">
            {tituloContexto}
          </h1>
          {subtituloContexto && (
            <p className="text-xs text-[#5C6D65] hidden sm:block leading-none mt-0.5">
              {subtituloContexto}
            </p>
          )}
        </div>
      </div>

      {/* Lado Direito: Data Operacional e Perfil Rápido */}
      <div className="flex items-center gap-4">
        {/* Data Operacional */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#5C6D65] numeric">
          <Calendar className="w-3.5 h-3.5 text-[#1D5E51]" />
          <span>{dataFormatada}</span>
        </div>

        {/* Separador */}
        <div className="hidden md:block w-px h-6 bg-[#D5DED7]" />

        {/* Status do Operador */}
        {user ? (
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#203B34] leading-tight">
                {user.name}
              </p>
              <p className="text-[0.6875rem] text-[#5C6D65] leading-none mt-0.5">
                {user.role === 'admin' ? 'Operador do Sistema' : 'Leitor'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EFF6F2] border border-[#DCEDE6] text-[#0A372F] flex items-center justify-center text-xs font-bold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setPagina('login')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1D5E51] bg-[#EFF6F2] hover:bg-[#DCEDE6] rounded-[6px] min-h-[36px]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
}
