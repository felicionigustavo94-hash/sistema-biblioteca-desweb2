import React, { useState } from 'react';
import { X, Repeat, User, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ModalNovoEmprestimo({
  aberto,
  onClose,
  onSucesso,
  livros,
  usuarios,
  user,
  apiUrl,
  getHeaders
}) {
  const [livroSelecionadoId, setLivroSelecionadoId] = useState('');
  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState(user?.role === 'admin' ? '' : user?.id || '');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  if (!aberto) return null;

  // Prazo padrão de 14 dias calculado (design.md seção 11 e 13)
  const hoje = new Date();
  const dataVencimento = new Date();
  dataVencimento.setDate(hoje.getDate() + 14);

  const opcoesData = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const hojeFormatado = hoje.toLocaleDateString('pt-BR', opcoesData);
  const vencimentoFormatado = dataVencimento.toLocaleDateString('pt-BR', opcoesData);

  // Apenas livros com exemplares disponíveis
  const livrosDisponiveis = livros.filter(l => (l.available_copies ?? 0) > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!livroSelecionadoId) {
      setErro('Selecione uma obra disponível no acervo.');
      return;
    }

    try {
      setSalvando(true);
      setErro(null);

      const payload = {
        book_id: parseInt(livroSelecionadoId),
        ...(user?.role === 'admin' && usuarioSelecionadoId ? { user_id: parseInt(usuarioSelecionadoId) } : {})
      };

      const res = await axios.post(`${apiUrl}/loans`, payload, getHeaders());
      onSucesso(res.data.message || 'Empréstimo registrado.');
      onClose();
      setLivroSelecionadoId('');
    } catch (e) {
      setErro(e.response?.data?.message || 'Não foi possível registrar o empréstimo.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0A372F]/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog (design.md: 12px radius, até 640px) */}
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-[12px] shadow-2xl border border-[#D5DED7] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-[#D5DED7] flex items-center justify-between bg-[#F7F6F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#EFF6F2] text-[#1D5E51] flex items-center justify-center border border-[#DCEDE6]">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0A372F] leading-tight">
                Registrar Empréstimo
              </h2>
              <p className="text-xs text-[#5C6D65] mt-0.5">
                Vincule uma obra disponível a um leitor cadastrado
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5C6D65] hover:text-[#203B34] hover:bg-[#EAF4ED] rounded-[6px] transition-colors"
            aria-label="Fechar diálogo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {erro && (
            <div className="flex items-center gap-2 p-3 text-sm text-[#A43535] bg-[#FBEDEC] border border-[#A43535]/30 rounded-[6px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Seleção de Obra */}
          <div>
            <label className="block text-xs font-semibold text-[#203B34] mb-1">
              Selecionar Obra Disponível <span className="text-[#A43535]">*</span>
            </label>
            <select
              required
              value={livroSelecionadoId}
              onChange={(e) => setLivroSelecionadoId(e.target.value)}
              className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] focus:outline-none focus:border-[#1D5E51]"
            >
              <option value="">Selecione uma obra do acervo...</option>
              {livrosDisponiveis.map((livro) => (
                <option key={livro.id} value={livro.id}>
                  {livro.title} — {livro.author} ({livro.available_copies} {livro.available_copies === 1 ? 'disponível' : 'disponíveis'})
                </option>
              ))}
            </select>
          </div>

          {/* Seleção de Leitor (Se for Operador/Admin) */}
          {user?.role === 'admin' && usuarios?.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Leitor(a) Destinatário(a) <span className="text-[#A43535]">*</span>
              </label>
              <select
                required
                value={usuarioSelecionadoId}
                onChange={(e) => setUsuarioSelecionadoId(e.target.value)}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] focus:outline-none focus:border-[#1D5E51]"
              >
                <option value="">Selecione o leitor cadastrado...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) · {u.role === 'admin' ? 'Operador' : 'Leitor'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Leitor Conectado
              </label>
              <div className="h-11 px-3 bg-[#F0F2ED] border border-[#D5DED7] rounded-[6px] text-sm text-[#203B34] flex items-center gap-2">
                <User className="w-4 h-4 text-[#5C6D65]" />
                <span className="font-medium">{user?.name || 'Leitor atual'}</span>
                <span className="text-xs text-[#5C6D65]">({user?.email})</span>
              </div>
            </div>
          )}

          {/* Resumo da Política de Circulação (design.md seção 11) */}
          <div className="p-3.5 bg-[#EFF6F2] border border-[#DCEDE6] rounded-[8px] space-y-2 text-xs text-[#203B34]">
            <div className="flex items-center justify-between">
              <span className="text-[#5C6D65]">Data do Empréstimo:</span>
              <span className="font-semibold numeric">{hojeFormatado}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5C6D65]">Prazo Regulamentar:</span>
              <span className="font-semibold text-[#1D5E51]">14 dias corridos</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#DCEDE6] pt-1.5">
              <span className="font-medium text-[#0A372F]">Vencimento Previsto:</span>
              <span className="font-bold text-[#0A372F] numeric">{vencimentoFormatado}</span>
            </div>
          </div>

          {/* Botões */}
          <div className="pt-3 border-t border-[#D5DED7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 text-sm font-medium text-[#5C6D65] hover:text-[#203B34] hover:bg-[#F0F2ED] rounded-[6px] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || !livroSelecionadoId}
              className="h-11 px-6 bg-[#1D5E51] hover:bg-[#154B41] disabled:bg-[#F0F2ED] disabled:text-[#5C6D65] text-white text-sm font-semibold rounded-[6px] flex items-center gap-2 shadow-sm transition-colors"
            >
              {salvando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Confirmar Empréstimo</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
