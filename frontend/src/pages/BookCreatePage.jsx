import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BookPlus, Search, Sparkles, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function BookCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    synopsis: '',
    total_copies: 1,
    cover_path: '',
    published_year: '',
    publisher: '',
  });

  const [coverFile, setCoverFile] = useState(null);
  const [searchingIsbn, setSearchingIsbn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Manipula alterações nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Busca dados do livro pelo ISBN na API pública via back-end Laravel
  const handleLookupIsbn = async () => {
    if (!formData.isbn) {
      setMessage({ type: 'error', text: 'Por favor, digite um ISBN para buscar (ex: 9788576082675).' });
      return;
    }

    try {
      setSearchingIsbn(true);
      setMessage(null);
      const response = await api.get(`/books/lookup/isbn?isbn=${formData.isbn.trim()}`);
      const data = response.data;

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        author: data.author || prev.author,
        genre: data.genre || prev.genre,
        synopsis: data.synopsis || prev.synopsis,
        published_year: data.published_year || prev.published_year,
        publisher: data.publisher || prev.publisher,
        cover_path: data.cover_path || prev.cover_path,
      }));

      setMessage({
        type: 'success',
        text: `Dados encontrados com sucesso via ${data.source || 'API pública'}!`,
      });
    } catch (error) {
      console.error('Erro na busca por ISBN:', error);
      setMessage({
        type: 'error',
        text: 'Nenhum livro encontrado para este ISBN nas APIs públicas. Você pode preencher os campos manualmente.',
      });
    } finally {
      setSearchingIsbn(false);
    }
  };

  // Salva o livro no banco de dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Se houver upload de arquivo de imagem, envia via FormData multipart
      if (coverFile) {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== '') {
            data.append(key, formData[key]);
          }
        });
        data.append('cover', coverFile);
        await api.post('/books', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/books', formData);
      }

      alert('Livro cadastrado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      const errorMsg = error.response?.data?.message || 'Erro ao cadastrar o livro. Verifique os campos.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Acervo</span>
      </button>

      {/* Card Principal */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg">
            <BookPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Cadastrar Novo Livro</h1>
            <p className="text-xs sm:text-sm text-slate-500">Adicione livros ao catálogo ou consulte dados por ISBN</p>
          </div>
        </div>

        {/* Mensagens de Notificação */}
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

        {/* Caixa de Busca por ISBN da API Pública */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 mb-6">
          <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Preenchimento Automático por ISBN (Google Books / Open Library)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="isbn"
              placeholder="Ex: 9788576082675 (Código Limpo) ou 9788580571875"
              value={formData.isbn}
              onChange={handleChange}
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleLookupIsbn}
              disabled={searchingIsbn}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{searchingIsbn ? 'Buscando...' : 'Buscar Dados'}</span>
            </button>
          </div>
          <p className="text-[11px] text-indigo-700 mt-2">
            💡 Dica: Digite o ISBN e clique em "Buscar Dados" para que o sistema encontre o título, autor e capa automaticamente!
          </p>
        </div>

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Livro *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Dom Casmurro"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Autor *</label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="Ex: Machado de Assis"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gênero / Categoria</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Ex: Literatura Clássica, Ficção, Tecnologia"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade de Exemplares *</label>
              <input
                type="number"
                name="total_copies"
                min="1"
                required
                value={formData.total_copies}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ano de Publicação</label>
              <input
                type="text"
                name="published_year"
                value={formData.published_year}
                onChange={handleChange}
                placeholder="Ex: 1899"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem da Capa (Opcional)</label>
              <input
                type="text"
                name="cover_path"
                value={formData.cover_path}
                onChange={handleChange}
                placeholder="https://exemplo.com/capa.jpg"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ou faça upload da Capa do seu computador (Opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sinopse / Descrição</label>
              <textarea
                name="synopsis"
                rows="3"
                value={formData.synopsis}
                onChange={handleChange}
                placeholder="Breve resumo da obra..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer"
            >
              {submitting ? 'Salvando...' : 'Salvar Livro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}