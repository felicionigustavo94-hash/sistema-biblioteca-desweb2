import React from 'react';
import { 
  Search, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Star, 
  Globe, 
  Sparkles,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

export default function LeitorHome({
  livrosDigitais,
  minhasLeituras,
  meusEmprestimos,
  onAbrirDetalhes,
  onLerAgora,
  setPagina,
  busca,
  setBusca
}) {
  // Obra mais recente em andamento (Continuar Lendo)
  const leituraRecente = minhasLeituras && minhasLeituras.length > 0 ? minhasLeituras[0] : null;

  // Destaques em Língua Portuguesa
  const livrosPortugues = livrosDigitais.filter(b => b.language === 'pt').slice(0, 8);
  
  // Mais populares
  const livrosPopulares = [...livrosDigitais].sort((a, b) => b.download_count - a.download_count).slice(0, 6);

  // Empréstimos físicos ativos do leitor
  const emprestimosAtivos = meusEmprestimos.filter(e => e.status !== 'devolvido');

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* 1. Hero Banner de Acolhimento e Busca Principal */}
      <div className="relative rounded-[12px] bg-gradient-to-r from-[#0A372F] via-[#154B41] to-[#0A372F] text-white p-6 sm:p-10 shadow-lg border border-[#1D5E51] overflow-hidden" data-surface="dark">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D5E51] text-[#C6A15B] text-xs font-semibold border border-[#C6A15B]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biblioteca Digital BiblioGest · Acervo em Domínio Público</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-4xl font-medium text-white leading-tight">
            Descubra, consulte e leia centenas de clássicos livremente.
          </h2>
          
          <p className="text-sm text-[#DCEDE6] font-normal leading-relaxed">
            Acesse obras integrais de Machado de Assis, Camões e grandes autores mundiais diretamente no seu navegador, sem custo e sem espera.
          </p>

          {/* Campo de Busca Principal da Home */}
          <div className="pt-2">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setPagina('explorar');
              }}
              className="relative max-w-lg"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6D65]" />
              <input
                type="text"
                placeholder="Buscar por obra, autor ou assunto (ex: Machado de Assis)..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full h-12 pl-11 pr-24 bg-[#FFFFFF] rounded-[8px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/70 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] shadow-md"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 bg-[#1D5E51] hover:bg-[#154B41] text-white text-xs font-semibold rounded-[6px] transition-colors"
              >
                Explorar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. Seção "Continuar Lendo" (Apenas quando houver leitura real em andamento) */}
      {leituraRecente && leituraRecente.digital_book && (
        <section className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[10px] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-[#1D5E51]" />
              <h3 className="text-base sm:text-lg font-semibold text-[#0A372F]">
                Continuar Lendo
              </h3>
            </div>
            <button
              onClick={() => setPagina('leituras')}
              className="text-xs font-semibold text-[#1D5E51] hover:underline flex items-center gap-1"
            >
              <span>Ver todas as minhas leituras</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-[8px] bg-[#EFF6F2] border border-[#DCEDE6]">
            {/* Capa */}
            <div className="w-16 h-24 rounded bg-[#FFFFFF] border border-[#D5DED7] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
              {leituraRecente.digital_book.cover_url ? (
                <img 
                  src={leituraRecente.digital_book.cover_url} 
                  alt="" 
                  className="w-full h-full object-contain p-0.5" 
                />
              ) : (
                <BookOpen className="w-6 h-6 text-[#5C6D65]" />
              )}
            </div>

            {/* Dados do Livro & Progresso */}
            <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
              <div>
                <h4 className="font-semibold text-base text-[#0A372F] truncate">
                  {leituraRecente.digital_book.title}
                </h4>
                <p className="text-xs text-[#5C6D65]">
                  {leituraRecente.digital_book.author} · {leituraRecente.chapter_title || 'Capítulo Atual'}
                </p>
              </div>

              {/* Barra de Progresso Real */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#5C6D65] numeric">
                  <span>Progresso da Leitura</span>
                  <span className="font-bold text-[#1D5E51]">{leituraRecente.percentage}%</span>
                </div>
                <div className="w-full bg-[#DCEDE6] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#1D5E51] h-full rounded-full transition-all duration-300"
                    style={{ width: `${leituraRecente.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ação Primária de Retomada */}
            <button
              onClick={() => onLerAgora(leituraRecente.digital_book)}
              className="h-11 px-6 bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold rounded-[6px] shrink-0 flex items-center gap-2 shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#C6A15B]" />
              <span>Retomar Leitura</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Prateleira: Clássicos da Literatura em Língua Portuguesa */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#D5DED7] pb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#0A372F] tracking-tight">
              Obras Fundamentais em Língua Portuguesa
            </h3>
            <p className="text-xs text-[#5C6D65] mt-0.5">
              Livros integrais em domínio público prontos para leitura no BiblioGest
            </p>
          </div>
          <button
            onClick={() => setPagina('explorar')}
            className="text-xs font-semibold text-[#1D5E51] hover:underline flex items-center gap-1"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {livrosPortugues.map((livro) => (
            <div
              key={livro.id}
              onClick={() => onAbrirDetalhes(livro)}
              className="bg-[#FFFFFF] border border-[#D5DED7] hover:border-[#1D5E51] rounded-[8px] p-3.5 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Capa com Proporção Confortável sem corte */}
                <div className="w-full h-44 sm:h-52 rounded-[6px] bg-[#F0F2ED] border border-[#D5DED7]/60 overflow-hidden flex items-center justify-center p-1 group-hover:scale-[1.02] transition-transform">
                  {livro.cover_url ? (
                    <img 
                      src={livro.cover_url} 
                      alt="" 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#5C6D65]/60 text-center p-2">
                      <BookOpen className="w-6 h-6 mb-1" />
                      <span className="text-[0.625rem]">Sem capa</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-[#0A372F] line-clamp-2 leading-snug group-hover:text-[#1D5E51]">
                    {livro.title}
                  </h4>
                  <p className="text-xs text-[#5C6D65] line-clamp-1 mt-0.5">
                    {livro.author}
                  </p>
                </div>
              </div>

              {/* Badges e Ação */}
              <div className="mt-3 pt-3 border-t border-[#D5DED7]/60 flex items-center justify-between">
                <span className="text-[0.6875rem] font-semibold text-[#216044] bg-[#EAF4ED] px-2 py-0.5 rounded-full">
                  Ler agora
                </span>
                <span className="text-[0.6875rem] text-[#5C6D65] numeric">
                  PT
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Empréstimos Físicos do Leitor (Lembrete Discreto) */}
      {emprestimosAtivos.length > 0 && (
        <section className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[10px] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#80602B]" />
              <h3 className="text-sm font-semibold text-[#0A372F]">
                Seus Empréstimos Físicos Ativos ({emprestimosAtivos.length})
              </h3>
            </div>
            <button
              onClick={() => setPagina('meus-emprestimos')}
              className="text-xs font-semibold text-[#1D5E51] hover:underline"
            >
              Acompanhar prazos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emprestimosAtivos.map((emp) => (
              <div key={emp.id} className="p-3 rounded-[6px] bg-[#EFF6F2] border border-[#DCEDE6] flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-[#0A372F] truncate">
                    {emp.book?.title || 'Obra física'}
                  </p>
                  <p className="text-[0.6875rem] text-[#5C6D65]">
                    Vencimento: <span className="font-semibold text-[#203B34] numeric">{emp.due_date}</span>
                  </p>
                </div>
                <span className="shrink-0 text-[0.6875rem] font-semibold text-[#285E7B] bg-[#EDF3F8] px-2 py-0.5 rounded-full">
                  Em dia
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
