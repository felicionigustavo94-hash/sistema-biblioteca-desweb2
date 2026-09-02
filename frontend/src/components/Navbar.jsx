import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, BookPlus, Repeat, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90">
          <BookOpen className="w-6 h-6" />
          <span>Biblioteca Web</span>
        </Link>

        {/* Links Principais */}
        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Livros</span>
          </Link>

          <Link
            to="/cadastrar-livro"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            <BookPlus className="w-4 h-4" />
            <span>Cadastrar Livro</span>
          </Link>

          <Link
            to="/emprestimos"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            <Repeat className="w-4 h-4" />
            <span>Empréstimos</span>
          </Link>
        </nav>

        {/* Área do Usuário / Login */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold">{user.name}</div>
                <div className="text-[11px] text-indigo-200 uppercase">{user.role || 'Leitor'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-indigo-800 hover:bg-indigo-900 text-xs px-3 py-2 rounded-lg font-medium transition cursor-pointer"
                title="Sair do sistema"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}