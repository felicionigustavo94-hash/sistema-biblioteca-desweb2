import React, { useState } from 'react';
import { X, Sparkles, BookPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function ModalCadastrarObra({ 
  aberto, 
  onClose, 
  onSalvo, 
  apiUrl, 
  getHeaders 
}) {
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

  const [buscandoIsbn, setBuscandoIsbn] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isbnFeedback, setIsbnFeedback] = useState(null);
  const [formErro, setFormErro] = useState(null);

  if (!aberto) return null;

  const buscarIsbn = async () => {
    if (!novoLivro.isbn) {
      setIsbnFeedback({ tipo: 'erro', texto: 'Informe o número do ISBN (ex: 9788576082675).' });
      return;
    }

    try {
      setBuscandoIsbn(true);
      setIsbnFeedback(null);
      setFormErro(null);
      const cleanIsbn = novoLivro.isbn.replace(/[^0-9X]/gi, '');
      const res = await axios.get(`${apiUrl}/books/lookup/isbn?isbn=${cleanIsbn}`);
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

      setIsbnFeedback({ 
        tipo: 'sucesso', 
        texto: `Metadados preenchidos com sucesso via ${dados.source || 'base pública'}!` 
      });
    } catch (_e) {
      setIsbnFeedback({ 
        tipo: 'erro', 
        texto: 'ISBN não localizado nas bases públicas. Preencha os campos manualmente.' 
      });
    } finally {
      setBuscandoIsbn(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novoLivro.title.trim() || !novoLivro.author.trim()) {
      setFormErro('Título e Autor são campos obrigatórios.');
      return;
    }

    try {
      setSalvando(true);
      setFormErro(null);
      await axios.post(`${apiUrl}/books`, novoLivro, getHeaders());
      onSalvo('Obra cadastrada com sucesso no acervo!');
      onClose();
      // Reset form
      setNovoLivro({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        synopsis: '',
        total_copies: 1,
        cover_path: '',
        published_year: '',
      });
      setIsbnFeedback(null);
    } catch (e) {
      setFormErro(e.response?.data?.message || 'Não foi possível cadastrar a obra. Verifique os dados.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0A372F]/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog Card (design.md: 12px radius, até 640px) */}
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-[12px] shadow-2xl border border-[#D5DED7] overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4 border-b border-[#D5DED7] flex items-center justify-between bg-[#F7F6F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#EFF6F2] text-[#1D5E51] flex items-center justify-center border border-[#DCEDE6]">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0A372F] leading-tight">
                Cadastrar Obra no Acervo
              </h2>
              <p className="text-xs text-[#5C6D65] mt-0.5">
                Preencha os metadados bibliográficos ou busque pelo código ISBN
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5C6D65] hover:text-[#203B34] hover:bg-[#EAF4ED] rounded-[6px] transition-colors"
            aria-label="Fechar diálogo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Mensagem de Erro Geral */}
          {formErro && (
            <div className="flex items-center gap-2 p-3 text-sm text-[#A43535] bg-[#FBEDEC] border border-[#A43535]/30 rounded-[6px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formErro}</span>
            </div>
          )}

          {/* Seção ISBN com Auto-Preenchimento */}
          <div className="p-4 bg-[#EFF6F2] border border-[#DCEDE6] rounded-[8px] space-y-2">
            <label className="block text-xs font-semibold text-[#0A372F] uppercase tracking-wider">
              Preenchimento Automático por ISBN (Opcional)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ex: 9788576082675"
                  value={novoLivro.isbn}
                  onChange={(e) => setNovoLivro({ ...novoLivro, isbn: e.target.value })}
                  className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51] numeric"
                />
              </div>
              <button
                type="button"
                onClick={buscarIsbn}
                disabled={buscandoIsbn}
                className="h-11 px-4 bg-[#1D5E51] hover:bg-[#154B41] disabled:bg-[#F0F2ED] disabled:text-[#5C6D65] text-white text-xs font-semibold rounded-[6px] flex items-center gap-2 transition-colors shrink-0"
              >
                {buscandoIsbn ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Consultando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Buscar Metadados</span>
                  </>
                )}
              </button>
            </div>

            {isbnFeedback && (
              <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${
                isbnFeedback.tipo === 'sucesso' ? 'text-[#216044]' : 'text-[#A43535]'
              }`}>
                {isbnFeedback.tipo === 'sucesso' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                <span>{isbnFeedback.texto}</span>
              </p>
            )}
          </div>

          {/* Campos Bibliográficos Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Título da Obra <span className="text-[#A43535]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Código Limpo: Habilidades Práticas do Agile Software"
                value={novoLivro.title}
                onChange={(e) => setNovoLivro({ ...novoLivro, title: e.target.value })}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Autor(a) / Autores <span className="text-[#A43535]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Robert C. Martin"
                value={novoLivro.author}
                onChange={(e) => setNovoLivro({ ...novoLivro, author: e.target.value })}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Gênero / Categoria
              </label>
              <input
                type="text"
                placeholder="Ex: Engenharia de Software, Tecnologia"
                value={novoLivro.genre}
                onChange={(e) => setNovoLivro({ ...novoLivro, genre: e.target.value })}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Ano de Publicação
              </label>
              <input
                type="number"
                placeholder="Ex: 2009"
                value={novoLivro.published_year}
                onChange={(e) => setNovoLivro({ ...novoLivro, published_year: e.target.value })}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51] numeric"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Total de Exemplares Físicos <span className="text-[#A43535]">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={novoLivro.total_copies}
                onChange={(e) => setNovoLivro({ ...novoLivro, total_copies: parseInt(e.target.value) || 1 })}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51] numeric"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                URL da Capa (Opcional)
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/capa.jpg"
                value={novoLivro.cover_path}
                onChange={(e) => setNovoLivro({ ...novoLivro, cover_path: e.target.value })}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#203B34] mb-1">
                Sinopse / Observações do Acervo
              </label>
              <textarea
                rows="3"
                placeholder="Breve descrição da obra para consulta dos leitores..."
                value={novoLivro.synopsis}
                onChange={(e) => setNovoLivro({ ...novoLivro, synopsis: e.target.value })}
                className="w-full p-3 bg-[#FFFFFF] border border-[#7D8D83] rounded-[6px] text-sm text-[#203B34] placeholder:text-[#5C6D65]/60 focus:outline-none focus:border-[#1D5E51] resize-none"
              />
            </div>
          </div>

          {/* Rodapé / Botões */}
          <div className="pt-4 border-t border-[#D5DED7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 text-sm font-medium text-[#5C6D65] hover:text-[#203B34] hover:bg-[#F0F2ED] rounded-[6px] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="h-11 px-6 bg-[#1D5E51] hover:bg-[#154B41] disabled:bg-[#F0F2ED] disabled:text-[#5C6D65] text-white text-sm font-semibold rounded-[6px] flex items-center gap-2 shadow-sm transition-colors"
            >
              {salvando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Salvando obra...</span>
                </>
              ) : (
                <span>Salvar Obra</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
