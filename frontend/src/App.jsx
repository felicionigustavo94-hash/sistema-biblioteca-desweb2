import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, PlusCircle, Repeat, LogIn, LogOut, Search, Sparkles, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

// Endereço da API Laravel (Local ou Nuvem)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function App() {
  // Estado da Página Atual: 'catalogo', 'cadastrar', 'emprestimos', 'login'
  const [pagina, setPagina] = useState('catalogo');

  // Estado do Usuário Logado
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem('biblioteca_user');
    return salvo ? JSON.parse(salvo) : null;
  });

  // Estados dos Dados
  const [livros, setLivros] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Estado do Formulário de Cadastro de Livro
  const [novoLivro, setNovoLivro] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    synopsis: '',
    total_copies: 1,
    cover_path: '',
    published_year: '',
  });

  // Estado do Formulário de Login
  const [isCadastro, setIsCadastro] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '', role: 'leitor' });

  // Configura cabeçalho com Token para o Axios
  const getHeaders = () => {
    const token = localStorage.getItem('biblioteca_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // 1. CARREGAR LIVROS DO BACK-END
  const carregarLivros = async (termo = '') => {
    try {
      setCarregando(true);
      const url = termo ? `${API_URL}/books?search=${encodeURIComponent(termo)}` : `${API_URL}/books`;
      const res = await axios.get(url);
      setLivros(res.data.data || res.data || []);
    } catch (e) {
      console.error(e);
      setMensagem({ tipo: 'erro', texto: 'Não foi possível conectar ao back-end Laravel (http://127.0.0.1:8000).' });
    } finally {
      setCarregando(false);
    }
  };

  // 2. CARREGAR EMPRÉSTIMOS
  const carregarEmprestimos = async () => {
    try {
      const res = await axios.get(`${API_URL}/loans`, getHeaders());
      setEmprestimos(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    carregarLivros();
    carregarEmprestimos();
  }, []);

  // 3. BUSCA MÁGICA POR ISBN NA API PÚBLICA (Google Books / Open Library)
  const buscarIsbn = async () => {
    if (!novoLivro.isbn) {
      alert('Digite o número do ISBN primeiro (Ex: 9788576082675)');
      return;
    }

    try {
      setMensagem({ tipo: 'sucesso', texto: 'Consultando API pública de livros...' });
      const res = await axios.get(`${API_URL}/books/lookup/isbn?isbn=${novoLivro.isbn.trim()}`);
      const dados = res.data;

      setNovoLivro((prev) => ({
        ...prev,
        title: dados.title || prev.title,
        author: dados.author || prev.author,
        genre: dados.genre || prev.genre,
        synopsis: dados.synopsis || prev.synopsis,
        published_year: dados.published_year || prev.published_year,
        cover_path: dados.cover_path || prev.cover_path,
      }));

      setMensagem({ tipo: 'sucesso', texto: 'Dados preenchidos automaticamente via API pública!' });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Livro não encontrado na API pública. Preencha manualmente os campos.' });
    }
  };

  // 4. SALVAR NOVO LIVRO
  const salvarLivro = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/books`, novoLivro, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Livro cadastrado com sucesso!' });
      setNovoLivro({ title: '', author: '', genre: '', isbn: '', synopsis: '', total_copies: 1, cover_path: '', published_year: '' });
      carregarLivros();
      setPagina('catalogo');
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar o livro.' });
    }
  };

  // 5. FAZER EMPRÉSTIMO
  const fazerEmprestimo = async (bookId) => {
    if (!user) {
      setPagina('login');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/loans`, { book_id: bookId }, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: res.data.message || 'Empréstimo realizado!' });
      carregarLivros(busca);
      carregarEmprestimos();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.response?.data?.message || 'Erro ao realizar empréstimo.' });
    }
  };

  // 6. DEVOLVER LIVRO
  const devolverLivro = async (loanId) => {
    try {
      await axios.post(`${API_URL}/loans/${loanId}/return`, {}, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Livro devolvido com sucesso!' });
      carregarEmprestimos();
      carregarLivros(busca);
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao devolver o livro.' });
    }
  };

  // 7. EXCLUIR LIVRO (ADMIN)
  const excluirLivro = async (id, titulo) => {
    if (!window.confirm(`Deseja excluir o livro "${titulo}"?`)) return;
    try {
      await axios.delete(`${API_URL}/books/${id}`, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Livro excluído com sucesso!' });
      carregarLivros(busca);
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir livro.' });
    }
  };

  // 8. LOGIN / CADASTRO
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const rota = isCadastro ? '/auth/register' : '/auth/login';
      const res = await axios.post(`${API_URL}${rota}`, loginForm);
      const { user: logado, token } = res.data;

      localStorage.setItem('biblioteca_token', token);
      localStorage.setItem('biblioteca_user', JSON.stringify(logado));
      setUser(logado);
      setMensagem({ tipo: 'sucesso', texto: `Bem-vindo, ${logado.name}!` });
      setPagina('catalogo');
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Erro no login. Verifique os dados informados.' });
    }
  };

  const logout = () => {
    localStorage.removeItem('biblioteca_token');
    localStorage.removeItem('biblioteca_user');
    setUser(null);
    setMensagem({ tipo: 'sucesso', texto: 'Você saiu da sua conta.' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* 🧭 BARRA DE NAVEGAÇÃO SIMPLES */}
      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="w-6 h-6" />
            <span>Biblioteca Web</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <button
              onClick={() => { setPagina('catalogo'); carregarLivros(busca); }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${pagina === 'catalogo' ? 'bg-indigo-800' : 'hover:bg-indigo-500'}`}
            >
              📚 Acervo
            </button>

            <button
              onClick={() => setPagina('cadastrar')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${pagina === 'cadastrar' ? 'bg-indigo-800' : 'hover:bg-indigo-500'}`}
            >
              ➕ Cadastrar Livro
            </button>

            <button
              onClick={() => { setPagina('emprestimos'); carregarEmprestimos(); }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${pagina === 'emprestimos' ? 'bg-indigo-800' : 'hover:bg-indigo-500'}`}
            >
              🔄 Empréstimos
            </button>
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-indigo-700 px-2.5 py-1 rounded-full font-medium">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="bg-indigo-800 hover:bg-rose-600 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPagina('login')}
                className="bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold px-4 py-2 rounded-lg transition shadow cursor-pointer"
              >
                Entrar / Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 🔔 ALERTA DE MENSAGENS */}
      {mensagem && (
        <div className="max-w-6xl mx-auto w-full px-4 mt-4">
          <div className={`p-3 rounded-lg flex items-center justify-between text-sm shadow-sm ${
            mensagem.tipo === 'sucesso' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {mensagem.tipo === 'sucesso' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
              <span>{mensagem.texto}</span>
            </div>
            <button onClick={() => setMensagem(null)} className="text-xs font-bold hover:underline cursor-pointer">OK</button>
          </div>
        </div>
      )}

      {/* 📄 CONTEÚDO DA PÁGINA */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        {/* ===================================================== */}
        {/* PÁGINA 1: CATÁLOGO DE LIVROS */}
        {/* ===================================================== */}
        {pagina === 'catalogo' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Acervo de Livros</h1>
                <p className="text-xs text-slate-500">Consulte os livros disponíveis e faça empréstimos</p>
              </div>

              {/* Barra de Pesquisa */}
              <div className="flex gap-2 w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar título, autor ou ISBN..."
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    carregarLivros(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {carregando ? (
              <p className="text-center py-12 text-slate-500">Carregando livros...</p>
            ) : livros.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center border border-slate-200 shadow-sm">
                <p className="text-slate-500">Nenhum livro cadastrado no momento.</p>
                <button
                  onClick={() => setPagina('cadastrar')}
                  className="mt-3 bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Cadastrar Primeiro Livro
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {livros.map((livro) => {
                  const disponivel = (livro.available_copies ?? 0) > 0;

                  return (
                    <div key={livro.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                      <div>
                        {/* Imagem de Capa */}
                        <div className="h-44 bg-slate-200 overflow-hidden flex items-center justify-center relative">
                          {livro.cover_url || livro.cover_path ? (
                            <img
                              src={livro.cover_url || livro.cover_path}
                              alt={livro.title}
                              className="h-full w-full object-cover"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300'; }}
                            />
                          ) : (
                            <div className="text-xs text-slate-400">Sem Capa</div>
                          )}

                          <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            disponivel ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {disponivel ? `${livro.available_copies} disponível(is)` : 'Esgotado'}
                          </span>
                        </div>

                        {/* Dados do Livro */}
                        <div className="p-4">
                          {livro.genre && (
                            <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                              {livro.genre}
                            </span>
                          )}
                          <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">{livro.title}</h3>
                          <p className="text-xs text-slate-600">Autor: <span className="font-semibold">{livro.author}</span></p>
                          {livro.isbn && <p className="text-[11px] text-slate-400">ISBN: {livro.isbn}</p>}
                          {livro.synopsis && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{livro.synopsis}</p>}
                        </div>
                      </div>

                      {/* Botão de Empréstimo */}
                      <div className="p-4 pt-0 flex gap-2">
                        <button
                          onClick={() => fazerEmprestimo(livro.id)}
                          disabled={!disponivel}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            disponivel
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {disponivel ? '📖 Pegar Emprestado' : 'Indisponível'}
                        </button>

                        {user?.role === 'admin' && (
                          <button
                            onClick={() => excluirLivro(livro.id, livro.title)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* PÁGINA 2: CADASTRAR LIVRO */}
        {/* ===================================================== */}
        {pagina === 'cadastrar' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Cadastrar Livro no Acervo</h2>
            <p className="text-xs text-slate-500 mb-6">Você pode digitar o ISBN para buscar os dados na internet automaticamente</p>

            {/* Caixa de Busca por ISBN */}
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl mb-6">
              <label className="block text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Preencher Automaticamente por ISBN:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: 9788576082675 ou 9788580571875"
                  value={novoLivro.isbn}
                  onChange={(e) => setNovoLivro({ ...novoLivro, isbn: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={buscarIsbn}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  🔍 Buscar Dados
                </button>
              </div>
            </div>

            {/* Formulário Manual */}
            <form onSubmit={salvarLivro} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Livro *</label>
                <input
                  type="text"
                  required
                  value={novoLivro.title}
                  onChange={(e) => setNovoLivro({ ...novoLivro, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Autor *</label>
                  <input
                    type="text"
                    required
                    value={novoLivro.author}
                    onChange={(e) => setNovoLivro({ ...novoLivro, author: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gênero</label>
                  <input
                    type="text"
                    value={novoLivro.genre}
                    onChange={(e) => setNovoLivro({ ...novoLivro, genre: e.target.value })}
                    placeholder="Ex: Informática, Ficção"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade de Cópias</label>
                  <input
                    type="number"
                    min="1"
                    value={novoLivro.total_copies}
                    onChange={(e) => setNovoLivro({ ...novoLivro, total_copies: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Foto de Capa</label>
                  <input
                    type="text"
                    value={novoLivro.cover_path}
                    onChange={(e) => setNovoLivro({ ...novoLivro, cover_path: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sinopse</label>
                <textarea
                  rows="3"
                  value={novoLivro.synopsis}
                  onChange={(e) => setNovoLivro({ ...novoLivro, synopsis: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPagina('catalogo')}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2 rounded-lg cursor-pointer shadow"
                >
                  Salvar Livro
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================== */}
        {/* PÁGINA 3: EMPRÉSTIMOS E DEVOLUÇÕES */}
        {/* ===================================================== */}
        {pagina === 'emprestimos' && (
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Controle de Empréstimos</h1>
            <p className="text-xs text-slate-500 mb-6">Veja os livros retirados e registre as devoluções</p>

            {emprestimos.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center border border-slate-200">
                <p className="text-slate-500">Nenhum empréstimo realizado ainda.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                    <tr>
                      <th className="p-3.5">Livro</th>
                      <th className="p-3.5">Leitor</th>
                      <th className="p-3.5">Data Retirada</th>
                      <th className="p-3.5">Data Devolução</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {emprestimos.map((emp) => {
                      const devolvido = emp.status === 'devolvido';

                      return (
                        <tr key={emp.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-semibold text-slate-900">{emp.book?.title}</td>
                          <td className="p-3.5 text-slate-600">{emp.user?.name || 'Leitor'}</td>
                          <td className="p-3.5 text-xs text-slate-500">{emp.loan_date}</td>
                          <td className="p-3.5 text-xs text-slate-500">{emp.due_date}</td>
                          <td className="p-3.5">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              devolvido ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {devolvido ? 'Devolvido' : 'Ativo'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {!devolvido ? (
                              <button
                                onClick={() => devolverLivro(emp.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Devolver Livro
                              </button>
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
        )}

        {/* ===================================================== */}
        {/* PÁGINA 4: LOGIN / CADASTRO */}
        {/* ===================================================== */}
        {pagina === 'login' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
              {isCadastro ? 'Cadastrar Nova Conta' : 'Acessar o Sistema'}
            </h2>

            <form onSubmit={submitLogin} className="space-y-4">
              {isCadastro && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@biblioteca.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Senha</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="password123"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition cursor-pointer shadow"
              >
                {isCadastro ? 'Criar Conta' : 'Entrar'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsCadastro(!isCadastro)}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                {isCadastro ? 'Já tenho conta? Fazer Login' : 'Não tem conta? Cadastre-se aqui'}
              </button>
            </div>

            {/* Contas de Demonstração */}
            {!isCadastro && (
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <p className="font-semibold mb-2">💡 Contas de teste para demonstração:</p>
                <button
                  type="button"
                  onClick={() => setLoginForm({ ...loginForm, email: 'admin@biblioteca.com', password: 'password123' })}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 mb-1 cursor-pointer"
                >
                  👑 <strong>Admin:</strong> admin@biblioteca.com / password123
                </button>
                <button
                  type="button"
                  onClick={() => setLoginForm({ ...loginForm, email: 'leitor@biblioteca.com', password: 'password123' })}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 cursor-pointer"
                >
                  📖 <strong>Leitor:</strong> leitor@biblioteca.com / password123
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 🦶 RODAPÉ */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Desenvolvimento Web II • Fatec • React + Laravel + PostgreSQL
      </footer>
    </div>
  );
}