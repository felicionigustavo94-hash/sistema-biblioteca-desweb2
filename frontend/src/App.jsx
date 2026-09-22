import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componentes do Sistema BiblioGest
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VisaoGeral from './components/VisaoGeral';
import Acervo from './components/Acervo';
import Emprestimos from './components/Emprestimos';
import Usuarios from './components/Usuarios';
import Entrada from './components/Entrada';
import ModalCadastrarObra from './components/ModalCadastrarObra';
import ModalNovoEmprestimo from './components/ModalNovoEmprestimo';
import FeedbackBanner from './components/FeedbackBanner';

// Endereço da API Laravel
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function App() {
  // Navegação: 'visao-geral', 'acervo', 'emprestimos', 'usuarios', 'login'
  const [pagina, setPagina] = useState('visao-geral');
  const [menuAberto, setMenuAberto] = useState(false);

  // Usuário Autenticado
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem('biblioteca_user');
    return salvo ? JSON.parse(salvo) : null;
  });

  // Dados do Domínio
  const [livros, setLivros] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [authCarregando, setAuthCarregando] = useState(false);
  const [authErro, setAuthErro] = useState(null);

  // Filtros do Acervo
  const [busca, setBusca] = useState('');
  const [filtroDisponivel, setFiltroDisponivel] = useState(false);

  // Modais
  const [modalLivroAberto, setModalLivroAberto] = useState(false);
  const [modalEmprestimoAberto, setModalEmprestimoAberto] = useState(false);

  // Notificações e Feedback
  const [mensagem, setMensagem] = useState(null);

  // Token de Autenticação
  const getHeaders = () => {
    const token = localStorage.getItem('biblioteca_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // 1. Carregar Obras do Acervo
  const carregarLivros = async (termo = '') => {
    try {
      setCarregando(true);
      const url = termo ? `${API_URL}/books?search=${encodeURIComponent(termo)}` : `${API_URL}/books`;
      const res = await axios.get(url);
      setLivros(res.data.data || res.data || []);
    } catch (e) {
      console.error(e);
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Não foi possível conectar ao servidor da biblioteca (http://127.0.0.1:8000).' 
      });
    } finally {
      setCarregando(false);
    }
  };

  // 2. Carregar Empréstimos
  const carregarEmprestimos = async () => {
    try {
      const res = await axios.get(`${API_URL}/loans`, getHeaders());
      setEmprestimos(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Carregar Usuários (Operador)
  const carregarUsuarios = async () => {
    if (user?.role !== 'admin') return;
    try {
      const res = await axios.get(`${API_URL}/users`, getHeaders());
      setUsuarios(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Carregamento inicial e reativo
  useEffect(() => {
    carregarLivros(busca);
    carregarEmprestimos();
    if (user?.role === 'admin') {
      carregarUsuarios();
    }
  }, [user]);

  // Debounce na busca de livros
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarLivros(busca);
    }, 300);
    return () => clearTimeout(timer);
  }, [busca]);

  // 4. Registrar Empréstimo Rápido (a partir do botão de ação da obra)
  const handleFazerEmprestimoRapido = async (bookId) => {
    if (!user) {
      setMensagem({ tipo: 'aviso', texto: 'Faça login para solicitar um empréstimo.' });
      setPagina('login');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/loans`, { book_id: bookId }, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: res.data.message || 'Empréstimo registrado com sucesso!' });
      carregarLivros(busca);
      carregarEmprestimos();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.response?.data?.message || 'Não foi possível realizar o empréstimo.' });
    }
  };

  // 5. Devolver Livro / Exemplar
  const handleDevolverLivro = async (loanId) => {
    try {
      await axios.post(`${API_URL}/loans/${loanId}/return`, {}, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Devolução registrada. O exemplar retornou ao acervo disponível.' });
      carregarEmprestimos();
      carregarLivros(busca);
    } catch (_e) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível confirmar a devolução.' });
    }
  };

  // 6. Excluir Obra do Acervo (Operador)
  const handleExcluirLivro = async (id, titulo) => {
    if (!window.confirm(`Deseja remover a obra "${titulo}" do catálogo da biblioteca?`)) return;
    try {
      await axios.delete(`${API_URL}/books/${id}`, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Obra removida do acervo com sucesso.' });
      carregarLivros(busca);
    } catch (_e) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível remover a obra.' });
    }
  };

  // 7. Alternar Role / Permissão de Usuário (Operador)
  const handleAlternarRole = async (userId, nomeAtual, roleAtual) => {
    const proximoRole = roleAtual === 'admin' ? 'Leitor' : 'Operador';
    if (!window.confirm(`Confirmar alteração do perfil de "${nomeAtual}" para ${proximoRole}?`)) return;

    try {
      const res = await axios.put(`${API_URL}/users/${userId}/role`, {}, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: res.data.message || 'Perfil de acesso atualizado com sucesso.' });
      carregarUsuarios();
    } catch (_e) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível alterar o perfil.' });
    }
  };

  // 8. Autenticação (Login / Cadastro)
  const handleLogin = async (formData, isCadastro) => {
    try {
      setAuthCarregando(true);
      setAuthErro(null);

      const rota = isCadastro ? '/auth/register' : '/auth/login';
      const res = await axios.post(`${API_URL}${rota}`, formData);
      const { user: logado, token } = res.data;

      localStorage.setItem('biblioteca_token', token);
      localStorage.setItem('biblioteca_user', JSON.stringify(logado));
      setUser(logado);
      setMensagem({ tipo: 'sucesso', texto: `Sessão iniciada. Bem-vindo(a), ${logado.name}!` });
      setPagina('visao-geral');
    } catch (e) {
      setAuthErro(e.response?.data?.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setAuthCarregando(false);
    }
  };

  // 9. Encerrar Sessão (Logout)
  const handleLogout = () => {
    localStorage.removeItem('biblioteca_token');
    localStorage.removeItem('biblioteca_user');
    setUser(null);
    setMensagem({ tipo: 'sucesso', texto: 'Sessão encerrada com sucesso.' });
    setPagina('visao-geral');
  };

  // Calcular Títulos de Contexto do Header
  const getContextoHeader = () => {
    switch (pagina) {
      case 'visao-geral':
        return { titulo: 'Visão Geral', subtitulo: 'Circulação e indicadores operacionais' };
      case 'acervo':
        return { titulo: 'Acervo', subtitulo: 'Consulta e catálogo de obras bibliográficas' };
      case 'emprestimos':
        return { titulo: 'Empréstimos', subtitulo: 'Controle de circulação e prazos de devolução' };
      case 'usuarios':
        return { titulo: 'Leitores e Operadores', subtitulo: 'Administração de contas e perfis de acesso' };
      case 'login':
        return { titulo: 'Identificação', subtitulo: 'Autenticação de leitores e operadores' };
      default:
        return { titulo: 'BiblioGest', subtitulo: 'Sistema de Gestão de Biblioteca' };
    }
  };

  const contexto = getContextoHeader();
  const totalEmprestimosAtivos = emprestimos.filter(e => e.status !== 'devolvido').length;

  return (
    <div className="min-h-screen bg-[#F7F6F1] text-[#203B34] flex font-sans antialiased">
      
      {/* 1. Barra Lateral de Navegação (232px fixos no desktop) */}
      <Sidebar
        paginaAtiva={pagina}
        setPagina={setPagina}
        user={user}
        logout={handleLogout}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
        totalLivros={livros.length}
        totalEmprestimosAtivos={totalEmprestimosAtivos}
      />

      {/* 2. Área Central de Aplicação (Fluida até 1440px) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Cabeçalho de Contexto (64px) */}
        <Header
          tituloContexto={contexto.titulo}
          subtituloContexto={contexto.subtitulo}
          user={user}
          setMenuAberto={setMenuAberto}
          setPagina={setPagina}
        />

        {/* Conteúdo Principal com 32px de margem desktop conforme design.md seção 8 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          
          {pagina === 'visao-geral' && (
            <VisaoGeral
              livros={livros}
              emprestimos={emprestimos}
              user={user}
              setPagina={setPagina}
              onAbrirNovoLivro={() => setModalLivroAberto(true)}
              onAbrirNovoEmprestimo={() => setModalEmprestimoAberto(true)}
              onDevolverLivro={handleDevolverLivro}
            />
          )}

          {pagina === 'acervo' && (
            <Acervo
              livros={livros}
              carregando={carregando}
              busca={busca}
              setBusca={setBusca}
              filtroDisponivel={filtroDisponivel}
              setFiltroDisponivel={setFiltroDisponivel}
              user={user}
              onAbrirNovoLivro={() => setModalLivroAberto(true)}
              onFazerEmprestimo={handleFazerEmprestimoRapido}
              onExcluirLivro={handleExcluirLivro}
              onLimparFiltros={() => { setBusca(''); setFiltroDisponivel(false); }}
            />
          )}

          {pagina === 'emprestimos' && (
            <Emprestimos
              emprestimos={emprestimos}
              user={user}
              onAbrirNovoEmprestimo={() => setModalEmprestimoAberto(true)}
              onDevolverLivro={handleDevolverLivro}
            />
          )}

          {pagina === 'usuarios' && user?.role === 'admin' && (
            <Usuarios
              usuarios={usuarios}
              user={user}
              onAlternarRole={handleAlternarRole}
            />
          )}

          {pagina === 'login' && (
            <Entrada
              onLogin={handleLogin}
              carregando={authCarregando}
              erro={authErro}
              setPagina={setPagina}
            />
          )}

        </main>

      </div>

      {/* 3. Diálogos Modais Operacionais (design.md seção 9.8) */}
      <ModalCadastrarObra
        aberto={modalLivroAberto}
        onClose={() => setModalLivroAberto(false)}
        onSalvo={(msg) => {
          setMensagem({ tipo: 'sucesso', texto: msg });
          carregarLivros(busca);
        }}
        apiUrl={API_URL}
        getHeaders={getHeaders}
      />

      <ModalNovoEmprestimo
        aberto={modalEmprestimoAberto}
        onClose={() => setModalEmprestimoAberto(false)}
        onSucesso={(msg) => {
          setMensagem({ tipo: 'sucesso', texto: msg });
          carregarEmprestimos();
          carregarLivros(busca);
        }}
        livros={livros}
        usuarios={usuarios}
        user={user}
        apiUrl={API_URL}
        getHeaders={getHeaders}
      />

      {/* 4. Notificações e Toast de Feedback */}
      <FeedbackBanner
        mensagem={mensagem}
        onClose={() => setMensagem(null)}
      />

    </div>
  );
}
