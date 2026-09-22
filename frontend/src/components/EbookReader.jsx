import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  List,
  Moon,
  Maximize2,
  Minimize2
} from 'lucide-react';
import axios from 'axios';

export default function EbookReader({
  livro,
  apiUrl,
  getHeaders,
  onFechar
}) {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [conteudo, setConteudo] = useState(null);
  const [capituloAtual, setCapituloAtual] = useState(0);
  const [menuCapitulosAberto, setMenuCapitulosAberto] = useState(false);
  const [progressoSalvo, setProgressoSalvo] = useState(false);

  // Preferências de Leitura do Usuário
  const [tema, setTema] = useState('papel'); // 'papel', 'sepia', 'escuro'
  const [tamanhoFonte, setTamanhoFonte] = useState(18); // 16, 18, 20, 22
  const [larguraTexto, setLarguraTexto] = useState('normal'); // 'normal' (max-w-2xl), 'ampla' (max-w-4xl)

  const containerRef = useRef(null);

  // 1. Carregar Conteúdo do E-book da API
  useEffect(() => {
    let ativo = true;

    const carregarConteudo = async () => {
      try {
        setCarregando(true);
        setErro(null);

        // Buscar capítulos processados no backend
        const res = await axios.get(`${apiUrl}/digital-books/${livro.id}/content`);
        if (!ativo) return;
        
        setConteudo(res.data);

        // Se o livro já tinha progresso salvo, retomar na posição
        if (livro.progress?.chapter_index !== undefined) {
          const capSalvo = Math.min(livro.progress.chapter_index, (res.data.chapters?.length || 1) - 1);
          setCapituloAtual(capSalvo);
        }
      } catch (e) {
        if (!ativo) return;
        setErro('Não foi possível carregar o conteúdo integral deste e-book no momento.');
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregarConteudo();

    return () => {
      ativo = false;
    };
  }, [livro.id, apiUrl]);

  // 2. Salvar Progresso de Leitura
  const salvarProgresso = async (novoCapitulo) => {
    if (!conteudo?.chapters?.length) return;

    const totalCap = conteudo.chapters.length;
    const porcentagem = Math.min(100, Math.round(((novoCapitulo + 1) / totalCap) * 100));
    const tituloCap = conteudo.chapters[novoCapitulo]?.title || `Capítulo ${novoCapitulo + 1}`;

    try {
      await axios.post(`${apiUrl}/reading-progress`, {
        digital_book_id: livro.id,
        chapter_index: novoCapitulo,
        chapter_title: tituloCap,
        percentage: porcentagem,
        location: `cap_${novoCapitulo}`,
      }, getHeaders());

      setProgressoSalvo(true);
      setTimeout(() => setProgressoSalvo(false), 2500);
    } catch {
      // Falha silenciosa de salvamento em modo offline/visitante
    }
  };

  // 3. Mudar de Capítulo
  const irParaCapitulo = (indice) => {
    if (!conteudo?.chapters || indice < 0 || indice >= conteudo.chapters.length) return;
    setCapituloAtual(indice);
    setMenuCapitulosAberto(false);
    salvarProgresso(indice);

    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 4. Navegação por Teclado (Setas Esquerda / Direita)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        irParaCapitulo(capituloAtual + 1);
      } else if (e.key === 'ArrowLeft') {
        irParaCapitulo(capituloAtual - 1);
      } else if (e.key === 'Escape') {
        onFechar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [capituloAtual, conteudo]);

  // Temas de Cores
  const getThemeClasses = () => {
    switch (tema) {
      case 'sepia':
        return {
          bg: 'bg-[#FBF0D9]',
          text: 'text-[#5F4B32]',
          headerBg: 'bg-[#F4E6C8]',
          border: 'border-[#E2CEAB]',
          navBtn: 'hover:bg-[#EBD8B8]',
        };
      case 'escuro':
        return {
          bg: 'bg-[#141E1A]',
          text: 'text-[#DCEDE6]',
          headerBg: 'bg-[#0B1512]',
          border: 'border-[#1C2C26]',
          navBtn: 'hover:bg-[#1C2C26]',
        };
      case 'papel':
      default:
        return {
          bg: 'bg-[#F7F6F1]',
          text: 'text-[#203B34]',
          headerBg: 'bg-[#EFECE3]',
          border: 'border-[#D5DED7]',
          navBtn: 'hover:bg-[#E3DFD4]',
        };
    }
  };

  const themeStyle = getThemeClasses();
  const capitulos = conteudo?.chapters || [];
  const capituloAtivo = capitulos[capituloAtual];
  const percentualGeral = capitulos.length > 0 
    ? Math.round(((capituloAtual + 1) / capitulos.length) * 100) 
    : 0;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeStyle.bg} ${themeStyle.text} select-text transition-colors duration-200`}>
      
      {/* Barra Superior de Leitura (Discreta e Acessível) */}
      <header className={`h-14 px-4 sm:px-6 flex items-center justify-between border-b ${themeStyle.border} ${themeStyle.headerBg} shrink-0 z-20`}>
        
        {/* Lado Esquerdo: Botão Voltar ao Catálogo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onFechar}
            className={`p-2 rounded-[6px] ${themeStyle.navBtn} transition-colors flex items-center gap-1.5 text-xs font-semibold`}
            title="Voltar ao Catálogo (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-[#C6A15B]" />
            <span className="hidden sm:inline">Biblioteca</span>
          </button>

          <div className="h-4 w-px bg-current/20 hidden sm:block" />

          {/* Título da Obra */}
          <div className="max-w-[200px] sm:max-w-md truncate">
            <h1 className="text-xs sm:text-sm font-semibold truncate leading-tight">
              {livro.title}
            </h1>
            <p className="text-[0.6875rem] opacity-70 truncate hidden sm:block">
              {livro.author}
            </p>
          </div>
        </div>

        {/* Centro: Indicador de Progresso Salvo */}
        {progressoSalvo && (
          <div className="hidden md:flex items-center gap-1 text-[0.6875rem] font-semibold text-[#216044] bg-[#EAF4ED] px-2 py-0.5 rounded animate-in fade-in">
            <CheckCircle2 className="w-3 h-3" />
            <span>Progresso salvo</span>
          </div>
        )}

        {/* Lado Direito: Controles de Leitura */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Seletor de Capítulos (Sumário) */}
          <div className="relative">
            <button
              onClick={() => setMenuCapitulosAberto(!menuCapitulosAberto)}
              className={`p-2 rounded-[6px] ${themeStyle.navBtn} text-xs font-semibold flex items-center gap-1.5 transition-colors`}
              title="Sumário de Capítulos"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline numeric text-[0.75rem]">
                Cap. {capituloAtual + 1}/{capitulos.length || 1}
              </span>
            </button>

            {menuCapitulosAberto && (
              <div className={`absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-[8px] shadow-2xl border ${themeStyle.border} ${themeStyle.headerBg} p-2 z-30 animate-in fade-in`}>
                <div className="p-2 text-xs font-bold uppercase tracking-wider opacity-60 border-b border-current/10 mb-1">
                  Índice de Capítulos
                </div>
                {capitulos.map((cap, idx) => (
                  <button
                    key={idx}
                    onClick={() => irParaCapitulo(idx)}
                    className={`w-full text-left p-2 rounded-[4px] text-xs transition-colors truncate block ${
                      idx === capituloAtual ? 'font-bold bg-current/15' : 'hover:bg-current/5 opacity-80'
                    }`}
                  >
                    {idx + 1}. {cap.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tamanho de Fonte (A- / A+) */}
          <div className="flex items-center border border-current/20 rounded-[6px] overflow-hidden text-xs">
            <button
              onClick={() => setTamanhoFonte(Math.max(14, tamanhoFonte - 2))}
              className={`px-2 py-1.5 ${themeStyle.navBtn} font-serif`}
              title="Diminuir fonte"
            >
              A-
            </button>
            <span className="px-1.5 text-[0.6875rem] opacity-60 numeric">{tamanhoFonte}</span>
            <button
              onClick={() => setTamanhoFonte(Math.min(26, tamanhoFonte + 2))}
              className={`px-2 py-1.5 ${themeStyle.navBtn} font-serif`}
              title="Aumentar fonte"
            >
              A+
            </button>
          </div>

          {/* Temas de Leitura */}
          <div className="flex items-center border border-current/20 rounded-[6px] p-0.5 gap-0.5">
            <button
              onClick={() => setTema('papel')}
              className={`w-6 h-6 rounded flex items-center justify-center text-[0.625rem] font-bold ${
                tema === 'papel' ? 'bg-[#203B34] text-white shadow-xs' : 'opacity-60'
              }`}
              title="Tema Papel Claro"
            >
              P
            </button>
            <button
              onClick={() => setTema('sepia')}
              className={`w-6 h-6 rounded flex items-center justify-center text-[0.625rem] font-bold ${
                tema === 'sepia' ? 'bg-[#5F4B32] text-white shadow-xs' : 'opacity-60'
              }`}
              title="Tema Sépia Conforto"
            >
              S
            </button>
            <button
              onClick={() => setTema('escuro')}
              className={`w-6 h-6 rounded flex items-center justify-center text-[0.625rem] font-bold ${
                tema === 'escuro' ? 'bg-[#0B1512] text-white shadow-xs' : 'opacity-60'
              }`}
              title="Tema Noturno Escuro"
            >
              <Moon className="w-3 h-3" />
            </button>
          </div>

          {/* Largura do Bloco */}
          <button
            onClick={() => setLarguraTexto(larguraTexto === 'normal' ? 'ampla' : 'normal')}
            className={`p-2 rounded-[6px] ${themeStyle.navBtn} hidden sm:flex items-center`}
            title={larguraTexto === 'normal' ? 'Expandir largura' : 'Largura padrão'}
          >
            {larguraTexto === 'normal' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

        </div>

      </header>

      {/* Barra de Progresso de Leitura Superior */}
      <div className="w-full h-1 bg-current/10 shrink-0">
        <div 
          className="h-full bg-[#C6A15B] transition-all duration-300"
          style={{ width: `${percentualGeral}%` }}
        />
      </div>

      {/* Área Central de Leitura com Scroll */}
      <main 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-8 sm:py-12 flex justify-center"
      >
        <div className={`w-full ${larguraTexto === 'normal' ? 'max-w-2xl' : 'max-w-4xl'} space-y-8 font-serif leading-relaxed transition-all`}>
          
          {carregando ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-sans font-medium opacity-80">
                Carregando e sanitizando texto da obra...
              </p>
            </div>
          ) : erro ? (
            <div className="py-20 text-center space-y-4 font-sans">
              <p className="text-base text-[#A43535] font-semibold">{erro}</p>
              {livro.html_url && (
                <a
                  href={livro.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D5E51] text-white rounded-[6px] text-xs font-semibold"
                >
                  Ler diretamente na fonte (Project Gutenberg)
                </a>
              )}
            </div>
          ) : capituloAtivo ? (
            <article className="space-y-6">
              
              {/* Título do Capítulo */}
              <div className="text-center pb-6 border-b border-current/15 space-y-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#C6A15B]">
                  Capítulo {capituloAtual + 1} de {capitulos.length}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                  {capituloAtivo.title}
                </h2>
              </div>

              {/* Corpo do Texto Sanitizado */}
              <div 
                className="prose max-w-none text-justify space-y-4"
                style={{ 
                  fontSize: `${tamanhoFonte}px`, 
                  lineHeight: '1.8' 
                }}
                dangerouslySetInnerHTML={{ __html: capituloAtivo.content }}
              />

              {/* Rodapé de Navegação Entre Capítulos */}
              <div className="pt-12 pb-8 border-t border-current/15 flex items-center justify-between font-sans">
                <button
                  onClick={() => irParaCapitulo(capituloAtual - 1)}
                  disabled={capituloAtual <= 0}
                  className={`h-11 px-4 rounded-[6px] border border-current/20 flex items-center gap-2 text-xs font-semibold ${themeStyle.navBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Capítulo Anterior</span>
                </button>

                <span className="text-xs font-semibold opacity-70 numeric">
                  {percentualGeral}% concluído
                </span>

                <button
                  onClick={() => irParaCapitulo(capituloAtual + 1)}
                  disabled={capituloAtual >= capitulos.length - 1}
                  className={`h-11 px-4 rounded-[6px] border border-current/20 flex items-center gap-2 text-xs font-semibold ${themeStyle.navBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  <span>Próximo Capítulo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </article>
          ) : null}

        </div>
      </main>

    </div>
  );
}
