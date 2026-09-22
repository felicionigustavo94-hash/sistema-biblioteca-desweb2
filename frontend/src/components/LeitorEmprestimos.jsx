import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Calendar,
  Library,
  ArrowRight,
  Info
} from 'lucide-react';

export default function LeitorEmprestimos({
  emprestimos,
  user,
  setPagina
}) {
  const [abaAtiva, setAbaAtiva] = useState('ativos'); // 'ativos', 'historico'

  // Filtrar apenas os empréstimos pertencentes ao leitor autenticado
  const meusEmprestimos = user
    ? emprestimos.filter(e => String(e.user_id) === String(user.id))
    : emprestimos;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeStr = hoje.toISOString().split('T')[0];

  const ativos = meusEmprestimos.filter(e => e.status !== 'devolvido');
  const historico = meusEmprestimos.filter(e => e.status === 'devolvido');

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

  const calcularPrazo = (dueDateStr) => {
    if (!dueDateStr) return { texto: 'Sem prazo estipulado', tipo: 'normal', dias: 0 };
    try {
      const [ano, mes, dia] = dueDateStr.split('T')[0].split('-').map(Number);
      const dataVenc = new Date(ano, mes - 1, dia);
      const diffTime = dataVenc - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return {
          texto: `Em atraso há ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'dia' : 'dias'}`,
          tipo: 'atrasado',
          dias: diffDays
        };
      } else if (diffDays === 0) {
        return {
          texto: 'Vence hoje!',
          tipo: 'alerta',
          dias: 0
        };
      } else if (diffDays <= 3) {
        return {
          texto: `Vence em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`,
          tipo: 'alerta',
          dias: diffDays
        };
      } else {
        return {
          texto: `${diffDays} dias restantes`,
          tipo: 'normal',
          dias: diffDays
        };
      }
    } catch {
      return { texto: dueDateStr, tipo: 'normal', dias: 0 };
    }
  };

  const listaExibida = abaAtiva === 'ativos' ? ativos : historico;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Cabeçalho de Contexto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
              Meus Empréstimos Físicos
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6F2] text-[#1D5E51] border border-[#DCEDE6] numeric">
              {ativos.length} {ativos.length === 1 ? 'livro em posse' : 'livros em posse'}
            </span>
          </div>
          <p className="text-sm text-[#5C6D65] mt-1">
            Consulte os exemplares físicos retirados na biblioteca, prazos de devolução e histórico
          </p>
        </div>

        <button
          onClick={() => setPagina('explorar')}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-[6px] bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold transition-colors shadow-xs shrink-0"
        >
          <BookOpen className="w-4 h-4 text-[#C6A15B]" />
          <span>Explorar Catálogo</span>
        </button>
      </div>

      {/* 2. Banner Informativo de Circulação */}
      <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#D5DED7] flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-[#1D5E51] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#5C6D65] leading-relaxed">
          <strong className="text-[#0A372F] font-semibold">Regulamento de Devolução:</strong> O prazo padrão de empréstimo de exemplares do acervo físico é de 14 dias corridos. Para renovar o prazo de devolução ou esclarecer dúvidas, dirija-se ao balcão de atendimento com um operador.
        </div>
      </div>

      {/* 3. Abas de Navegação */}
      <div className="flex gap-2 border-b border-[#D5DED7]">
        <button
          onClick={() => setAbaAtiva('ativos')}
          className={`h-11 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            abaAtiva === 'ativos'
              ? 'border-[#1D5E51] text-[#0A372F]'
              : 'border-transparent text-[#5C6D65] hover:text-[#203B34]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#1D5E51]" />
          <span>Empréstimos Ativos ({ativos.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('historico')}
          className={`h-11 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            abaAtiva === 'historico'
              ? 'border-[#1D5E51] text-[#0A372F]'
              : 'border-transparent text-[#5C6D65] hover:text-[#203B34]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#1D5E51]" />
          <span>Histórico Devolvido ({historico.length})</span>
        </button>
      </div>

      {/* 4. Lista de Empréstimos */}
      {listaExibida.length === 0 ? (
        <div className="p-12 text-center text-[#5C6D65] bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] space-y-3">
          <Library className="w-10 h-10 text-[#7D8D83] mx-auto stroke-1" />
          <p className="text-base font-semibold text-[#0A372F]">
            {abaAtiva === 'ativos' 
              ? 'Nenhum empréstimo ativo no momento' 
              : 'Nenhum histórico de devolução registrado'}
          </p>
          <p className="text-xs text-[#5C6D65] max-w-sm mx-auto">
            {abaAtiva === 'ativos'
              ? 'Você não possui livros físicos retirados. Que tal explorar os livros digitais disponíveis agora?'
              : 'Quando você devolver um exemplar físico, o registro aparecerá nesta aba.'}
          </p>
          {abaAtiva === 'ativos' && (
            <button
              onClick={() => setPagina('explorar')}
              className="mt-3 inline-flex items-center gap-2 h-9 px-4 rounded-[6px] bg-[#1D5E51] text-white text-xs font-semibold hover:bg-[#154B41]"
            >
              <span>Explorar Obras Disponíveis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listaExibida.map((emp) => {
            const statusPrazo = calcularPrazo(emp.due_date);
            const isDevolvido = emp.status === 'devolvido';

            return (
              <div 
                key={emp.id}
                className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[10px] p-5 shadow-xs flex flex-col justify-between hover:border-[#1D5E51]/40 transition-colors"
              >
                <div>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs text-[#5C6D65] numeric">
                      Protocolo #{emp.id}
                    </span>

                    {isDevolvido ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4ED] text-[#1D5E51] border border-[#DCEDE6]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Devolvido
                      </span>
                    ) : statusPrazo.tipo === 'atrasado' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FBEAE9] text-[#A43535] border border-[#F5C2BF]">
                        <AlertCircle className="w-3.5 h-3.5" /> {statusPrazo.texto}
                      </span>
                    ) : statusPrazo.tipo === 'alerta' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF3D8] text-[#80602B] border border-[#F3E5C8]">
                        <Clock className="w-3.5 h-3.5" /> {statusPrazo.texto}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6F2] text-[#1D5E51] border border-[#DCEDE6]">
                        <Clock className="w-3.5 h-3.5" /> Em dia ({statusPrazo.texto})
                      </span>
                    )}
                  </div>

                  {/* Informações da Obra */}
                  <h3 className="font-editorial text-lg font-medium text-[#0A372F] leading-snug line-clamp-2">
                    {emp.book?.title || 'Título não disponível'}
                  </h3>
                  <p className="text-xs text-[#5C6D65] mt-1 font-medium">
                    {emp.book?.author || 'Autor desconhecido'}
                  </p>
                </div>

                {/* Datas e Detalhes */}
                <div className="mt-4 pt-3 border-t border-[#D5DED7] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#5C6D65] block">Data de Retirada</span>
                    <span className="font-semibold text-[#203B34] numeric flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5C6D65]" />
                      {formatarData(emp.loan_date || emp.created_at)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#5C6D65] block">
                      {isDevolvido ? 'Devolvido em' : 'Prazo de Devolução'}
                    </span>
                    <span className={`font-semibold numeric flex items-center gap-1 mt-0.5 ${
                      !isDevolvido && statusPrazo.tipo === 'atrasado' 
                        ? 'text-[#A43535]' 
                        : 'text-[#203B34]'
                    }`}>
                      <Clock className="w-3.5 h-3.5 text-[#5C6D65]" />
                      {isDevolvido 
                        ? formatarData(emp.returned_at) 
                        : formatarData(emp.due_date)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
