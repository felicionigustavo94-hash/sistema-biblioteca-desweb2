import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, AlertCircle, Shield } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('leitor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password, phone, role });
      navigate('/livros');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-full max-w-md">
        
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-xl mb-3">
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Criar Nova Conta</h1>
          <p className="text-slate-500 text-sm mt-1">Preencha seus dados para se cadastrar</p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <div className="relative">
              <User className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (Opcional)</label>
            <div className="relative">
              <Phone className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Perfil de Acesso</label>
            <div className="relative">
              <Shield className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="leitor">Leitor (Consulta e Empréstimo)</option>
                <option value="admin">Administrador (Gestão Total)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>{loading ? 'Cadastrando...' : 'Finalizar Cadastro'}</span>
          </button>
        </form>

        {/* Link para Login */}
        <div className="text-center mt-6 text-sm text-slate-600">
          Já possui conta?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Faça login aqui
          </Link>
        </div>

      </div>
    </div>
  );
}