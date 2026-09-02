import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'leitor',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Erro ao processar requisição. Verifique os dados informados.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Preenche dados de teste rápido para demonstração ao professor
  const fillTestData = (email, password) => {
    setFormData((prev) => ({ ...prev, email, password }));
    setIsRegister(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-md">
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-100 text-indigo-700 rounded-xl mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isRegister ? 'Criar Conta' : 'Acessar Biblioteca'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister ? 'Cadastre-se para solicitar empréstimos' : 'Digite seu e-mail e senha para continuar'}
          </p>
        </div>

        {/* Abas Alternar Login / Cadastro */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition cursor-pointer ${
              !isRegister ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition cursor-pointer ${
              isRegister ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Cadastrar-se
          </button>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: João da Silva"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="seu-email@exemplo.com"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Senha</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone (Opcional)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 98888-7777"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Aguarde...' : isRegister ? 'Criar Minha Conta' : 'Acessar Conta'}</span>
          </button>
        </form>

        {/* Dicas para Apresentação Rápida */}
        {!isRegister && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Contas de Teste Rápidas (Apresentação):</p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => fillTestData('admin@biblioteca.com', 'password123')}
                className="text-left text-xs bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 transition text-slate-700 flex justify-between cursor-pointer"
              >
                <span>👑 <strong>Admin:</strong> admin@biblioteca.com</span>
                <span className="text-slate-400">Preencher</span>
              </button>
              <button
                type="button"
                onClick={() => fillTestData('leitor@biblioteca.com', 'password123')}
                className="text-left text-xs bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 transition text-slate-700 flex justify-between cursor-pointer"
              >
                <span>📖 <strong>Leitor:</strong> leitor@biblioteca.com</span>
                <span className="text-slate-400">Preencher</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}