import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Repeat, CheckCircle2, RotateCcw, Calendar, AlertCircle, BookOpen } from 'lucide-react';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();

  // Carrega os empréstimos da API
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/loans');
      setLoans(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
      setMessage({ type: 'error', text: 'Não foi possível carregar os empréstimos. Faça login para visualizar.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Registrar devolução do livro
  const handleReturn = async (loanId) => {
    try {
      const response = await api.post(`/loans/${loanId}/return`);
      setMessage({ type: 'success', text: response.data.message || 'Livro devolvido com sucesso!' });
      fetchLoans();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao devolver livro.' });
    }
  };

  // Renovar prazo de empréstimo (+7 dias)
  const handleRenew = async (loanId) => {
    try {
      const response = await api.post(`/loans/${loanId}/renew`);
      setMessage({ type: 'success', text: response.data.message || 'Empréstimo renovado por mais 7 dias!' });
      fetchLoans();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao renovar empréstimo.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Controle de Empréstimos</h1>
          <p className="text-slate-500 text-sm mt-1">Acompanhe datas de devolução, livros retirados e status</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm w-fit"
        >
          <BookOpen className="w-4 h-4" />
          <span>Ver Acervo</span>
        </Link>
      </div>

      {/* Alertas */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center justify-between gap-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Tabela de Empréstimos */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 text-sm mt-3">Carregando empréstimos...</p>
        </div>
      ) : loans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">Nenhum empréstimo registrado</h3>
          <p className="text-slate-500 text-sm mt-1">Visite a página de livros e clique em "Emprestar Livro" para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Livro</th>
                <th className="px-6 py-3.5 font-semibold">Leitor</th>
                <th className="px-6 py-3.5 font-semibold">Data Retirada</th>
                <th className="px-6 py-3.5 font-semibold">Devolução Prevista</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((loan) => {
                const isReturned = loan.status === 'devolvido';
                const isLate = loan.status === 'atrasado';

                return (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{loan.book?.title || 'Livro não encontrado'}</div>
                      <div className="text-xs text-slate-500">{loan.book?.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{loan.user?.name || 'Leitor'}</div>
                      <div className="text-xs text-slate-400">{loan.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{loan.loan_date}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700">{loan.due_date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isReturned
                            ? 'bg-emerald-100 text-emerald-800'
                            : isLate
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isReturned ? 'Devolvido' : isLate ? 'Atrasado' : 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isReturned ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReturn(loan.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                          >
                            Devolver
                          </button>
                          <button
                            onClick={() => handleRenew(loan.id)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                            title="Renovar por mais 7 dias"
                          >
                            +7 Dias
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Finalizado</span>
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
  );
}