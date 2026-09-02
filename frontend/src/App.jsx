import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BookListPage from './pages/BookListPage';
import BookCreatePage from './pages/BookCreatePage';
import LoansPage from './pages/LoansPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          {/* Barra de Navegação */}
          <Navbar />

          {/* Conteúdo da Página */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<BookListPage />} />
              <Route path="/cadastrar-livro" element={<BookCreatePage />} />
              <Route path="/emprestimos" element={<LoansPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>

          {/* Rodapé Simples */}
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            <p>Sistema de Gestão de Biblioteca • Trabalho Semestral de Desenvolvimento Web II • Fatec</p>
            <p className="mt-1 text-slate-400">Desenvolvido com React, Laravel 11, PostgreSQL e Docker</p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}