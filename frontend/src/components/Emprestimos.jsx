import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen
} from 'lucide-react';

export default function Emprestimos({
  emprestimos,
  onAbrirNovoEmprestimo,
  onDevolverLivro
}) {
  const [abaAtiva, setAbaAtiva] = useState('ativos'); // 'ativos', 'atrasados', 'devolvidos'
  const [termoBusca, setTermoBusca] = useState('');

  const hojeStr = new Date().toISOString().split('T')[0];

  // Separar grupos
  const emprestimosAtivos = emprestimos.filter(e => e.status !== 'devolvido');
  const emprestimosEmAtraso = emprestimosAtivos.filter(e => e.due_date && e.due_date < hojeStr);
  const emprestimosDevolvidos = emprestimos.filter(e => e.status === 'devolvido');

  const getListaAtual = () => {
    let base = [];
    if (abaAtiva === 'ativos') base = emprestimosAtivos;
    else if (abaAtiva === 'atrasados') base = emprestimosEmAtraso;
    else if (abaAtiva === 'devolvidos') base = emprestimosDevolvidos;

    if (!termoBusca.trim()) return base;
    const termo = termoBusca.toLowerCase();
    return base.filter(e => 
      e.book?.title?.toLowerCase().includes(termo) ||
      e.user?.name?.toLowerCase().includes(termo) ||
      e.user?.email?.toLowerCase().includes(termo)
    );
  };

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

  const listaFiltrada = getListaAtual();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
            Empréstimos e Circulação
          </h2>
          <p className="text-sm text-[#5C6D65] mt-1">
            Controle de retiradas, prazos regulamentares, devoluções e histórico
          </p>
        </div>

        <button
          onClick={onAbrirNovoEmprestimo}
          className="h-11 px-5 bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold rounded-[6px] flex items-center gap-2 shadow-sm transition-colors min-h-[44px] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Empréstimo</span>
        </button>
      </div>

      {/* Abas Operacionais com Contadores Tabulares (design.md seção 10) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5DED7]">
        <div className="flex gap-2">
          <button
            onClick={() => setAbaAtiva('ativos')}
            className={`h-11 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              abaAtiva === 'ativos'
                ? 'border-[#1D5E51] text-[#0A372F]'
                : 'border-transparent text-[#5C6D65] hover:text-[#203B34]'
            }`}
          >
            <span>Ativos</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold numeric ${
              abaAtiva === 'ativos' ? 'bg-[#EFF6F2] text-[#1D5E51]' : 'bg-[#F0F2ED] text-[#5C6D65]'
            }`}>
              {emprestimosAtivos.length}
            </span>
          </button>

          <button
            onClick={() => setAbaAtiva('atrasados')}
            className={`h-11 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              abaAtiva === 'atrasados'
                ? 'border-[#A43535] text-[#A43535]'
                : 'border-transparent text-[#5C6D65] hover:text-[#A43535]'
            }`}
          >
            <span>Em atraso</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold numeric ${
              emprestimosEmAtraso.length > 0 
                ? 'bg-[#FBEDEC] text-[#A43535]' 
                : 'bg-[#F0F2ED] text-[#5C6D65]'
            }`}>
              {emprestimosEmAtraso.length}
            </span>
          </button>

          <button
            onClick={() => setAbaAtiva('devolvidos')}
            className={`h-11 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              abaAtiva === 'devolvidos'
                ? 'border-[#1D5E51] text-[#0A372F]'
                : 'border-transparent text-[#5C6D65] hover:text-[#203B34]'
            }`}
          >
            <span>Histórico de Devolvidos</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold numeric ${
              abaAtiva === 'devolvidos' ? 'bg-[#EFF6F2] text-[#1D5E51]' : 'bg-[#F0F2ED] text-[#5C6D65]'
            }`}>
              {emprestimosDevolvidos.length}
            </span>
          </button>
        </div>

        {/* Busca por leitor ou obra nesta aba */}
        <div className="pb-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filtrar por obra ou leitor..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full sm:w-64 h-9 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-xs text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
          />
        </div>
      </div>

      {/* Tabela de Circulação */}
      <div className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] overflow-hidden">
        {listaFiltrada.length === 0 ? (
          <div className="p-12 text-center text-[#5C6D65] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#216044] mx-auto stroke-1" />
            <p className="text-sm font-semibold text-[#203B34]">
              {abaAtiva === 'atrasados' 
                ? 'Nenhum empréstimo em atraso no momento.' 
                : abaAtiva === 'ativos'
                  ? 'Nenhum empréstimo ativo no momento.'
                  : 'Nenhum registro no histórico de devoluções.'}
            </p>
            <p className="text-xs">
              {abaAtiva === 'atrasados' 
                ? 'Todos os leitores estão com prazos regulamentares em dia.' 
                : 'Utilize o botão superior para registrar retiradas de exemplares.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D5DED7] bg-[#F0F2ED] text-xs font-semibold text-[#5C6D65]">
                  <th scope="col" className="py-3.5 px-4">Obra & ISBN</th>
                  <th scope="col" className="py-3.5 px-4">Leitor(a)</th>
                  <th scope="col" className="py-3.5 px-4">Data Empréstimo</th>
                  <th scope="col" className="py-3.5 px-4">Vencimento Previsto</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Situação</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5DED7] text-sm text-[#203B34]">
                {listaFiltrada.map((emp) => {
                  const isDevolvido = emp.status === 'devolvido';
                  const emAtraso = !isDevolvido && emp.due_date && emp.due_date < hojeStr;

                  return (
                    <tr key={emp.id} className="hover:bg-[#F7F6F1]/70 transition-colors">
                      
                      {/* Obra */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-10 rounded bg-[#F0F2ED] border border-[#D5DED7] overflow-hidden flex items-center justify-center shrink-0 mt-0.5">
                            {emp.book?.cover_path ? (
                              <img 
                                src={emp.book.cover_path} 
                                alt="" 
                                className="w-full h-full object-contain" 
                              />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-[#5C6D65]/60" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0A372F] line-clamp-1 leading-snug">
                              {emp.book?.title || 'Obra não informada'}
                            </p>
                            <p className="text-xs text-[#5C6D65]">
                              {emp.book?.author || 'Autor não informado'}
                            </p>
                            {emp.book?.isbn && (
                              <p className="text-[0.6875rem] font-mono text-[#5C6D65]/70 numeric mt-0.5">
                                ISBN: {emp.book.isbn}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Leitor */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#203B34] text-xs">
                          {emp.user?.name || 'Leitor desconhecido'}
                        </p>
                        <p className="text-[0.6875rem] text-[#5C6D65]">
                          {emp.user?.email || '—'}
                        </p>
                      </td>

                      {/* Data Empréstimo */}
                      <td className="py-3.5 px-4 text-xs text-[#5C6D65] numeric">
                        {formatarData(emp.loan_date || emp.created_at?.split('T')[0])}
                      </td>

                      {/* Data Vencimento */}
                      <td className="py-3.5 px-4 text-xs numeric font-medium">
                        <span className={emAtraso ? 'text-[#A43535] font-bold' : 'text-[#203B34]'}>
                          {formatarData(emp.due_date)}
                        </span>
                      </td>

                      {/* Situação com Badge Semântica Conforme design.md seção 9.5 */}
                      <td className="py-3.5 px-4 text-center">
                        {isDevolvido ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#F0F2ED] text-[#5C6D65]">
                            Devolvido
                          </span>
                        ) : emAtraso ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FBEDEC] text-[#A43535] border border-[#A43535]/30">
                            <AlertCircle className="w-3 h-3" />
                            Em atraso
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#EDF3F8] text-[#285E7B]">
                            <Clock className="w-3 h-3" />
                            Em dia
                          </span>
                        )}
                      </td>

                      {/* Ação */}
                      <td className="py-3.5 px-4 text-right">
                        {!isDevolvido ? (
                          <button
                            onClick={() => onDevolverLivro(emp.id)}
                            className="h-9 px-3 bg-[#FFFFFF] hover:bg-[#EAF4ED] border border-[#7D8D83] hover:border-[#216044] text-[#216044] text-xs font-semibold rounded-[6px] transition-colors"
                          >
                            Confirmar devolução
                          </button>
                        ) : (
                          <span className="text-xs text-[#5C6D65] italic">
                            Concluído em {formatarData(emp.return_date)}
                          </span>
                        )}
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
