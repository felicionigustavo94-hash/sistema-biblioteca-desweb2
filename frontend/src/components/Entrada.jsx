import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function Entrada({
  onLogin,
  carregando,
  erro,
  setPagina
}) {
  const [isCadastro, setIsCadastro] = useState(false);
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Card Principal de Entrada (design.md seção 10) */}
      <div className="w-full max-w-4xl bg-[#FFFFFF] rounded-[12px] shadow-xl border border-[#D5DED7] overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Território Institucional Verde (5 colunas) */}
        <div className="md:col-span-5 bg-[#0A372F] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden" data-surface="dark">
          
          {/* Fundo com sutis ornamentos geométricos (quadrados de conhecimento) */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#1D5E51]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-12 right-6 flex gap-1.5 opacity-30 pointer-events-none">
            <div className="w-2.5 h-2.5 bg-[#C6A15B] rounded-[2px]" />
            <div className="w-2 h-2 bg-[#C6A15B] rounded-[2px] mt-2" />
            <div className="w-1.5 h-1.5 bg-[#C6A15B] rounded-[1px] mt-4" />
          </div>

          <div>
            {/* Logomarca Oficial em Versão Reversa */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo-symbol.png" 
                alt="Símbolo BiblioGest" 
                className="w-10 h-10 object-contain brightness-0 invert" 
              />
              <span className="text-2xl font-bold tracking-tight text-white">
                Biblio<span className="text-[#C6A15B]">Gest</span>
              </span>
            </div>

            {/* Chamada Editorial com a fonte Lora (design.md seção 6 e 10) */}
            <div className="mt-12 space-y-3">
              <div className="w-10 h-0.5 bg-[#C6A15B]" />
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-white leading-snug">
                Conhecimento em circulação.
              </h2>
              <p className="text-sm text-[#DCEDE6] font-normal leading-relaxed">
                Organize o acervo e acompanhe cada empréstimo com a clareza e o rigor de uma ficha catalográfica moderna.
              </p>
            </div>
          </div>

          {/* Atalhos para Avaliação Rápida do Professor */}
          <div className="mt-10 pt-6 border-t border-[#1D5E51] space-y-2">
            <p className="text-[0.6875rem] font-semibold text-[#C6A15B] uppercase tracking-wider">
              Acesso Rápido para Avaliação:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => preencherCredenciais('admin@biblioteca.com', 'admin123')}
                className="p-2 rounded-[6px] bg-[#1D5E51]/50 hover:bg-[#1D5E51] border border-[#1D5E51] text-left transition-colors"
              >
                <div className="flex items-center gap-1 text-xs font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Operador</span>
                </div>
                <p className="text-[0.625rem] text-[#DCEDE6] truncate">admin@biblioteca.com</p>
              </button>

              <button
                type="button"
                onClick={() => preencherCredenciais('leitor@biblioteca.com', 'leitor123')}
                className="p-2 rounded-[6px] bg-[#1D5E51]/50 hover:bg-[#1D5E51] border border-[#1D5E51] text-left transition-colors"
              >
                <div className="flex items-center gap-1 text-xs font-semibold text-white">
                  <UserCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Leitor</span>
                </div>
                <p className="text-[0.625rem] text-[#DCEDE6] truncate">leitor@biblioteca.com</p>
              </button>
            </div>
          </div>

        </div>

        {/* Área Clara de Formulário (7 colunas) */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-[#FFFFFF]">
          
          <div className="max-w-md mx-auto w-full space-y-6">
            
            {/* Título do Formulário */}
            <div>
              <h3 className="text-xl font-bold text-[#0A372F] tracking-tight">
                {isCadastro ? 'Criar Nova Conta' : 'Acessar o Sistema'}
              </h3>
              <p className="text-xs text-[#5C6D65] mt-1">
                {isCadastro 
                  ? 'Cadastre-se para solicitar empréstimos e consultar o acervo' 
                  : 'Informe suas credenciais para autenticar sua sessão'}
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="flex items-center gap-2 p-3 text-xs text-[#A43535] bg-[#FBEDEC] border border-[#A43535]/30 rounded-[6px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isCadastro && (
                <div>
                  <label className="block text-xs font-semibold text-[#203B34] mb-1">
                    Nome Completo <span className="text-[#A43535]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Silva"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#203B34] mb-1">
                  E-mail Institucional <span className="text-[#A43535]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@biblioteca.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#203B34] mb-1">
                  Senha de Acesso <span className="text-[#A43535]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
                />
              </div>

              {isCadastro && (
                <div>
                  <label className="block text-xs font-semibold text-[#203B34] mb-1">
                    Tipo de Cadastro
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] focus:outline-none focus:border-[#1D5E51]"
                  >
                    <option value="leitor">Leitor(a) da Biblioteca</option>
                    <option value="admin">Operador(a) / Administrador(a)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full h-11 bg-[#1D5E51] hover:bg-[#154B41] disabled:bg-[#F0F2ED] disabled:text-[#5C6D65] text-white text-sm font-semibold rounded-[6px] flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                {carregando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    {isCadastro ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    <span>{isCadastro ? 'Cadastrar Conta' : 'Entrar no Sistema'}</span>
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
                  : 'Não possui conta? Cadastre-se como novo leitor'}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
