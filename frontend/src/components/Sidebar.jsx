import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Repeat, 
  Users, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  UserCheck,
  X
} from 'lucide-react';

export default function Sidebar({ 
  paginaAtiva, 
  setPagina, 
  user, 
  logout, 
  menuAberto, 
  setMenuAberto,
  totalLivros,
  totalEmprestimosAtivos
}) {
  const navItems = [
    { 
      id: 'visao-geral', 
      label: 'Visão geral', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'acervo', 
      label: 'Acervo', 
      icon: BookOpen,
      badge: totalLivros > 0 ? totalLivros : null
    },
    { 
      id: 'emprestimos', 
      label: 'Empréstimos', 
      icon: Repeat,
      badge: totalEmprestimosAtivos > 0 ? totalEmprestimosAtivos : null
    },
    ...(user?.role === 'admin' ? [
      { 
        id: 'usuarios', 
        label: 'Leitores e Operadores', 
        icon: Users,
        badge: null
      }
    ] : [])
  ];

  const handleNavClick = (id) => {
    setPagina(id);
    if (setMenuAberto) setMenuAberto(false);
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#FFFFFF] border-r border-[#D5DED7] select-none">
      {/* Topo / Marca Oficial */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#D5DED7]">
          <div 
            onClick={() => handleNavClick('visao-geral')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/logo-symbol.png" 
              alt="Símbolo BiblioGest" 
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="text-[1.125rem] font-bold tracking-tight text-[#0A372F] leading-none">
                Biblio<span className="text-[#1D5E51]">Gest</span>
              </span>
              <span className="text-[0.6875rem] font-medium text-[#80602B] tracking-wider uppercase mt-0.5">
                Biblioteca
              </span>
            </div>
          </div>

          {/* Botão fechar em mobile */}
          {setMenuAberto && (
            <button 
              onClick={() => setMenuAberto(false)}
              className="lg:hidden p-1.5 rounded-md text-[#5C6D65] hover:bg-[#F0F2ED]"
              aria-label="Fechar navegação"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Assinatura Curta de Marca */}
        <div className="px-5 py-3 border-b border-[#D5DED7]/60 bg-[#F7F6F1]/50">
          <p className="text-[0.8125rem] text-[#5C6D65] leading-tight">
            Conhecimento em circulação.
          </p>
        </div>

        {/* Links de Navegação com o Marcador de Página Oficial */}
        <nav className="py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const ativo = paginaAtiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[0.9375rem] transition-all min-h-[44px] text-left ${
                  ativo
                    ? 'border-l-[3px] border-[#1D5E51] bg-[#EFF6F2] font-semibold text-[#0A372F]'
                    : 'text-[#203B34] hover:bg-[#F0F2ED] font-normal'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${ativo ? 'text-[#1D5E51]' : 'text-[#5C6D65]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold numeric ${
                    ativo ? 'bg-[#DCEDE6] text-[#0A372F]' : 'bg-[#F0F2ED] text-[#5C6D65]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Rodapé do Operador / Conta */}
      <div className="p-3 border-t border-[#D5DED7] bg-[#F7F6F1]">
        {user ? (
          <div className="p-2.5 rounded-[6px] bg-[#FFFFFF] border border-[#D5DED7] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EFF6F2] text-[#0A372F] flex items-center justify-center font-bold text-sm shrink-0 border border-[#DCEDE6]">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#203B34] truncate leading-tight">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {user.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[#216044] bg-[#EAF4ED] px-1.5 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" /> Operador
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[#285E7B] bg-[#EDF3F8] px-1.5 py-0.5 rounded">
                      <UserCheck className="w-3 h-3" /> Leitor
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#A43535] hover:bg-[#FBEDEC] rounded-[4px] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Encerrar sessão</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleNavClick('login')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-[6px] bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold shadow-sm transition-colors min-h-[44px]"
          >
            <LogIn className="w-4 h-4" />
            <span>Acessar sistema</span>
          </button>
        )}

        <div className="mt-2 text-center text-[0.6875rem] text-[#5C6D65] numeric">
          BiblioGest v1.0 · 2026
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop (232px fixo e constante) */}
      <aside className="hidden lg:block w-[232px] shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Drawer Mobile / Tablet (< 1024px) */}
      {menuAberto && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-[#0A372F]/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setMenuAberto(false)}
          />
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
