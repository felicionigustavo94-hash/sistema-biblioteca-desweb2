import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Book, BookmarkCheck, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Carrega a lista de livros do back-end
  const fetchBooks = async (searchTerm = '') => {
    try {
      setLoading(true);
      const url = searchTerm ? `/books?search=${encodeURIComponent(searchTerm)}` : '/books';
      const response = await api.get(url);
      setBooks(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setMessage({ type: 'error', text: 'Não foi possível carregar os livros. Verifique se o back-end está rodando.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Busca quando o usuário digita na barra
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  // Função para pegar livro emprestado
  const handleBorrow = async (bookId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/loans', { book_id: bookId });
      setMessage({ type: 'success', text: response.data.message || 'Empréstimo realizado com sucesso!' });
      // Atualiza a lista para diminuir a quantidade disponível na tela
      fetchBooks(search);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao realizar empréstimo.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  // Função para excluir livro (Admin)
  const handleDelete = async (bookId, title) => {
    if (!window.confirm(`Tem certeza que deseja excluir o livro "${title}"?`)) return;

    try {
      await api.delete(`/books/${bookId}`);
      setMessage({ type: 'success', text: 'Livro excluído com sucesso!' });
      fetchBooks(search);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao excluir o livro.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Acervo da Biblioteca</h1>
          <p className="text-slate-500 text-sm mt-1">Explore os livros disponíveis para empréstimo e consulta</p>
        </div>

        {/* Formulário de Busca */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por título, autor ou ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-sm cursor-pointer"
          >
            Buscar
          </button>
        </form>
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

      {/* Grid de Livros */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 text-sm mt-3">Carregando acervo...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <Book className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">Nenhum livro encontrado</h3>
          <p className="text-slate-500 text-sm mt-1">Tente buscar por outro termo ou cadastre novos livros no sistema.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const isAvailable = (book.available_copies ?? 0) > 0;

            return (
              <div
                key={book.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Capa do Livro */}
                  <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {book.cover_url || book.cover_path ? (
                      <img
                        src={book.cover_url || book.cover_path}
                        alt={book.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Book className="w-10 h-10 mb-1" />
                        <span className="text-xs">Sem capa</span>
                      </div>
                    )}

                    {/* Badge de Disponibilidade */}
                    <span
                      className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {isAvailable ? `${book.available_copies} disponível(is)` : 'Esgotado'}
                    </span>
                  </div>

                  {/* Informações do Livro */}
                  <div className="p-5">
                    {book.genre && (
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                        {book.genre}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">Autor: <span className="font-medium text-slate-800">{book.author}</span></p>

                    {book.isbn && (
                      <p className="text-[11px] text-slate-400 mt-1">ISBN: {book.isbn}</p>
                    )}

                    {book.synopsis && (
                      <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                        {book.synopsis}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => handleBorrow(book.id)}
                    disabled={!isAvailable}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition shadow-sm ${
                      isAvailable
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{isAvailable ? 'Emprestar Livro' : 'Indisponível'}</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Excluir Livro"
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
  );
}