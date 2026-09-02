# 📚 Sistema de Gestão de Biblioteca kkkkkk
> Trabalho Semestral da disciplina de **Desenvolvimento Web II** (Fatec).

Sistema web simples, completo e funcional de gestão de biblioteca desenvolvido com **Laravel (Back-end API)**, **React (Front-end SPA)** e **PostgreSQL (Supabase / Local)**.

---

## 🎯 O que o sistema faz?

1. **Acervo de Livros:**
   - Listagem com visualização de capas, autor, gênero e estoque disponível.
   - Busca em tempo real por título, autor ou ISBN.
2. **Cadastro com Busca Mágica por ISBN:**
   - Digite o código ISBN e clique em **"Buscar Dados"**: o sistema consulta a **Google Books API / Open Library API** e preenche título, autor, gênero, sinopse e capa automaticamente!
3. **Controle de Empréstimos:**
   - Realização de empréstimo (diminui 1 exemplar do estoque).
   - Devolução de livro (restaura 1 exemplar no estoque).
   - Renovação de prazo (+7 dias).
   - Alerta visual para empréstimos em atraso.
4. **Autenticação & Perfis:**
   - Login e cadastro de usuários com perfis **Admin** e **Leitor**.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React (Vite) + Tailwind CSS + Axios + Lucide Icons
- **Back-end:** PHP 8.3 + Laravel 11 (API RESTful + Sanctum)
- **Banco de Dados:** PostgreSQL (Supabase em nuvem / Local)
- **Containerização:** Docker & Docker Compose
- **Deploy:** Vercel (Front-end) + Render (Back-end)

---

## 🚀 Como Rodar Localmente no seu Computador

### Método 1: Rodando em 2 Terminais (Mais simples e direto para desenvolvimento)

#### **1. Iniciar o Back-end (Laravel):**
Abra o primeiro terminal na pasta do projeto:
```bash
cd backend
php artisan migrate --seed
php artisan serve
```
> O back-end estará rodando em: `http://127.0.0.1:8000`

#### **2. Iniciar o Front-end (React):**
Abra um segundo terminal na pasta do projeto:
```bash
cd frontend
npm run dev
```
> O front-end estará rodando em: `http://localhost:5173`

Abra `http://localhost:5173` no seu navegador para ver o sistema funcionando!

---

### Método 2: Rodando com Docker Compose (Comando único)

Se você tiver o Docker Desktop instalado:
```bash
docker compose up -d --build
```
Para popular o banco com os dados de teste:
```bash
docker compose exec backend php artisan migrate:fresh --seed
```

---

## 🔑 Usuários de Teste para Apresentação

O sistema já vem com contas pré-cadastradas para demonstrar na aula:

| Perfil | E-mail | Senha | O que pode fazer? |
| :--- | :--- | :--- | :--- |
| **👑 Administrador** | `admin@biblioteca.com` | `password123` | Cadastrar, excluir livros e gerenciar todos os empréstimos |
| **📖 Leitor / Aluno** | `leitor@biblioteca.com` | `password123` | Ver acervo e solicitar empréstimos de livros |

---

## ☁️ Como Configurar na Nuvem (Deploy)

### 1. Banco de Dados Gratuito no Supabase:
1. Crie uma conta em [supabase.com](https://supabase.com) e crie um **Novo Projeto**.
2. Vá em **Project Settings > Database** e pegue os dados de conexão (`Host`, `Database`, `User`, `Password`, `Port`).
3. No arquivo `backend/.env`, configure as variáveis:
```env
DB_CONNECTION=pgsql
DB_HOST=seu-host.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=sua-senha-definida
```
4. Rode `php artisan migrate --seed` para criar as tabelas no Supabase!

### 2. Deploy do Back-end no Render:
1. No [render.com](https://render.com), crie um **New Web Service** conectado ao seu repositório GitHub.
2. Selecione **Docker** (Root Directory: `./backend`).
3. Adicione as variáveis de ambiente com os dados do seu Supabase.

### 3. Deploy do Front-end na Vercel:
1. No [vercel.com](https://vercel.com), importe seu repositório do GitHub.
2. Selecione a pasta raiz como `frontend`.
3. Defina a variável de ambiente:
   - `VITE_API_URL`: `https://seu-backend-no-render.onrender.com/api`
4. Clique em **Deploy**.

---

## 🧪 Rodando os Testes Automatizados

Para rodar os testes unitários do Laravel:
```bash
cd backend
php artisan test
```
