import React from 'react';
import { 
  Home,
  Compass,
  BookOpen, 
  Bookmark, 
  Clock,
  LayoutDashboard, 
  Library,
  BookCopy,
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
  totalDigitais,
  totalEmprestimosAtivos
}) {
  const isAdmin = user?.role === 'admin';

  // Navegação do Operador vs Navegação do Leitor (design.md seção 19.3)
  const navItems = isAdmin ? [
    { 
      id: 'visao-geral', 
      label: 'Visão geral', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'acervo', 
      label: 'Acervo Físico', 
      icon: Library,
      badge: totalLivros > 0 ? totalLivros : null
    },
    { 
      id: 'catalogo-digital', 
      label: 'Catálogo Digital', 
      icon: BookCopy,
      badge: totalDigitais > 0 ? totalDigitais : null
    },
    { 
      id: 'emprestimos', 
      label: 'Empréstimos', 
      icon: Repeat,
      badge: totalEmprestimosAtivos > 0 ? totalEmprestimosAtivos : null
    },
    { 
      id: 'usuarios', 
      label: 'Leitores e Operadores', 
      icon: Users,
      badge: null
    }
  ] : [
    { 
      id: 'inicio', 
      label: 'Início', 
      icon: Home,
      badge: null
    },
    { 
      id: 'explorar', 
      label: 'Explorar Livros', 
      icon: Compass,
      badge: totalDigitais > 0 ? totalDigitais : null
    },
    { 
      id: 'leituras', 
      label: 'Minha Leitura', 
      icon: Bookmark,
      badge: null
    },
    { 
      id: 'meus-emprestimos', 
      label: 'Meus Empréstimos', 
      icon: Clock,
      badge: null
    }
  ];

  const handleNavClick = (id) => {
    setPagina(id);
    if (setMenuAberto) setMenuAberto(false);
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#0A372F] text-[#DCEDE6] select-none shadow-xl border-r border-[#072A24]" data-surface="dark">
      {/* Topo / Marca Oficial com Presença Verde Profundo */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#154B41]">
          <div 
            onClick={() => handleNavClick(isAdmin ? 'visao-geral' : 'inicio')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/logo-symbol.png" 
              alt="Símbolo BiblioGest" 
              className="w-8 h-8 object-contain brightness-0 invert transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="text-[1.125rem] font-bold tracking-tight text-white leading-none">
                Biblio<span className="text-[#C6A15B]">Gest</span>
              </span>
              <span className="text-[0.6875rem] font-medium text-[#C6A15B] tracking-wider uppercase mt-0.5">
                {isAdmin ? 'Painel Operador' : 'Biblioteca Digital'}
              </span>
            </div>
          </div>

          {/* Botão fechar em mobile */}
          {setMenuAberto && (
            <button 
              onClick={() => setMenuAberto(false)}
              className="lg:hidden p-1.5 rounded-md text-[#DCEDE6] hover:bg-[#154B41]"
              aria-label="Fechar navegação"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Assinatura Curta de Marca */}
        <div className="px-5 py-3 border-b border-[#154B41]/60 bg-[#072A24]/40">
          <p className="text-[0.8125rem] text-[#DCEDE6]/80 leading-tight">
            Conhecimento em circulação.
          </p>
        </div>

        {/* Links de Navegação com o Marcador de Página Adaptado ao Fundo Escuro */}
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
                    ? 'border-l-[3px] border-[#C6A15B] bg-[#1D5E51] font-semibold text-white shadow-sm'
                    : 'text-[#DCEDE6] hover:bg-[#154B41]/70 hover:text-white font-normal'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${ativo ? 'text-[#C6A15B]' : 'text-[#DCEDE6]/80'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold numeric ${
                    ativo ? 'bg-[#0A372F] text-[#C6A15B]' : 'bg-[#154B41] text-[#DCEDE6]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Rodapé do Operador / Leitor */}
      <div className="p-3 border-t border-[#154B41] bg-[#072A24]">
        {user ? (
          <div className="p-2.5 rounded-[6px] bg-[#0A372F] border border-[#154B41] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1D5E51] text-[#C6A15B] flex items-center justify-center font-bold text-sm shrink-0 border border-[#C6A15B]/30">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate leading-tight">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[#DCEDE6] bg-[#1D5E51] px-1.5 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-[#C6A15B]" /> Operador
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[#DCEDE6] bg-[#1D5E51] px-1.5 py-0.5 rounded">
                      <UserCheck className="w-3 h-3 text-[#C6A15B]" /> Leitor
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#FBEDEC] hover:bg-[#A43535]/30 rounded-[4px] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Encerrar sessão</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleNavClick('login')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-[6px] bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold border border-[#C6A15B]/40 shadow-sm transition-colors min-h-[44px]"
          >
            <LogIn className="w-4 h-4 text-[#C6A15B]" />
            <span>Acessar sistema</span>
          </button>
        )}

        <div className="mt-2 text-center text-[0.6875rem] text-[#DCEDE6]/60 numeric">
          BiblioGest v1.1 · 2026
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop (240px fixo em verde profundo) */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Drawer Mobile (< 1024px) */}
      {menuAberto && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-[#072A24]/60 backdrop-blur-xs transition-opacity" 
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
