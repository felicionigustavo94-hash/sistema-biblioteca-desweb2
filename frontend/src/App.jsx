import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, PlusCircle, Repeat, LogIn, LogOut, Search, Sparkles, 
  Trash2, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, 
  Users, Bookmark, ArrowRight, BookCheck, Clock, Check, Filter, X
} from 'lucide-react';

// Endereço da API Laravel (Local ou Nuvem)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function App() {
  // Navegação: 'catalogo', 'cadastrar', 'emprestimos', 'usuarios', 'login'
  const [pagina, setPagina] = useState('catalogo');

  // Estado do Usuário Logado
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem('biblioteca_user');
    return salvo ? JSON.parse(salvo) : null;
  });

  // Dados
  const [livros, setLivros] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroDisponivel, setFiltroDisponivel] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [buscandoIsbn, setBuscandoIsbn] = useState(false);

  // Cadastro de Livro
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

  // Formulário de Login / Registro
  const [isCadastro, setIsCadastro] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '', role: 'leitor' });

  // Token para requisições autenticadas
  const getHeaders = () => {
    const token = localStorage.getItem('biblioteca_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // 1. CARREGAR LIVROS
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

  // 3. CARREGAR USUÁRIOS (ADMIN)
  const carregarUsuarios = async () => {
    if (user?.role !== 'admin') return;
    try {
      const res = await axios.get(`${API_URL}/users`, getHeaders());
      setUsuarios(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    carregarLivros();
    carregarEmprestimos();
    if (user?.role === 'admin') {
      carregarUsuarios();
    }
  }, [user]);

  // 4. BUSCA DE DADOS POR ISBN (BrasilAPI / Open Library / Google Books)
  const buscarIsbn = async () => {
    if (!novoLivro.isbn) {
      alert('Digite o número do ISBN primeiro (Ex: 9788576082675)');
      return;
    }

    try {
      setBuscandoIsbn(true);
      setMensagem(null);
      const cleanIsbn = novoLivro.isbn.replace(/[^0-9X]/gi, '');
      const res = await axios.get(`${API_URL}/books/lookup/isbn?isbn=${cleanIsbn}`);
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

      setMensagem({ tipo: 'sucesso', texto: `Dados preenchidos via ${dados.source || 'API pública'}!` });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Livro não localizado nas APIs públicas para este ISBN. Preencha manualmente.' });
    } finally {
      setBuscandoIsbn(false);
    }
  };

  // 5. SALVAR NOVO LIVRO (ADMIN)
  const salvarLivro = async (e) => {
    e.preventDefault();

    if (user?.role !== 'admin') {
      setMensagem({ tipo: 'erro', texto: 'Apenas administradores podem cadastrar novos livros.' });
      return;
    }

    try {
      await axios.post(`${API_URL}/books`, novoLivro, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Livro cadastrado com sucesso no acervo da BiblioGest!' });
      setNovoLivro({ title: '', author: '', genre: '', isbn: '', synopsis: '', total_copies: 1, cover_path: '', published_year: '' });
      carregarLivros();
      setPagina('catalogo');
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.response?.data?.message || 'Erro ao cadastrar o livro.' });
    }
  };

  // 6. FAZER EMPRÉSTIMO
  const fazerEmprestimo = async (bookId) => {
    if (!user) {
      setMensagem({ tipo: 'aviso', texto: 'Faça login para solicitar um empréstimo.' });
      setPagina('login');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/loans`, { book_id: bookId }, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: res.data.message || 'Empréstimo realizado com sucesso!' });
      carregarLivros(busca);
      carregarEmprestimos();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.response?.data?.message || 'Não foi possível realizar o empréstimo.' });
    }
  };

  // 7. DEVOLVER LIVRO
  const devolverLivro = async (loanId) => {
    try {
      await axios.post(`${API_URL}/loans/${loanId}/return`, {}, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Livro devolvido com sucesso ao acervo!' });
      carregarEmprestimos();
      carregarLivros(busca);
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao devolver o livro.' });
    }
  };

  // 8. EXCLUIR LIVRO (ADMIN)
  const excluirLivro = async (id, titulo) => {
    if (!window.confirm(`Deseja remover a obra "${titulo}" do acervo?`)) return;
    try {
      await axios.delete(`${API_URL}/books/${id}`, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Livro removido do acervo com sucesso!' });
      carregarLivros(busca);
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir o livro.' });
    }
  };

  // 9. ALTERAR PERMISSÃO DE USUÁRIO (ADMIN)
  const alternarRoleUsuario = async (userId, nomeAtual, roleAtual) => {
    const novo = roleAtual === 'admin' ? 'leitor' : 'admin';
    if (!window.confirm(`Deseja alterar a conta de "${nomeAtual}" para "${novo.toUpperCase()}"?`)) return;

    try {
      const res = await axios.put(`${API_URL}/users/${userId}/role`, {}, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: res.data.message || 'Permissão alterada com sucesso!' });
      carregarUsuarios();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao alterar permissão.' });
    }
  };

  // 10. LOGIN / REGISTRO
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const rota = isCadastro ? '/auth/register' : '/auth/login';
      const res = await axios.post(`${API_URL}${rota}`, loginForm);
      const { user: logado, token } = res.data;

      localStorage.setItem('biblioteca_token', token);
      localStorage.setItem('biblioteca_user', JSON.stringify(logado));
      setUser(logado);
      setMensagem({ tipo: 'sucesso', texto: `Seja bem-vindo, ${logado.name}!` });
      setPagina('catalogo');
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
    }
  };

  const logout = () => {
    localStorage.removeItem('biblioteca_token');
    localStorage.removeItem('biblioteca_user');
    setUser(null);
    setMensagem({ tipo: 'sucesso', texto: 'Sessão encerrada com sucesso.' });
    setPagina('catalogo');
  };

  // Livros filtrados
  const livrosFiltrados = livros.filter((livro) => {
    if (filtroDisponivel && (livro.available_copies ?? 0) <= 0) return false;
    return true;
  });

  const totalDisponiveis = livros.reduce((acc, l) => acc + (l.available_copies || 0), 0);
  const emprestimosAtivos = emprestimos.filter(e => e.status !== 'devolvido').length;

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#16241F] flex flex-col">
      
      {/* 🏛️ NAVBAR LIMPA, LUMINOSA E COM ALTO CONTRASTE */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo Oficial com Símbolo Nítido e Tipografia Customizada (Syne) */}
          <div 
            onClick={() => { setPagina('catalogo'); carregarLivros(busca); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="flex items-center justify-center h-10 w-16 group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo-symbol.png" 
                alt="BiblioGest Ícone" 
                className="h-full w-auto object-contain drop-shadow-sm" 
              />
            </div>
            
            <div className="flex flex-col">
              <div className="font-brand flex items-center text-2xl font-black tracking-tight leading-none">
                <span className="text-[#0D4032]">Biblio</span>
                <span className="text-[#C49B4B] ml-0.5">Gest</span>
              </div>
              <span className="text-[9px] tracking-[0.22em] font-extrabold text-[#C49B4B] uppercase mt-1">
                Conhecimento em boas mãos
              </span>
            </div>
          </div>

          {/* Abas de Navegação */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => { setPagina('catalogo'); carregarLivros(busca); }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                pagina === 'catalogo'
                  ? 'bg-[#0D4032] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-[#0D4032] hover:bg-slate-100/80'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Acervo</span>
            </button>

            <button
              onClick={() => setPagina('cadastrar')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                pagina === 'cadastrar'
                  ? 'bg-[#0D4032] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-[#0D4032] hover:bg-slate-100/80'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Obra</span>
            </button>

            <button
              onClick={() => { setPagina('emprestimos'); carregarEmprestimos(); }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                pagina === 'emprestimos'
                  ? 'bg-[#0D4032] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-[#0D4032] hover:bg-slate-100/80'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>Empréstimos</span>
              {emprestimosAtivos > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-[#C49B4B] text-white font-extrabold">
                  {emprestimosAtivos}
                </span>
              )}
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => { setPagina('usuarios'); carregarUsuarios(); }}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  pagina === 'usuarios'
                    ? 'bg-[#0D4032] text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-[#0D4032] hover:bg-slate-100/80'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Gestão de Usuários</span>
              </button>
            )}
          </nav>

          {/* Área de Autenticação / Perfil */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-[#0D4032]/5 border border-[#0D4032]/15 px-3.5 py-1.5 rounded-xl">
                  {user.role === 'admin' ? (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#A37E36] bg-[#C49B4B]/15 px-2 py-0.5 rounded-md border border-[#C49B4B]/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C49B4B]" />
                      Admin
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#0D4032] bg-[#0D4032]/10 px-2 py-0.5 rounded-md">
                      <UserCheck className="w-3.5 h-3.5" />
                      Leitor
                    </span>
                  )}
                  <span className="text-slate-800 text-xs font-semibold max-w-[130px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Encerrar sessão"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPagina('login')}
                className="bg-[#0D4032] hover:bg-[#145C47] text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#C49B4B]" />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 🔔 BARRA DE AVISOS E MENSAGENS */}
      {mensagem && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-4">
          <div className={`p-4 rounded-2xl flex items-center justify-between text-sm shadow-sm border ${
            mensagem.tipo === 'sucesso'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : mensagem.tipo === 'aviso'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}>
            <div className="flex items-center gap-3">
              {mensagem.tipo === 'sucesso' && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
              {mensagem.tipo === 'aviso' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />}
              {mensagem.tipo === 'erro' && <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
              <span className="font-semibold">{mensagem.texto}</span>
            </div>
            <button 
              onClick={() => setMensagem(null)} 
              className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 📄 CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        
        {/* ===================================================== */}
        {/* TELA 1: ACERVO / CATÁLOGO DE LIVROS */}
        {/* ===================================================== */}
        {pagina === 'catalogo' && (
          <div className="space-y-8">
            
            {/* HERO BANNER EDITORIAL DE PRESTÍGIO DA MARCA */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F4F8F6] via-[#FAF7F0] to-[#FFFFFF] border border-[#C49B4B]/30 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="relative z-10 max-w-2xl space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D4032]/10 border border-[#0D4032]/20 text-[#0D4032] text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#C49B4B]" />
                  Sistema de Gestão de Biblioteca
                </div>
                
                <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0D4032] leading-tight">
                  Conhecimento em <span className="text-[#C49B4B]">boas mãos.</span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                  Explore o catálogo da BiblioGest com busca em tempo real, preenchimento automático de obras por ISBN e controle instantâneo de empréstimos.
                </p>

                {/* Métricas do Acervo */}
                <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-[#0D4032]">
                  <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2">
                    <BookCheck className="w-4 h-4 text-[#C49B4B]" />
                    <span><strong>{livros.length}</strong> Obras no Acervo</span>
                  </div>
                  <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-emerald-600" />
                    <span><strong>{totalDisponiveis}</strong> Exemplares Disponíveis</span>
                  </div>
                  <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-[#C49B4B]" />
                    <span><strong>{emprestimosAtivos}</strong> Empréstimo(s) Ativo(s)</span>
                  </div>
                </div>
              </div>

              {/* Destaque Visual da Marca no Banner */}
              <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white/90 rounded-2xl border border-[#C49B4B]/30 shadow-md flex-shrink-0 w-64 text-center">
                <img 
                  src="/logo-symbol.png" 
                  alt="BiblioGest" 
                  className="w-28 h-auto object-contain mb-2 drop-shadow" 
                />
                <span className="font-brand text-xl font-black text-[#0D4032] tracking-tight">
                  Biblio<span className="text-[#C49B4B]">Gest</span>
                </span>
                <span className="text-[8px] tracking-[0.2em] font-extrabold text-[#C49B4B] uppercase mt-0.5">
                  Fatec • DESWEB II
                </span>
              </div>
            </div>

            {/* BARRA DE PESQUISA & FILTROS */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por título, autor ou ISBN..."
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    carregarLivros(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D4032] focus:bg-white transition"
                />
              </div>

              {/* Filtro Rápido e Botão de Novo Livro */}
              <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
                <button
                  onClick={() => setFiltroDisponivel(!filtroDisponivel)}
                  className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition ${
                    filtroDisponivel
                      ? 'bg-[#0D4032] text-white border-[#0D4032] shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 text-[#C49B4B]" />
                  <span>Apenas Disponíveis</span>
                </button>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => setPagina('cadastrar')}
                    className="bg-[#0D4032] hover:bg-[#145C47] text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer ml-auto"
                  >
                    <PlusCircle className="w-4 h-4 text-[#C49B4B]" />
                    <span>Cadastrar Obra</span>
                  </button>
                )}
              </div>
            </div>

            {/* GRADE DE LIVROS */}
            {carregando ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="inline-block animate-spin rounded-full h-9 w-9 border-4 border-[#0D4032] border-t-transparent mb-3"></div>
                <p className="text-sm text-slate-500 font-semibold">Consultando acervo da BiblioGest...</p>
              </div>
            ) : livrosFiltrados.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm space-y-3">
                <div className="w-14 h-14 bg-[#0D4032]/10 text-[#0D4032] rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-brand text-lg font-bold text-slate-800">Nenhum livro localizado</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {busca ? 'Nenhum resultado corresponde aos termos da pesquisa. Tente outras palavras-chave.' : 'O acervo ainda não possui obras cadastradas.'}
                </p>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setPagina('cadastrar')}
                    className="mt-2 bg-[#0D4032] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#145C47] cursor-pointer"
                  >
                    Cadastrar Primeira Obra
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {livrosFiltrados.map((livro) => {
                  const disponivel = (livro.available_copies ?? 0) > 0;

                  return (
                    <div 
                      key={livro.id} 
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#C49B4B]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {/* Moldura da Capa */}
                        <div className="relative h-60 bg-slate-50 overflow-hidden flex items-center justify-center border-b border-slate-100 p-3">
                          {livro.cover_url || livro.cover_path ? (
                            <img
                              src={livro.cover_url || livro.cover_path}
                              alt={livro.title}
                              className="h-full w-auto max-w-full object-contain rounded-lg shadow-md group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                              onError={(e) => { 
                                e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'; 
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                              <BookOpen className="w-8 h-8 text-slate-300" />
                              <span className="text-[11px] font-medium">Sem imagem de capa</span>
                            </div>
                          )}

                          {/* Badge de Disponibilidade */}
                          <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm ${
                            disponivel
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}>
                            {disponivel ? `${livro.available_copies} disponível(is)` : 'Esgotado'}
                          </span>

                          {/* Botão de Exclusão (Admin) */}
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => excluirLivro(livro.id, livro.title)}
                              className="absolute top-3 left-3 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition opacity-0 group-hover:opacity-100 cursor-pointer"
                              title="Remover do acervo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Metadados da Obra */}
                        <div className="p-4 space-y-2">
                          {livro.genre && (
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#0D4032] bg-[#0D4032]/10 px-2.5 py-0.5 rounded-md">
                              {livro.genre}
                            </span>
                          )}
                          
                          <h3 className="font-brand font-bold text-slate-900 text-base line-clamp-1 leading-snug" title={livro.title}>
                            {livro.title}
                          </h3>
                          
                          <p className="text-xs text-slate-600 font-semibold line-clamp-1">
                            {livro.author}
                          </p>

                          {livro.isbn && (
                            <p className="text-[11px] text-slate-400 font-mono">
                              ISBN: {livro.isbn}
                            </p>
                          )}

                          {livro.synopsis && (
                            <p className="text-xs text-slate-500 line-clamp-2 pt-1 font-normal leading-relaxed">
                              {livro.synopsis}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Botão de Empréstimo */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => fazerEmprestimo(livro.id)}
                          disabled={!disponivel}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                            disponivel
                              ? 'bg-[#0D4032] hover:bg-[#145C47] text-white active:scale-[0.98]'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          <BookCheck className="w-4 h-4 text-[#C49B4B]" />
                          <span>{disponivel ? 'Solicitar Empréstimo' : 'Indisponível no momento'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* TELA 2: CADASTRAR LIVRO COM BUSCA MÁGICA POR ISBN */}
        {/* ===================================================== */}
        {pagina === 'cadastrar' && (
          <div className="max-w-2xl mx-auto">
            {user?.role !== 'admin' ? (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 bg-[#C49B4B]/15 text-[#C49B4B] rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="font-brand text-2xl font-bold text-slate-900">Acesso Restrito a Administradores</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Para manter a curadoria e organização da <strong>BiblioGest</strong>, o cadastro de novas obras é exclusivo para perfis com privilégio de administrador.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setPagina('login')}
                    className="bg-[#0D4032] hover:bg-[#145C47] text-white text-xs font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Fazer Login como Administrador
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                <div>
                  <h2 className="font-brand text-2xl font-black text-[#0D4032] tracking-tight">Cadastrar Obra no Acervo</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Preencha os dados da obra ou digite o ISBN para buscar automaticamente nas APIs públicas.
                  </p>
                </div>

                {/* PAINEL DE PREENCHIMENTO INTELIGENTE POR ISBN */}
                <div className="rounded-2xl border border-[#C49B4B]/40 bg-gradient-to-r from-[#FDFBF7] to-[#FAF5E9] p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0D4032] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C49B4B]" />
                      <span>Preenchimento Inteligente por ISBN</span>
                    </label>
                    <span className="text-[10px] font-bold text-[#A37E36] uppercase bg-white px-2.5 py-0.5 rounded-full border border-[#C49B4B]/30">
                      BrasilAPI + Open Library
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: 9788576082675"
                      value={novoLivro.isbn}
                      onChange={(e) => setNovoLivro({ ...novoLivro, isbn: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#C49B4B]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D4032]"
                    />
                    <button
                      type="button"
                      onClick={buscarIsbn}
                      disabled={buscandoIsbn}
                      className="bg-[#0D4032] hover:bg-[#145C47] disabled:bg-slate-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      {buscandoIsbn ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Buscando...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5 text-[#C49B4B]" />
                          <span>Buscar Dados</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Exemplos de Teste com 1 Clique */}
                  <div className="pt-2 border-t border-[#C49B4B]/20 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-bold text-[#0D4032]">Exemplos rápidos:</span>
                    <button
                      type="button"
                      onClick={() => setNovoLivro({ ...novoLivro, isbn: '9788576082675' })}
                      className="font-semibold text-[#0D4032] underline hover:text-[#C49B4B] cursor-pointer"
                    >
                      Código Limpo
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setNovoLivro({ ...novoLivro, isbn: '9788580571875' })}
                      className="font-semibold text-[#0D4032] underline hover:text-[#C49B4B] cursor-pointer"
                    >
                      O Guia do Mochileiro
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setNovoLivro({ ...novoLivro, isbn: '9788535914849' })}
                      className="font-semibold text-[#0D4032] underline hover:text-[#C49B4B] cursor-pointer"
                    >
                      1984
                    </button>
                  </div>
                </div>

                {/* FORMULÁRIO PRINCIPAL */}
                <form onSubmit={salvarLivro} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Título da Obra *</label>
                    <input
                      type="text"
                      required
                      value={novoLivro.title}
                      onChange={(e) => setNovoLivro({ ...novoLivro, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Autor(es) *</label>
                      <input
                        type="text"
                        required
                        value={novoLivro.author}
                        onChange={(e) => setNovoLivro({ ...novoLivro, author: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gênero / Categoria</label>
                      <input
                        type="text"
                        value={novoLivro.genre}
                        onChange={(e) => setNovoLivro({ ...novoLivro, genre: e.target.value })}
                        placeholder="Ex: Engenharia de Software, Ficção"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exemplares no Estoque</label>
                      <input
                        type="number"
                        min="1"
                        value={novoLivro.total_copies}
                        onChange={(e) => setNovoLivro({ ...novoLivro, total_copies: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">URL da Imagem da Capa</label>
                      <input
                        type="text"
                        value={novoLivro.cover_path}
                        onChange={(e) => setNovoLivro({ ...novoLivro, cover_path: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sinopse</label>
                    <textarea
                      rows="3"
                      value={novoLivro.synopsis}
                      onChange={(e) => setNovoLivro({ ...novoLivro, synopsis: e.target.value })}
                      placeholder="Breve resumo sobre a obra..."
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none"
                    ></textarea>
                  </div>

                  {/* Ações */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPagina('catalogo')}
                      className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0D4032] hover:bg-[#145C47] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
                    >
                      Salvar Obra no Acervo
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* TELA 3: CONTROLE DE EMPRÉSTIMOS E DEVOLUÇÕES */}
        {/* ===================================================== */}
        {pagina === 'emprestimos' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-brand text-2xl font-black text-[#0D4032] tracking-tight">Controle de Empréstimos</h1>
              <p className="text-xs text-slate-500 mt-1">
                Acompanhamento em tempo real dos livros retirados, prazos de devolução e baixa de estoque.
              </p>
            </div>

            {emprestimos.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm space-y-2">
                <Repeat className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-brand text-base font-bold text-slate-800">Nenhum empréstimo ativo</h3>
                <p className="text-xs text-slate-500">
                  Os empréstimos solicitados através do acervo aparecerão listados aqui.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                      <tr>
                        <th className="p-4">Livro</th>
                        <th className="p-4">Leitor</th>
                        <th className="p-4">Retirada</th>
                        <th className="p-4">Prazo Devolução</th>
                        <th className="p-4">Situação</th>
                        <th className="p-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {emprestimos.map((emp) => {
                        const devolvido = emp.status === 'devolvido';

                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-4 font-bold text-slate-900">
                              {emp.book?.title}
                            </td>
                            <td className="p-4 text-slate-600 text-xs font-semibold">
                              {emp.user?.name || 'Leitor'}
                            </td>
                            <td className="p-4 text-xs text-slate-500 font-mono">
                              {emp.loan_date}
                            </td>
                            <td className="p-4 text-xs text-slate-500 font-mono">
                              {emp.due_date}
                            </td>
                            <td className="p-4">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                devolvido
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-900 border border-amber-200'
                              }`}>
                                {devolvido ? 'Devolvido' : 'Empréstimo Ativo'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {!devolvido ? (
                                <button
                                  onClick={() => devolverLivro(emp.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition cursor-pointer shadow-sm"
                                >
                                  Devolver Livro
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium italic">
                                  Finalizado
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* TELA 4: GESTÃO DE USUÁRIOS E PERMISSÕES (ADMIN) */}
        {/* ===================================================== */}
        {pagina === 'usuarios' && user?.role === 'admin' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-brand text-2xl font-black text-[#0D4032] tracking-tight">Gestão de Usuários & Acessos</h1>
              <p className="text-xs text-slate-500 mt-1">
                Controle de papéis e permissões no ecossistema BiblioGest.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                    <tr>
                      <th className="p-4">Nome do Usuário</th>
                      <th className="p-4">E-mail Cadastrado</th>
                      <th className="p-4">Nível de Acesso</th>
                      <th className="p-4 text-right">Ação de Permissão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-4 font-bold text-slate-900">
                          {u.name}
                        </td>
                        <td className="p-4 text-slate-600 text-xs font-mono">
                          {u.email}
                        </td>
                        <td className="p-4">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-[#C49B4B]/20 text-[#0D4032] border border-[#C49B4B]/40'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role === 'admin' ? '👑 Administrador' : '📖 Leitor'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => alternarRoleUsuario(u.id, u.name, u.role)}
                            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-sm ${
                              u.role === 'admin'
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-[#C49B4B] hover:bg-[#B38838] text-white'
                            }`}
                          >
                            {u.role === 'admin' ? 'Rebaixar para Leitor' : 'Promover a Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TELA 5: LOGIN / REGISTRO COM LOGOMARCA COMPLETA E GOOGLE AUTH */}
        {/* ===================================================== */}
        {pagina === 'login' && (
          <div className="max-w-md mx-auto my-4">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
              
              {/* Logo Completa em Alta Resolução */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <img 
                    src="/logo-full.png" 
                    alt="BiblioGest Logo" 
                    className="h-28 w-auto object-contain drop-shadow-sm" 
                  />
                </div>
                <div>
                  <h2 className="font-brand text-2xl font-black text-[#0D4032]">
                    Biblio<span className="text-[#C49B4B]">Gest</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {isCadastro ? 'Cadastre sua conta de leitor' : 'Acesse o acervo inteligente'}
                  </p>
                </div>
              </div>

              {/* Botão Oficial do Google */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => alert('Integração com Google Auth pronta para vincular suas credenciais!')}
                  className="w-full py-2.5 px-4 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continuar com o Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">ou com e-mail</span>
                </div>
              </div>

              {/* Formulário com E-mail e Senha */}
              <form onSubmit={submitLogin} className="space-y-4">
                {isCadastro && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={loginForm.name}
                      onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="admin@biblioteca.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Senha</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="password123"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D4032] focus:outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0D4032] hover:bg-[#145C47] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-sm"
                >
                  {isCadastro ? 'Criar Conta' : 'Acessar Conta'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsCadastro(!isCadastro)}
                  className="text-xs font-bold text-[#0D4032] hover:text-[#C49B4B] transition cursor-pointer"
                >
                  {isCadastro ? 'Já possui cadastro? Fazer login' : 'Novo por aqui? Cadastre-se gratuitamente'}
                </button>
              </div>

              {/* Botões de Preenchimento para a Aula */}
              {!isCadastro && (
                <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
                  <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Acesso Rápido para Apresentação:
                  </p>
                  <button
                    type="button"
                    onClick={() => setLoginForm({ ...loginForm, email: 'admin@biblioteca.com', password: 'password123' })}
                    className="w-full text-left bg-slate-50 hover:bg-[#C49B4B]/10 border border-slate-200 hover:border-[#C49B4B]/40 p-2.5 rounded-xl transition cursor-pointer flex items-center justify-between"
                  >
                    <span>👑 <strong>Admin:</strong> admin@biblioteca.com</span>
                    <span className="text-[10px] text-slate-400 font-bold">Preencher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginForm({ ...loginForm, email: 'leitor@biblioteca.com', password: 'password123' })}
                    className="w-full text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-2.5 rounded-xl transition cursor-pointer flex items-center justify-between"
                  >
                    <span>📖 <strong>Leitor:</strong> leitor@biblioteca.com</span>
                    <span className="text-[10px] text-slate-400 font-bold">Preencher</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 🦶 RODAPÉ DA MARCA BIBLIOGEST */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-symbol.png" alt="BiblioGest" className="w-8 h-auto object-contain" />
            <div className="flex items-center gap-2">
              <span className="font-brand font-black text-sm text-[#0D4032]">
                Biblio<span className="text-[#C49B4B]">Gest</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-500 text-xs">Conhecimento em boas mãos</span>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400 font-medium">
            Trabalho Semestral de Desenvolvimento Web II • Fatec • React + Laravel 11
          </div>
        </div>
      </footer>
    </div>
  );
}
