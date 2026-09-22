import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Componentes Estruturais de Layout
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FeedbackBanner from './components/FeedbackBanner';

// Componentes da Experiência do Leitor (design.md seção 19)
import LeitorHome from './components/LeitorHome';
import LeitorCatalogo from './components/LeitorCatalogo';
import LeitorMinhasLeituras from './components/LeitorMinhasLeituras';
import LeitorEmprestimos from './components/LeitorEmprestimos';

// Componentes da Experiência do Operador
import VisaoGeral from './components/VisaoGeral';
import Acervo from './components/Acervo';
import OperadorCatalogoDigital from './components/OperadorCatalogoDigital';
import Emprestimos from './components/Emprestimos';
import Usuarios from './components/Usuarios';

// Experiência Imersiva de Leitura e Autenticação
import Entrada from './components/Entrada';
import EbookReader from './components/EbookReader';
import ModalDetalheObra from './components/ModalDetalheObra';
import ModalCadastrarObra from './components/ModalCadastrarObra';
import ModalNovoEmprestimo from './components/ModalNovoEmprestimo';

// Endereço da API Laravel
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function App() {
  // Usuário Autenticado
  const [user, setUser] = useState(() => {
    try {
      const salvo = localStorage.getItem('biblioteca_user');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  // Página Ativa:
  // Se operador: 'visao-geral', 'acervo', 'catalogo-digital', 'emprestimos', 'usuarios', 'login'
  // Se leitor: 'inicio', 'explorar', 'leituras', 'meus-emprestimos', 'login'
  const [pagina, setPagina] = useState(() => {
    const salvo = localStorage.getItem('biblioteca_user');
    if (salvo) {
      try {
        const u = JSON.parse(salvo);
        return u.role === 'admin' ? 'visao-geral' : 'inicio';
      } catch {
        return 'inicio';
      }
    }
    return 'inicio';
  });

  const [menuAberto, setMenuAberto] = useState(false);

  // Token de Autenticação
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('biblioteca_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, []);

  // Notificações e Feedback
  const [mensagem, setMensagem] = useState(null);

  // =========================================================================
  // 1. ESTADO DO CATÁLOGO DIGITAL (PROJECT GUTENBERG)
  // =========================================================================
  const [livrosDigitais, setLivrosDigitais] = useState([]);
  const [carregandoDigitais, setCarregandoDigitais] = useState(false);
  const [buscaDigital, setBuscaDigital] = useState('');
  const [filtroIdiomaDigital, setFiltroIdiomaDigital] = useState('all'); // 'all', 'pt', 'en'
  const [filtroLeituraHabilitada, setFiltroLeituraHabilitada] = useState(false);
  const [paginaDigitalAtual, setPaginaDigitalAtual] = useState(1);
  const [totalPaginasDigitais, setTotalPaginasDigitais] = useState(1);
  const [totalLivrosDigitais, setTotalLivrosDigitais] = useState(192);
  const [digitaisStats, setDigitaisStats] = useState({
    total: 192,
    portugues: 127,
    ingles: 65,
    com_leitura: 192
  });

  // Leituras em Andamento e Favoritos do Leitor
  const [minhasLeituras, setMinhasLeituras] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  // Modal de Detalhe e Leitor em Tela Cheia
  const [obraDetalhe, setObraDetalhe] = useState(null);
  const [livroLendo, setLivroLendo] = useState(null);

  // =========================================================================
  // 2. ESTADO DO ACERVO FÍSICO E OPERACIONAL
  // =========================================================================
  const [livrosFisicos, setLivrosFisicos] = useState([]);
  const [carregandoFisicos, setCarregandoFisicos] = useState(false);
  const [buscaFisico, setBuscaFisico] = useState('');
  const [filtroDisponivelFisico, setFiltroDisponivelFisico] = useState(false);
  const [emprestimos, setEmprestimos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Modais Operacionais
  const [modalLivroAberto, setModalLivroAberto] = useState(false);
  const [modalEmprestimoAberto, setModalEmprestimoAberto] = useState(false);

  // Estado de Autenticação
  const [authCarregando, setAuthCarregando] = useState(false);
  const [authErro, setAuthErro] = useState(null);

  // =========================================================================
  // CARREGAMENTO DE DADOS DA API
  // =========================================================================

  // 1. Carregar Catálogo Digital
  const carregarLivrosDigitais = useCallback(async (termo = buscaDigital, idioma = filtroIdiomaDigital, pag = paginaDigitalAtual) => {
    try {
      setCarregandoDigitais(true);
      const params = new URLSearchParams();
      if (termo) params.append('search', termo);
      if (idioma && idioma !== 'all') params.append('language', idioma);
      params.append('page', pag);
      params.append('per_page', 24);

      const res = await axios.get(`${API_URL}/digital-books?${params.toString()}`, getHeaders());
      setLivrosDigitais(res.data.data || []);
      setTotalPaginasDigitais(res.data.last_page || 1);
      setTotalLivrosDigitais(res.data.total || 0);
    } catch (e) {
      console.error('Erro ao carregar catálogo digital:', e);
    } finally {
      setCarregandoDigitais(false);
    }
  }, [buscaDigital, filtroIdiomaDigital, paginaDigitalAtual, getHeaders]);

  // 2. Carregar Estatísticas Digitais
  const carregarStatsDigitais = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/digital-books/stats`);
      setDigitaisStats(res.data);
    } catch (e) {
      console.error('Erro ao carregar estatísticas:', e);
    }
  }, []);

  // 3. Carregar Leituras em Andamento do Usuário
  const carregarMinhasLeituras = useCallback(async () => {
    if (!user) {
      setMinhasLeituras([]);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/digital-books/my-readings`, getHeaders());
      setMinhasLeituras(res.data || []);
    } catch (e) {
      console.error('Erro ao carregar minhas leituras:', e);
    }
  }, [user, getHeaders]);

  // 4. Carregar Favoritos do Usuário
  const carregarFavoritos = useCallback(async () => {
    if (!user) {
      setFavoritos([]);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/digital-books/favorites`, getHeaders());
      setFavoritos(res.data || []);
    } catch (e) {
      console.error('Erro ao carregar favoritos:', e);
    }
  }, [user, getHeaders]);

  // 5. Carregar Obras do Acervo Físico
  const carregarLivrosFisicos = useCallback(async (termo = buscaFisico) => {
    try {
      setCarregandoFisicos(true);
      const url = termo ? `${API_URL}/books?search=${encodeURIComponent(termo)}` : `${API_URL}/books`;
      const res = await axios.get(url);
      setLivrosFisicos(res.data.data || res.data || []);
    } catch (e) {
      console.error('Erro ao carregar acervo físico:', e);
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Não foi possível conectar ao servidor da biblioteca (http://127.0.0.1:8000).' 
      });
    } finally {
      setCarregandoFisicos(false);
    }
  }, [buscaFisico]);

  // 6. Carregar Empréstimos
  const carregarEmprestimos = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/loans`, getHeaders());
      setEmprestimos(res.data || []);
    } catch (e) {
      console.error('Erro ao carregar empréstimos:', e);
    }
  }, [getHeaders]);

  // 7. Carregar Usuários (Apenas Admin)
  const carregarUsuarios = useCallback(async () => {
    if (user?.role !== 'admin') return;
    try {
      const res = await axios.get(`${API_URL}/users`, getHeaders());
      setUsuarios(res.data || []);
    } catch (e) {
      console.error('Erro ao carregar usuários:', e);
    }
  }, [user, getHeaders]);

  // Carregamento inicial de recursos
  useEffect(() => {
    carregarStatsDigitais();
    carregarLivrosDigitais();
    carregarLivrosFisicos();
    carregarEmprestimos();
    if (user) {
      carregarMinhasLeituras();
      carregarFavoritos();
      if (user.role === 'admin') {
        carregarUsuarios();
      }
    }
  }, [user]);

  // Reativo a busca digital e filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarLivrosDigitais(buscaDigital, filtroIdiomaDigital, paginaDigitalAtual);
    }, 300);
    return () => clearTimeout(timer);
  }, [buscaDigital, filtroIdiomaDigital, paginaDigitalAtual]);

  // Reativo a busca de livros físicos
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarLivrosFisicos(buscaFisico);
    }, 300);
    return () => clearTimeout(timer);
  }, [buscaFisico]);

  // =========================================================================
  // HANDLERS E OPERAÇÕES DO SISTEMA
  // =========================================================================

  // Abrir Ficha Detalhada da Obra
  const handleAbrirDetalhes = (obra) => {
    setObraDetalhe(obra);
  };

  // Abrir Leitor Digital em Tela Cheia
  const handleLerAgora = (obra) => {
    setObraDetalhe(null);
    setLivroLendo(obra);
  };

  // Alternar Favorito
  const handleToggleFavorito = async (digitalBookId) => {
    if (!user) {
      setMensagem({ tipo: 'aviso', texto: 'Faça login para salvar obras nos favoritos.' });
      setPagina('login');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/digital-books/${digitalBookId}/favorite`, {}, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: res.data.message });
      carregarFavoritos();
      carregarLivrosDigitais();
      if (obraDetalhe && obraDetalhe.id === digitalBookId) {
        setObraDetalhe(prev => ({ ...prev, is_favorite: res.data.is_favorite }));
      }
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível atualizar os favoritos.' });
    }
  };

  // Registrar Empréstimo Físico Rápido
  const handleFazerEmprestimoRapido = async (bookId) => {
    if (!user) {
      setMensagem({ tipo: 'aviso', texto: 'Faça login para solicitar um empréstimo.' });
      setPagina('login');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/loans`, { book_id: bookId }, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: res.data.message || 'Empréstimo registrado com sucesso!' });
      carregarLivrosFisicos(buscaFisico);
      carregarEmprestimos();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.response?.data?.message || 'Não foi possível realizar o empréstimo.' });
    }
  };

  // Devolver Livro Físico
  const handleDevolverLivro = async (loanId) => {
    try {
      await axios.post(`${API_URL}/loans/${loanId}/return`, {}, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Devolução confirmada. O exemplar retornou ao acervo disponível.' });
      carregarEmprestimos();
      carregarLivrosFisicos(buscaFisico);
    } catch (_e) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível confirmar a devolução.' });
    }
  };

  // Excluir Obra do Acervo Físico (Operador)
  const handleExcluirLivro = async (id, titulo) => {
    if (!window.confirm(`Deseja remover a obra "${titulo}" do acervo físico?`)) return;
    try {
      await axios.delete(`${API_URL}/books/${id}`, getHeaders());
      setMensagem({ tipo: 'sucesso', texto: 'Obra removida do acervo físico com sucesso.' });
      carregarLivrosFisicos(buscaFisico);
    } catch (_e) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível remover a obra.' });
    }
  };

  // Alternar Role de Usuário (Operador)
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

  // Autenticação (Login / Cadastro)
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
      
      // Redirecionamento de acordo com o papel
      if (logado.role === 'admin') {
        setPagina('visao-geral');
      } else {
        setPagina('inicio');
      }
    } catch (e) {
      setAuthErro(e.response?.data?.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setAuthCarregando(false);
    }
  };

  // Encerrar Sessão (Logout)
  const handleLogout = () => {
    localStorage.removeItem('biblioteca_token');
    localStorage.removeItem('biblioteca_user');
    setUser(null);
    setMinhasLeituras([]);
    setFavoritos([]);
    setMensagem({ tipo: 'sucesso', texto: 'Sessão encerrada com sucesso.' });
    setPagina('inicio');
  };

  // Calcular Títulos de Contexto do Header
  const getContextoHeader = () => {
    switch (pagina) {
      case 'inicio':
        return { 
          titulo: 'Início · Biblioteca Digital', 
          subtitulo: 'Destaques literários, leituras em andamento e circulação' 
        };
      case 'explorar':
        return { 
          titulo: 'Explorar Livros', 
          subtitulo: 'Acervo de clássicos integrais de domínio público do Project Gutenberg' 
        };
      case 'leituras':
        return { 
          titulo: 'Minha Leitura', 
          subtitulo: 'Seus livros em andamento, posições salvas e obras favoritadas' 
        };
      case 'meus-emprestimos':
        return { 
          titulo: 'Meus Empréstimos Físicos', 
          subtitulo: 'Exemplares retirados na biblioteca e controle de prazos' 
        };
      case 'visao-geral':
        return { 
          titulo: 'Visão Geral', 
          subtitulo: 'Circulação e indicadores operacionais da biblioteca' 
        };
      case 'acervo':
        return { 
          titulo: 'Acervo Físico', 
          subtitulo: 'Consulta e catálogo de obras bibliográficas' 
        };
      case 'catalogo-digital':
        return { 
          titulo: 'Catálogo Digital', 
          subtitulo: 'Gestão de obras de domínio público do Project Gutenberg' 
        };
      case 'emprestimos':
        return { 
          titulo: 'Empréstimos', 
          subtitulo: 'Controle de circulação e prazos de devolução' 
        };
      case 'usuarios':
        return { 
          titulo: 'Leitores e Operadores', 
          subtitulo: 'Administração de contas e perfis de acesso' 
        };
      default:
        return { 
          titulo: 'BiblioGest', 
          subtitulo: 'Sistema de Gestão de Biblioteca' 
        };
    }
  };

  // =========================================================================
  // RENDERIZAÇÃO CONDICIONAL: LEITOR INTEGRAL OU TELA DE LOGIN AUTÔNOMA
  // =========================================================================

  // Se o leitor está lendo uma obra, renderizar o EbookReader em tela cheia
  if (livroLendo) {
    return (
      <EbookReader
        livro={livroLendo}
        apiUrl={API_URL}
        getHeaders={getHeaders}
        onFechar={() => {
          setLivroLendo(null);
          carregarMinhasLeituras();
          carregarLivrosDigitais();
        }}
      />
    );
  }

  // Se o usuário está na tela de autenticação, renderizar a Entrada autônoma
  if (pagina === 'login') {
    return (
      <>
        <Entrada
          onLogin={handleLogin}
          carregando={authCarregando}
          erro={authErro}
          onVoltar={() => setPagina(user?.role === 'admin' ? 'visao-geral' : 'inicio')}
        />
        <FeedbackBanner
          mensagem={mensagem}
          onClose={() => setMensagem(null)}
        />
      </>
    );
  }

  // =========================================================================
  // RENDERIZAÇÃO PADRÃO: APLICAÇÃO COM SIDEBAR, HEADER E CANVAS SUAVE
  // =========================================================================
  const contexto = getContextoHeader();
  const totalEmprestimosAtivos = emprestimos.filter(e => e.status !== 'devolvido').length;

  return (
    <div className="min-h-screen bg-[#EFF6F2] text-[#203B34] flex font-sans antialiased">
      
      {/* 1. Barra Lateral de Navegação (240px fixo em verde profundo #0A372F) */}
      <Sidebar
        paginaAtiva={pagina}
        setPagina={setPagina}
        user={user}
        logout={handleLogout}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
        totalLivros={livrosFisicos.length}
        totalDigitais={digitaisStats?.total || 192}
        totalEmprestimosAtivos={totalEmprestimosAtivos}
      />

      {/* 2. Área Central de Aplicação */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Cabeçalho de Contexto (64px) */}
        <Header
          tituloContexto={contexto.titulo}
          subtituloContexto={contexto.subtitulo}
          user={user}
          setMenuAberto={setMenuAberto}
          setPagina={setPagina}
        />

        {/* Conteúdo Principal com 32px de margem conforme design.md */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          
          {/* ================= PÁGINAS DO LEITOR ================= */}

          {pagina === 'inicio' && (
            <LeitorHome
              livrosDigitais={livrosDigitais}
              minhasLeituras={minhasLeituras}
              meusEmprestimos={emprestimos}
              onAbrirDetalhes={handleAbrirDetalhes}
              onLerAgora={handleLerAgora}
              setPagina={setPagina}
              busca={buscaDigital}
              setBusca={setBuscaDigital}
            />
          )}

          {pagina === 'explorar' && (
            <LeitorCatalogo
              livrosDigitais={livrosDigitais}
              carregando={carregandoDigitais}
              busca={buscaDigital}
              setBusca={setBuscaDigital}
              filtroIdioma={filtroIdiomaDigital}
              setFiltroIdioma={setFiltroIdiomaDigital}
              filtroLeituraHabilitada={filtroLeituraHabilitada}
              setFiltroLeituraHabilitada={setFiltroLeituraHabilitada}
              paginaAtual={paginaDigitalAtual}
              setPaginaAtual={setPaginaDigitalAtual}
              totalPaginas={totalPaginasDigitais}
              totalLivros={totalLivrosDigitais}
              onAbrirDetalhes={handleAbrirDetalhes}
              onLimparFiltros={() => {
                setBuscaDigital('');
                setFiltroIdiomaDigital('all');
                setFiltroLeituraHabilitada(false);
                setPaginaDigitalAtual(1);
              }}
            />
          )}

          {pagina === 'leituras' && (
            <LeitorMinhasLeituras
              minhasLeituras={minhasLeituras}
              favoritos={favoritos}
              onLerAgora={handleLerAgora}
              onAbrirDetalhes={handleAbrirDetalhes}
              setPagina={setPagina}
            />
          )}

          {pagina === 'meus-emprestimos' && (
            <LeitorEmprestimos
              emprestimos={emprestimos}
              user={user}
              setPagina={setPagina}
            />
          )}

          {/* ================= PÁGINAS DO OPERADOR ================= */}

          {pagina === 'visao-geral' && (
            <VisaoGeral
              livros={livrosFisicos}
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
              livros={livrosFisicos}
              carregando={carregandoFisicos}
              busca={buscaFisico}
              setBusca={setBuscaFisico}
              filtroDisponivel={filtroDisponivelFisico}
              setFiltroDisponivel={setFiltroDisponivelFisico}
              user={user}
              onAbrirNovoLivro={() => setModalLivroAberto(true)}
              onFazerEmprestimo={handleFazerEmprestimoRapido}
              onExcluirLivro={handleExcluirLivro}
              onLimparFiltros={() => { setBuscaFisico(''); setFiltroDisponivelFisico(false); }}
            />
          )}

          {pagina === 'catalogo-digital' && (
            <OperadorCatalogoDigital
              livrosDigitais={livrosDigitais}
              stats={digitaisStats}
              carregando={carregandoDigitais}
              busca={buscaDigital}
              setBusca={setBuscaDigital}
              filtroIdioma={filtroIdiomaDigital}
              setFiltroIdioma={setFiltroIdiomaDigital}
              paginaAtual={paginaDigitalAtual}
              setPaginaAtual={setPaginaDigitalAtual}
              totalPaginas={totalPaginasDigitais}
              totalLivros={totalLivrosDigitais}
              onAbrirDetalhes={handleAbrirDetalhes}
              onLerAgora={handleLerAgora}
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

        </main>
      </div>

      {/* 3. Modal de Detalhe da Obra Digital (Leitor e Operador) */}
      <ModalDetalheObra
        obra={obraDetalhe}
        aberto={!!obraDetalhe}
        onClose={() => setObraDetalhe(null)}
        onLerAgora={handleLerAgora}
        onToggleFavorito={handleToggleFavorito}
      />

      {/* 4. Diálogos Modais Operacionais */}
      <ModalCadastrarObra
        aberto={modalLivroAberto}
        onClose={() => setModalLivroAberto(false)}
        onSalvo={(msg) => {
          setMensagem({ tipo: 'sucesso', texto: msg });
          carregarLivrosFisicos(buscaFisico);
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
          carregarLivrosFisicos(buscaFisico);
        }}
        livros={livrosFisicos}
        usuarios={usuarios}
        user={user}
        apiUrl={API_URL}
        getHeaders={getHeaders}
      />

      {/* 5. Notificações e Toast de Feedback */}
      <FeedbackBanner
        mensagem={mensagem}
        onClose={() => setMensagem(null)}
      />

    </div>
  );
}
