import React from 'react';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Repeat, 
  Trash2, 
  Filter, 
  X
} from 'lucide-react';

export default function Acervo({
  livros,
  carregando,
  busca,
  setBusca,
  filtroDisponivel,
  setFiltroDisponivel,
  user,
  onAbrirNovoLivro,
  onFazerEmprestimo,
  onExcluirLivro,
  onLimparFiltros
}) {
  const totalObras = livros.length;
  const totalDisponiveis = livros.reduce((acc, l) => acc + (l.available_copies || 0), 0);

  // Filtragem local
  const livrosFiltrados = livros.filter((livro) => {
    if (filtroDisponivel && (livro.available_copies ?? 0) <= 0) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho da Página do Acervo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
              Acervo Bibliográfico
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6F2] text-[#1D5E51] border border-[#DCEDE6] numeric">
              {totalObras} {totalObras === 1 ? 'obra' : 'obras'} · {totalDisponiveis} {totalDisponiveis === 1 ? 'exemplar disponível' : 'exemplares disponíveis'}
            </span>
          </div>
          <p className="text-sm text-[#5C6D65] mt-1">
            Catálogo geral de obras registradas, controle de exemplares e circulação
          </p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={onAbrirNovoLivro}
            className="h-11 px-5 bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold rounded-[6px] flex items-center gap-2 shadow-sm transition-colors min-h-[44px] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Obra</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros e Busca Local do Acervo */}
      <div className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Campo de Busca com Escopo Explícito */}
        <div className="relative w-full md:max-w-md">
          <label htmlFor="busca-acervo" className="sr-only">Buscar no acervo</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6D65]" />
          <input
            id="busca-acervo"
            type="text"
            placeholder="Buscar por título, autor ou ISBN..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-11 pl-10 pr-10 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6D65] hover:text-[#203B34]"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros Auxiliares */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setFiltroDisponivel(!filtroDisponivel)}
            className={`h-11 px-4 text-xs font-semibold rounded-[6px] border flex items-center gap-2 transition-colors ${
              filtroDisponivel 
                ? 'bg-[#EAF4ED] border-[#216044] text-[#216044]' 
                : 'bg-[#FFFFFF] border-[#7D8D83] text-[#5C6D65] hover:bg-[#F0F2ED]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apenas com exemplares disponíveis</span>
          </button>

          {(busca || filtroDisponivel) && (
            <button
              type="button"
              onClick={onLimparFiltros}
              className="h-11 px-3 text-xs font-semibold text-[#A43535] hover:bg-[#FBEDEC] rounded-[6px] transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Obras (Desktop >= 768px) */}
      <div className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] overflow-hidden">
        
        {carregando ? (
          <div className="p-12 text-center text-[#5C6D65] space-y-3">
            <div className="w-6 h-6 border-2 border-[#1D5E51] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium">Carregando catálogo do acervo...</p>
          </div>
        ) : livrosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-[#5C6D65] space-y-3">
            <BookOpen className="w-10 h-10 text-[#7D8D83] mx-auto stroke-1" />
            <h3 className="text-base font-semibold text-[#203B34]">
              {busca ? `Nenhuma obra encontrada para "${busca}".` : 'O acervo ainda não possui obras cadastradas.'}
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              {busca 
                ? 'Tente utilizar termos mais genéricos ou confira a digitação do autor e do ISBN.' 
                : user?.role === 'admin' 
                  ? 'Utilize o botão acima para cadastrar o primeiro livro da biblioteca.' 
                  : 'Aguarde até que o operador cadastre as primeiras obras.'}
            </p>
            {busca && (
              <button
                onClick={onLimparFiltros}
                className="mt-2 text-xs font-semibold text-[#1D5E51] underline"
              >
                Limpar critérios de busca
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D5DED7] bg-[#F0F2ED] text-xs font-semibold text-[#5C6D65]">
                  <th scope="col" className="py-3.5 px-4 w-16">Capa</th>
                  <th scope="col" className="py-3.5 px-4">Obra & Autoria</th>
                  <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Gênero / Ano</th>
                  <th scope="col" className="py-3.5 px-4 hidden lg:table-cell">ISBN</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Exemplares</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Situação</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5DED7] text-sm text-[#203B34]">
                {livrosFiltrados.map((livro) => {
                  const disponivel = (livro.available_copies ?? 0) > 0;
                  return (
                    <tr key={livro.id} className="hover:bg-[#F7F6F1]/70 transition-colors">
                      
                      {/* Capa Miniatura 40x56px contain conforme design.md seção 9.7 */}
                      <td className="py-3 px-4">
                        <div className="w-10 h-14 rounded bg-[#F0F2ED] border border-[#D5DED7] overflow-hidden flex items-center justify-center shrink-0">
                          {livro.cover_path ? (
                            <img 
                              src={livro.cover_path} 
                              alt="" 
                              className="w-full h-full object-contain" 
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-[0.5625rem] text-[#5C6D65]/70">
                              <BookOpen className="w-4 h-4 mb-0.5" />
                              <span>Sem capa</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Título & Autor */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-semibold text-[#0A372F] line-clamp-2 leading-snug">
                          {livro.title}
                        </p>
                        <p className="text-xs text-[#5C6D65] mt-0.5">
                          {livro.author}
                        </p>
                      </td>

                      {/* Gênero / Ano */}
                      <td className="py-3 px-4 hidden md:table-cell text-xs text-[#5C6D65]">
                        <p>{livro.genre || 'Não informado'}</p>
                        <p className="numeric">{livro.published_year ? `Ano: ${livro.published_year}` : '—'}</p>
                      </td>

                      {/* ISBN */}
                      <td className="py-3 px-4 hidden lg:table-cell text-xs font-mono text-[#5C6D65] numeric">
                        {livro.isbn || '—'}
                      </td>

                      {/* Exemplares (Disponíveis / Totais) */}
                      <td className="py-3 px-4 text-center numeric">
                        <span className="font-bold text-[#203B34] text-base">
                          {livro.available_copies ?? 0}
                        </span>
                        <span className="text-xs text-[#5C6D65]">
                          /{livro.total_copies ?? 1}
                        </span>
                      </td>

                      {/* Situação com Badge Semântica */}
                      <td className="py-3 px-4 text-center">
                        {disponivel ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#EAF4ED] text-[#216044] border border-[#216044]/20 numeric">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#216044]" />
                            Disponível ({livro.available_copies})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#EDF3F8] text-[#285E7B] border border-[#285E7B]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#285E7B]" />
                            Em circulação
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onFazerEmprestimo(livro.id)}
                            disabled={!disponivel}
                            title={disponivel ? 'Solicitar empréstimo deste exemplar' : 'Exemplar sem disponibilidade imediata'}
                            className="h-9 px-3 bg-[#1D5E51] hover:bg-[#154B41] disabled:bg-[#F0F2ED] disabled:text-[#5C6D65] disabled:cursor-not-allowed text-white text-xs font-semibold rounded-[6px] flex items-center gap-1.5 transition-colors"
                          >
                            <Repeat className="w-3.5 h-3.5" />
                            <span>Emprestar</span>
                          </button>

                          {user?.role === 'admin' && (
                            <button
                              onClick={() => onExcluirLivro(livro.id, livro.title)}
                              className="h-9 w-9 p-0 bg-[#FFFFFF] hover:bg-[#FBEDEC] text-[#5C6D65] hover:text-[#A43535] border border-[#D5DED7] hover:border-[#A43535]/30 rounded-[6px] flex items-center justify-center transition-colors"
                              title="Remover obra do acervo"
                              aria-label={`Excluir obra ${livro.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
