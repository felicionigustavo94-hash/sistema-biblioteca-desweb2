import React from 'react';
import { 
  BookOpen, 
  Repeat, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Clock, 
  Bookmark,
  Calendar,
  User
} from 'lucide-react';

export default function VisaoGeral({
  livros,
  emprestimos,
  user,
  setPagina,
  onAbrirNovoLivro,
  onAbrirNovoEmprestimo,
  onDevolverLivro
}) {
  const totalObras = livros.length;
  const totalExemplaresDisponiveis = livros.reduce((acc, l) => acc + (l.available_copies || 0), 0);
  const totalExemplaresGeral = livros.reduce((acc, l) => acc + (l.total_copies || 0), 0);
  
  const emprestimosAtivos = emprestimos.filter(e => e.status !== 'devolvido');
  
  // Calcular empréstimos em atraso
  const hojeStr = new Date().toISOString().split('T')[0];
  const emprestimosEmAtraso = emprestimosAtivos.filter(e => e.due_date && e.due_date < hojeStr);

  // Formatar data pt-BR
  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    try {
      const dataApenas = String(dataStr).split('T')[0];
      const partes = dataApenas.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataStr;
    } catch {
      return dataStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Cabeçalho da Página com Ação Dominante (design.md seção 8) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
            Visão Geral
          </h2>
          <p className="text-sm text-[#5C6D65] mt-1">
            Acompanhamento diário da circulação, indicadores e pendências do acervo
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={onAbrirNovoLivro}
              className="h-11 px-4 bg-[#FFFFFF] hover:bg-[#EFF6F2] border border-[#7D8D83] text-[#1D5E51] text-sm font-semibold rounded-[6px] flex items-center gap-2 transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-[#1D5E51]" />
              <span>Cadastrar Obra</span>
            </button>
          )}

          <button
            onClick={onAbrirNovoEmprestimo}
            className="h-11 px-5 bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold rounded-[6px] flex items-center gap-2 shadow-sm transition-colors min-h-[44px]"
          >
            <Repeat className="w-4 h-4" />
            <span>Registrar Empréstimo</span>
          </button>
        </div>
      </div>

      {/* 4 Indicadores Operacionais Semânticos (design.md seção 9.6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total de Obras */}
        <div 
          onClick={() => setPagina('acervo')}
          className="p-5 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] hover:border-[#1D5E51] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Obras no Acervo
            </span>
            <div className="w-8 h-8 rounded-[6px] bg-[#EFF6F2] text-[#1D5E51] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0A372F] numeric">
              {totalObras}
            </span>
            <span className="text-xs text-[#5C6D65]">
              títulos distintos
            </span>
          </div>
          <div className="mt-2 text-xs text-[#1D5E51] font-medium flex items-center gap-1 group-hover:underline">
            <span>Consultar catálogo</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Exemplares Disponíveis */}
        <div className="p-5 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Exemplares Disponíveis
            </span>
            <div className="w-8 h-8 rounded-[6px] bg-[#EAF4ED] text-[#216044] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#216044] numeric">
              {totalExemplaresDisponiveis}
            </span>
            <span className="text-xs text-[#5C6D65] numeric">
              de {totalExemplaresGeral} exemplares
            </span>
          </div>
          <p className="mt-2 text-xs text-[#5C6D65]">
            Prontos para empréstimo imediato
          </p>
        </div>

        {/* Empréstimos Ativos */}
        <div 
          onClick={() => setPagina('emprestimos')}
          className="p-5 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] hover:border-[#1D5E51] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Empréstimos Ativos
            </span>
            <div className="w-8 h-8 rounded-[6px] bg-[#EDF3F8] text-[#285E7B] flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#285E7B] numeric">
              {emprestimosAtivos.length}
            </span>
            <span className="text-xs text-[#5C6D65]">
              em circulação
            </span>
          </div>
          <div className="mt-2 text-xs text-[#285E7B] font-medium flex items-center gap-1 group-hover:underline">
            <span>Ver circulação</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Em Atraso */}
        <div className="p-5 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Em Atraso
            </span>
            <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center ${
              emprestimosEmAtraso.length > 0 ? 'bg-[#FBEDEC] text-[#A43535]' : 'bg-[#F0F2ED] text-[#5C6D65]'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-bold numeric ${
              emprestimosEmAtraso.length > 0 ? 'text-[#A43535]' : 'text-[#0A372F]'
            }`}>
              {emprestimosEmAtraso.length}
            </span>
            <span className="text-xs text-[#5C6D65]">
              {emprestimosEmAtraso.length === 1 ? 'obra vencida' : 'obras vencidas'}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#5C6D65]">
            {emprestimosEmAtraso.length > 0 ? 'Requer notificação ao leitor' : 'Nenhuma pendência crítica'}
          </p>
        </div>

      </div>

      {/* Painéis Operacionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel de Circulação: Empréstimos Ativos Recentes e Pendências (2 colunas) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[#D5DED7] bg-[#F7F6F1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1D5E51]" />
              <h3 className="text-sm font-semibold text-[#0A372F]">
                Circulação Recente & Vencimentos Previstos
              </h3>
            </div>
            <button
              onClick={() => setPagina('emprestimos')}
              className="text-xs font-semibold text-[#1D5E51] hover:underline"
            >
              Ver todos ({emprestimosAtivos.length})
            </button>
          </div>

          <div className="p-0 divide-y divide-[#D5DED7] flex-1">
            {emprestimosAtivos.length === 0 ? (
              <div className="p-8 text-center text-[#5C6D65] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#216044] mx-auto" />
                <p className="text-sm font-medium text-[#203B34]">Nenhum empréstimo pendente.</p>
                <p className="text-xs">Todos os exemplares estão disponíveis no acervo da biblioteca.</p>
              </div>
            ) : (
              emprestimosAtivos.slice(0, 5).map((emp) => {
                const emAtraso = emp.due_date && emp.due_date < hojeStr;
                return (
                  <div key={emp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F6F1]/60 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#203B34]">
                          {emp.book?.title || 'Obra sem título'}
                        </span>
                        {emAtraso ? (
                          <span className="px-2 py-0.5 text-[0.6875rem] font-bold rounded-full bg-[#FBEDEC] text-[#A43535] border border-[#A43535]/20">
                            Em atraso
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[0.6875rem] font-semibold rounded-full bg-[#EDF3F8] text-[#285E7B]">
                            Em dia
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#5C6D65]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#7D8D83]" />
                          {emp.user?.name || 'Leitor não identificado'}
                        </span>
                        <span className="flex items-center gap-1 numeric">
                          <Calendar className="w-3 h-3 text-[#7D8D83]" />
                          Vencimento: {formatarData(emp.due_date)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDevolverLivro(emp.id)}
                      className="shrink-0 h-9 px-3 bg-[#FFFFFF] hover:bg-[#EAF4ED] border border-[#7D8D83] hover:border-[#216044] text-[#216044] text-xs font-semibold rounded-[6px] transition-colors"
                    >
                      Confirmar devolução
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Painel Lateral: Últimas Obras Incorporadas ao Acervo (1 coluna) */}
        <div className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[#D5DED7] bg-[#F7F6F1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#80602B]" />
              <h3 className="text-sm font-semibold text-[#0A372F]">
                Últimas Obras no Acervo
              </h3>
            </div>
            <button
              onClick={() => setPagina('acervo')}
              className="text-xs font-semibold text-[#1D5E51] hover:underline"
            >
              Catálogo
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {livros.length === 0 ? (
              <p className="text-xs text-[#5C6D65] py-4 text-center">Nenhuma obra cadastrada ainda.</p>
            ) : (
              livros.slice(0, 4).map((livro) => (
                <div key={livro.id} className="flex items-center gap-3 p-2 rounded-[6px] hover:bg-[#EFF6F2]/50 transition-colors">
                  <div className="w-10 h-14 shrink-0 rounded bg-[#F0F2ED] border border-[#D5DED7] overflow-hidden flex items-center justify-center">
                    {livro.cover_path ? (
                      <img 
                        src={livro.cover_path} 
                        alt="" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <BookOpen className="w-4 h-4 text-[#5C6D65]/50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#203B34] truncate leading-tight">
                      {livro.title}
                    </p>
                    <p className="text-[0.6875rem] text-[#5C6D65] truncate mt-0.5">
                      {livro.author}
                    </p>
                    <span className="inline-block mt-1 text-[0.6875rem] font-semibold text-[#216044] bg-[#EAF4ED] px-1.5 py-0.2 rounded numeric">
                      {livro.available_copies || 0} {livro.available_copies === 1 ? 'exemplar disponível' : 'exemplares'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
