import React from 'react';
import { 
  Search, 
  BookOpen, 
  BookCopy, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function OperadorCatalogoDigital({
  livrosDigitais,
  stats,
  carregando,
  busca,
  setBusca,
  filtroIdioma,
  setFiltroIdioma,
  paginaAtual,
  setPaginaAtual,
  totalPaginas,
  totalLivros,
  onAbrirDetalhes,
  onLerAgora
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Cabeçalho de Contexto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
              Catálogo Digital (Project Gutenberg)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6F2] text-[#1D5E51] border border-[#DCEDE6] numeric">
              {stats?.total || totalLivros || 192} obras
            </span>
          </div>
          <p className="text-sm text-[#5C6D65] mt-1">
            Gestão do acervo digital de domínio público, sincronização com Project Gutenberg e disponibilidade de leitura
          </p>
        </div>
      </div>

      {/* 2. Grid de Métricas do Catálogo Digital (design.md seção 9.1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Total de Obras
            </span>
            <BookCopy className="w-4 h-4 text-[#1D5E51]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0A372F] numeric">
            {stats?.total ?? 192}
          </div>
          <span className="text-[0.6875rem] text-[#5C6D65]">
            Obras catalogadas e indexadas
          </span>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Em Português
            </span>
            <Globe className="w-4 h-4 text-[#1D5E51]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1D5E51] numeric">
            {stats?.portugues ?? 127}
          </div>
          <span className="text-[0.6875rem] text-[#5C6D65]">
            Machado, Camões, Eça e clássicos
          </span>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Internacionais
            </span>
            <Globe className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#80602B] numeric">
            {stats?.ingles ?? 65}
          </div>
          <span className="text-[0.6875rem] text-[#5C6D65]">
            Em língua inglesa e outros
          </span>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider">
              Leitura Habilitada
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#1D5E51]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1D5E51] numeric">
            100%
          </div>
          <span className="text-[0.6875rem] text-[#5C6D65]">
            {stats?.com_leitura ?? 192} prontas para leitura online
          </span>
        </div>
      </div>

      {/* 3. Filtros e Pesquisa */}
      <div className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6D65]" />
            <input
              type="text"
              placeholder="Buscar obra por título, autor ou assunto..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
              className="w-full h-10 pl-10 pr-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[6px] text-sm text-[#203B34] focus:outline-none focus:border-[#1D5E51] focus:ring-1 focus:ring-[#1D5E51]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-[#5C6D65] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Idioma:
            </span>
            <div className="flex rounded-[6px] border border-[#D5DED7] p-0.5 bg-[#EFF6F2]">
              <button
                onClick={() => { setFiltroIdioma('all'); setPaginaAtual(1); }}
                className={`px-3 py-1 text-xs font-semibold rounded-[4px] transition-colors ${
                  filtroIdioma === 'all'
                    ? 'bg-[#1D5E51] text-white shadow-xs'
                    : 'text-[#5C6D65] hover:text-[#203B34]'
                }`}
              >
                Todos ({stats?.total ?? 192})
              </button>
              <button
                onClick={() => { setFiltroIdioma('pt'); setPaginaAtual(1); }}
                className={`px-3 py-1 text-xs font-semibold rounded-[4px] transition-colors ${
                  filtroIdioma === 'pt'
                    ? 'bg-[#1D5E51] text-white shadow-xs'
                    : 'text-[#5C6D65] hover:text-[#203B34]'
                }`}
              >
                Português ({stats?.portugues ?? 127})
              </button>
              <button
                onClick={() => { setFiltroIdioma('en'); setPaginaAtual(1); }}
                className={`px-3 py-1 text-xs font-semibold rounded-[4px] transition-colors ${
                  filtroIdioma === 'en'
                    ? 'bg-[#1D5E51] text-white shadow-xs'
                    : 'text-[#5C6D65] hover:text-[#203B34]'
                }`}
              >
                Inglês ({stats?.ingles ?? 65})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabela de Obras Digitais */}
      <div className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D5DED7] bg-[#EFF6F2] text-[#0A372F] text-xs uppercase font-semibold tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Capa</th>
                <th className="py-3 px-4">Título da Obra</th>
                <th className="py-3 px-4">Autor</th>
                <th className="py-3 px-4">Idioma</th>
                <th className="py-3 px-4 text-center">ID Gutenberg</th>
                <th className="py-3 px-4 text-right">Downloads</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5DED7]">
              {carregando ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#5C6D65]">
                    Carregando catálogo digital...
                  </td>
                </tr>
              ) : livrosDigitais.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#5C6D65]">
                    Nenhuma obra digital encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                livrosDigitais.map((livro) => (
                  <tr 
                    key={livro.id} 
                    className="hover:bg-[#EFF6F2]/50 transition-colors"
                  >
                    {/* Capa */}
                    <td className="py-3 px-4 text-center">
                      <div className="w-9 h-12 bg-[#D5DED7] rounded overflow-hidden flex items-center justify-center shrink-0 mx-auto shadow-xs border border-[#D5DED7]">
                        {livro.cover_url ? (
                          <img 
                            src={livro.cover_url} 
                            alt="" 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <BookOpen className="w-4 h-4 text-[#7D8D83]" />
                        )}
                      </div>
                    </td>

                    {/* Título */}
                    <td className="py-3 px-4 font-semibold text-[#0A372F] max-w-xs">
                      <div className="line-clamp-2" title={livro.title}>
                        {livro.title}
                      </div>
                    </td>

                    {/* Autor */}
                    <td className="py-3 px-4 text-[#5C6D65] max-w-[200px] truncate" title={livro.authors}>
                      {livro.authors || 'Autor Desconhecido'}
                    </td>

                    {/* Idioma */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase tracking-wider ${
                        livro.language === 'pt'
                          ? 'bg-[#EFF6F2] text-[#1D5E51] border border-[#DCEDE6]'
                          : 'bg-[#FFF3D8] text-[#80602B] border border-[#F3E5C8]'
                      }`}>
                        {livro.language === 'pt' ? 'Português' : 'Inglês'}
                      </span>
                    </td>

                    {/* ID Gutenberg */}
                    <td className="py-3 px-4 text-center text-xs text-[#5C6D65] numeric">
                      #{livro.external_id}
                    </td>

                    {/* Downloads */}
                    <td className="py-3 px-4 text-right text-xs font-semibold text-[#203B34] numeric">
                      {(livro.download_count || 0).toLocaleString('pt-BR')}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[#1D5E51] bg-[#EFF6F2] px-2 py-0.5 rounded-full border border-[#DCEDE6]">
                        <CheckCircle2 className="w-3 h-3" /> Integral
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onAbrirDetalhes(livro)}
                          className="p-1.5 text-[#5C6D65] hover:text-[#0A372F] hover:bg-[#EFF6F2] rounded-[4px] transition-colors"
                          title="Ver Ficha Detalhada"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onLerAgora(livro)}
                          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-[4px] bg-[#1D5E51] hover:bg-[#154B41] text-white text-xs font-semibold transition-colors"
                          title="Abrir no Leitor Digital"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#C6A15B]" />
                          <span>Ler</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="p-4 border-t border-[#D5DED7] flex items-center justify-between bg-[#FFFFFF]">
            <span className="text-xs text-[#5C6D65] numeric">
              Página {paginaAtual} de {totalPaginas} ({totalLivros} obras)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={paginaAtual <= 1}
                onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                className="h-8 px-3 rounded-[4px] border border-[#D5DED7] text-xs font-medium text-[#203B34] hover:bg-[#EFF6F2] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              <button
                disabled={paginaAtual >= totalPaginas}
                onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                className="h-8 px-3 rounded-[4px] border border-[#D5DED7] text-xs font-medium text-[#203B34] hover:bg-[#EFF6F2] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Próxima</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
