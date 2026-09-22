import React from 'react';
import { 
  Search, 
  BookOpen, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Globe,
  Sparkles
} from 'lucide-react';

export default function LeitorCatalogo({
  livrosDigitais,
  carregando,
  busca,
  setBusca,
  filtroIdioma,
  setFiltroIdioma,
  filtroLeituraHabilitada,
  setFiltroLeituraHabilitada,
  paginaAtual,
  setPaginaAtual,
  totalPaginas,
  totalLivros,
  onAbrirDetalhes,
  onLimparFiltros
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho do Catálogo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
              Catálogo de Livros Digitais
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6F2] text-[#1D5E51] border border-[#DCEDE6] numeric">
              {totalLivros} obras indexadas
            </span>
          </div>
          <p className="text-sm text-[#5C6D65] mt-1">
            Explore clássicos integrais do acervo de domínio público do Project Gutenberg
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Busca */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6D65]" />
            <input
              type="text"
              placeholder="Buscar por título, autor ou assunto..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
              className="w-full h-11 pl-10 pr-10 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
            />
            {busca && (
              <button
                onClick={() => { setBusca(''); setPaginaAtual(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6D65] hover:text-[#203B34]"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtros de Idioma */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-semibold text-[#5C6D65] mr-1 hidden sm:inline">Idioma:</span>
            
            <button
              onClick={() => { setFiltroIdioma('all'); setPaginaAtual(1); }}
              className={`h-9 px-3 rounded-[6px] text-xs font-semibold border transition-colors ${
                filtroIdioma === 'all'
                  ? 'bg-[#1D5E51] border-[#1D5E51] text-white'
                  : 'bg-[#FFFFFF] border-[#7D8D83] text-[#5C6D65] hover:bg-[#F0F2ED]'
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => { setFiltroIdioma('pt'); setPaginaAtual(1); }}
              className={`h-9 px-3 rounded-[6px] text-xs font-semibold border transition-colors ${
                filtroIdioma === 'pt'
                  ? 'bg-[#1D5E51] border-[#1D5E51] text-white'
                  : 'bg-[#FFFFFF] border-[#7D8D83] text-[#5C6D65] hover:bg-[#F0F2ED]'
              }`}
            >
              Português
            </button>

            <button
              onClick={() => { setFiltroIdioma('en'); setPaginaAtual(1); }}
              className={`h-9 px-3 rounded-[6px] text-xs font-semibold border transition-colors ${
                filtroIdioma === 'en'
                  ? 'bg-[#1D5E51] border-[#1D5E51] text-white'
                  : 'bg-[#FFFFFF] border-[#7D8D83] text-[#5C6D65] hover:bg-[#F0F2ED]'
              }`}
            >
              Inglês
            </button>

            {(busca || filtroIdioma !== 'all') && (
              <button
                type="button"
                onClick={onLimparFiltros}
                className="h-9 px-3 text-xs font-semibold text-[#A43535] hover:bg-[#FBEDEC] rounded-[6px] transition-colors ml-auto sm:ml-2"
              >
                Limpar filtros
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Grade de Livros */}
      {carregando ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1D5E51] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#5C6D65]">Carregando catálogo digital...</p>
        </div>
      ) : livrosDigitais.length === 0 ? (
        <div className="p-12 text-center text-[#5C6D65] bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] space-y-3">
          <BookOpen className="w-10 h-10 text-[#7D8D83] mx-auto stroke-1" />
          <h3 className="text-base font-semibold text-[#203B34]">
            {busca ? `Nenhuma obra encontrada para "${busca}".` : 'Nenhum livro digital correspondente aos filtros.'}
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Tente pesquisar por outros termos ou redefina o filtro de idioma.
          </p>
          <button
            onClick={onLimparFiltros}
            className="text-xs font-semibold text-[#1D5E51] underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          {livrosDigitais.map((livro) => (
            <div
              key={livro.id}
              onClick={() => onAbrirDetalhes(livro)}
              className="bg-[#FFFFFF] border border-[#D5DED7] hover:border-[#1D5E51] rounded-[8px] p-3 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="space-y-2.5">
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
                      <BookOpen className="w-6 h-6 mb-1 stroke-1" />
                      <span className="text-[0.625rem]">Sem capa</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-[#0A372F] line-clamp-2 leading-snug group-hover:text-[#1D5E51]">
                    {livro.title}
                  </h4>
                  <p className="text-[0.6875rem] text-[#5C6D65] line-clamp-1 mt-0.5">
                    {livro.author}
                  </p>
                </div>
              </div>

              {/* Badges de Disponibilidade */}
              <div className="mt-3 pt-2.5 border-t border-[#D5DED7]/60 flex items-center justify-between">
                <span className="text-[0.625rem] font-semibold text-[#216044] bg-[#EAF4ED] px-1.5 py-0.5 rounded">
                  Ler agora
                </span>
                <span className="text-[0.625rem] font-semibold uppercase text-[#5C6D65] numeric">
                  {livro.language}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="pt-4 border-t border-[#D5DED7] flex items-center justify-between">
          <button
            onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
            disabled={paginaAtual <= 1}
            className="h-10 px-4 bg-[#FFFFFF] border border-[#7D8D83] disabled:opacity-40 disabled:cursor-not-allowed text-[#203B34] text-xs font-semibold rounded-[6px] flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Página Anterior</span>
          </button>

          <span className="text-xs font-semibold text-[#5C6D65] numeric">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
            disabled={paginaAtual >= totalPaginas}
            className="h-10 px-4 bg-[#FFFFFF] border border-[#7D8D83] disabled:opacity-40 disabled:cursor-not-allowed text-[#203B34] text-xs font-semibold rounded-[6px] flex items-center gap-1.5 transition-colors"
          >
            <span>Próxima Página</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
