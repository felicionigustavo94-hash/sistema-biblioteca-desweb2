import fallbackData from '../data/fallbackData.json';

const STORAGE_KEYS = {
  USER: 'biblioteca_user',
  TOKEN: 'biblioteca_token',
  LOANS: 'biblioteca_local_loans',
  FAVORITES: 'biblioteca_local_favorites',
  PROGRESS: 'biblioteca_local_progress',
  USERS: 'biblioteca_local_users',
  BOOKS: 'biblioteca_local_books'
};

// Obter usuários cadastrados localmente
export function getLocalUsers() {
  const saved = localStorage.getItem(STORAGE_KEYS.USERS);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [
    { id: 1, name: 'Administrador da Biblioteca', email: 'admin@biblioteca.com', role: 'admin' },
    { id: 2, name: 'João Leitor', email: 'leitor@biblioteca.com', role: 'leitor' },
    { id: 3, name: 'Maria Silva', email: 'maria@email.com', role: 'leitor' }
  ];
}

// Obter acervo físico
export function getLocalBooks() {
  const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return fallbackData.physicalBooks || [];
}

// Obter empréstimos locais
export function getLocalLoans() {
  const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [
    {
      id: 1,
      book_id: 1,
      user_id: 2,
      loan_date: '2026-09-15',
      due_date: '2026-09-29',
      status: 'ativo',
      book: fallbackData.physicalBooks[0] || { title: 'Dom Casmurro', author: 'Machado de Assis' },
      user: { id: 2, name: 'João Leitor', email: 'leitor@biblioteca.com' }
    }
  ];
}

// Obter favoritos locais
export function getLocalFavorites(userId) {
  const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  const allFavs = saved ? JSON.parse(saved) : [];
  if (!userId) return allFavs;
  return allFavs.filter(f => f.user_id === userId);
}

// Obter leituras em andamento locais
export function getLocalProgress(userId) {
  const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const allProg = saved ? JSON.parse(saved) : [];
  if (!userId) return allProg;
  return allProg.filter(p => p.user_id === userId);
}

// Salvar progresso de leitura
export function saveLocalProgress(userId, digitalBookId, chapterIndex, chapterTitle, percentage, location) {
  const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  let allProg = saved ? JSON.parse(saved) : [];
  
  const book = fallbackData.digitalBooks.find(b => b.id === digitalBookId);
  const existingIdx = allProg.findIndex(p => p.user_id === userId && p.digital_book_id === digitalBookId);

  const item = {
    id: Date.now(),
    user_id: userId,
    digital_book_id: digitalBookId,
    chapter_index: chapterIndex,
    chapter_title: chapterTitle,
    percentage: percentage,
    location: location,
    updated_at: new Date().toISOString(),
    digital_book: book
  };

  if (existingIdx >= 0) {
    allProg[existingIdx] = { ...allProg[existingIdx], ...item };
  } else {
    allProg.unshift(item);
  }

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProg));
  return item;
}

// Alternar favorito local
export function toggleLocalFavorite(userId, digitalBookId) {
  const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  let allFavs = saved ? JSON.parse(saved) : [];
  const book = fallbackData.digitalBooks.find(b => b.id === digitalBookId);
  
  const existingIdx = allFavs.findIndex(f => f.user_id === userId && f.digital_book_id === digitalBookId);
  if (existingIdx >= 0) {
    allFavs.splice(existingIdx, 1);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(allFavs));
    return { is_favorite: false, message: 'Removido dos favoritos.' };
  } else {
    allFavs.unshift({
      id: Date.now(),
      user_id: userId,
      digital_book_id: digitalBookId,
      digital_book: book
    });
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(allFavs));
    return { is_favorite: true, message: 'Adicionado aos favoritos!' };
  }
}

// Filtrar catálogo digital local
export function queryLocalDigitalBooks({ search = '', language = 'all', page = 1, perPage = 24 }) {
  let list = [...(fallbackData.digitalBooks || [])];

  if (language && language !== 'all') {
    list = list.filter(b => b.language === language);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(b => 
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q)) ||
      (b.authors && b.authors.toLowerCase().includes(q)) ||
      (b.subjects_json && b.subjects_json.toLowerCase().includes(q))
    );
  }

  const total = list.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(1, page), lastPage);
  const start = (currentPage - 1) * perPage;
  const data = list.slice(start, start + perPage);

  return {
    data,
    total,
    current_page: currentPage,
    last_page: lastPage,
    per_page: perPage
  };
}

// Estatísticas do Catálogo
export function getLocalDigitalStats() {
  const all = fallbackData.digitalBooks || [];
  return {
    total: all.length,
    portugues: all.filter(b => b.language === 'pt').length,
    ingles: all.filter(b => b.language === 'en').length,
    com_leitura: all.length
  };
}

// Autenticação local em fallback
export function localLogin(email, password) {
  const users = getLocalUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!found) {
    throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
  }
  const token = 'local_fallback_token_' + found.id;
  return { user: found, token };
}

export function localRegister(name, email, password, role = 'leitor') {
  let users = getLocalUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    throw new Error('Este endereço de e-mail já está cadastrado.');
  }
  const newUser = {
    id: Date.now(),
    name,
    email,
    role
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  const token = 'local_fallback_token_' + newUser.id;
  return { user: newUser, token };
}
