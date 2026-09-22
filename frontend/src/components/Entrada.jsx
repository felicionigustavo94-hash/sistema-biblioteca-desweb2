import React, { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Entrada({
  onLogin,
  carregando,
  erro,
  onVoltar
}) {
  const [isCadastro, setIsCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'leitor'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(form, isCadastro);
  };

  const preencherCredenciais = (email, pass) => {
    setIsCadastro(false);
    setForm(prev => ({
      ...prev,
      email,
      password: pass
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A372F] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden" data-surface="dark">
      
      {/* Elementos Gráficos Sutis de Identidade (design.md seção 7 e 19) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1D5E51]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Botão Superior para Voltar ao Catálogo Público */}
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between z-10">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#DCEDE6] hover:text-white transition-colors py-2 px-3 rounded-[6px] hover:bg-[#154B41]/50"
        >
          <ArrowLeft className="w-4 h-4 text-[#C6A15B]" />
          <span>Voltar à Biblioteca</span>
        </button>

        <span className="text-xs text-[#DCEDE6]/60 numeric hidden sm:inline">
          BiblioGest · Autenticação Segura
        </span>
      </div>

      {/* Card Principal de Entrada Centralizado */}
      <div className="w-full max-w-4xl bg-[#FFFFFF] rounded-[12px] shadow-2xl border border-[#154B41] overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Painel Institucional e Editorial Esquerdo (5 colunas) */}
        <div className="md:col-span-5 bg-[#072A24] text-white p-8 sm:p-10 flex flex-col justify-between relative">
          
          <div>
            {/* Logomarca Oficial em Versão Reversa Nítida */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo-symbol.png" 
                alt="Símbolo BiblioGest" 
                className="w-10 h-10 object-contain brightness-0 invert" 
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white leading-none">
                  Biblio<span className="text-[#C6A15B]">Gest</span>
                </span>
                <span className="text-[0.6875rem] font-medium text-[#C6A15B] tracking-wider uppercase mt-0.5">
                  Conhecimento em circulação
                </span>
              </div>
            </div>

            {/* Chamada Editorial com a fonte Lora */}
            <div className="mt-12 space-y-3">
              <div className="w-10 h-0.5 bg-[#C6A15B]" />
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-white leading-snug">
                Conhecimento em circulação.
              </h2>
              <p className="text-sm text-[#DCEDE6] font-normal leading-relaxed">
                Descubra centenas de livros digitais em domínio público, continue suas leituras e acompanhe seus empréstimos físicos em uma única plataforma.
              </p>
            </div>
          </div>

          {/* Atalhos de Avaliação / Demonstração Acadêmica Claramente Identificados */}
          <div className="mt-8 pt-6 border-t border-[#154B41] space-y-2">
            <p className="text-[0.6875rem] font-semibold text-[#C6A15B] uppercase tracking-wider">
              Contas de Demonstração (Avaliação):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => preencherCredenciais('leitor@biblioteca.com', 'leitor123')}
                className="p-2.5 rounded-[6px] bg-[#0A372F] hover:bg-[#1D5E51] border border-[#154B41] text-left transition-colors group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-[#C6A15B]">
                  Conta Leitor
                </div>
                <p className="text-[0.625rem] text-[#DCEDE6]/80 truncate">leitor@biblioteca.com</p>
              </button>

              <button
                type="button"
                onClick={() => preencherCredenciais('admin@biblioteca.com', 'admin123')}
                className="p-2.5 rounded-[6px] bg-[#0A372F] hover:bg-[#1D5E51] border border-[#154B41] text-left transition-colors group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-[#C6A15B]">
                  Conta Operador
                </div>
                <p className="text-[0.625rem] text-[#DCEDE6]/80 truncate">admin@biblioteca.com</p>
              </button>
            </div>
          </div>

        </div>

        {/* Formulário de Autenticação Direito (7 colunas) */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-[#FFFFFF] text-[#203B34]">
          
          <div className="max-w-md mx-auto w-full space-y-6">
            
            {/* Título do Formulário */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A372F] tracking-tight">
                {isCadastro ? 'Cadastre sua Conta' : 'Acesse sua Conta'}
              </h3>
              <p className="text-xs text-[#5C6D65] mt-1">
                {isCadastro 
                  ? 'Preencha seus dados para salvar favoritos e progresso de leitura' 
                  : 'Informe suas credenciais para continuar'}
              </p>
            </div>

            {/* Mensagem de Erro de Validação */}
            {erro && (
              <div className="flex items-center gap-2 p-3 text-xs text-[#A43535] bg-[#FBEDEC] border border-[#A43535]/30 rounded-[6px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {/* Formulário com Labels Persistentes */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isCadastro && (
                <div>
                  <label className="block text-xs font-semibold text-[#203B34] mb-1">
                    Nome Completo <span className="text-[#A43535]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Ex: Carlos Drummond"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#203B34] mb-1">
                  E-mail <span className="text-[#A43535]">*</span>
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#203B34] mb-1">
                  Senha de Acesso <span className="text-[#A43535]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    required
                    autoComplete={isCadastro ? 'new-password' : 'current-password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full h-11 pl-3 pr-10 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6D65] hover:text-[#203B34] transition-colors"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full h-11 bg-[#1D5E51] hover:bg-[#154B41] disabled:bg-[#F0F2ED] disabled:text-[#5C6D65] text-white text-sm font-semibold rounded-[6px] flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
              >
                {carregando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    {isCadastro ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    <span>{isCadastro ? 'Criar Conta' : 'Entrar na Biblioteca'}</span>
                  </>
                )}
              </button>

            </form>

            {/* Alternar Cadastro / Login */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCadastro(!isCadastro);
                  setForm({ name: '', email: '', password: '', role: 'leitor' });
                }}
                className="text-xs text-[#1D5E51] hover:underline font-semibold"
              >
                {isCadastro 
                  ? 'Já possui uma conta? Faça login aqui' 
                  : 'Ainda não possui conta? Cadastre-se gratuitamente'}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
