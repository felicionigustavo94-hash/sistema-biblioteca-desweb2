#  Sistema de Gestão de Biblioteca

Projeto semestral desenvolvido para a disciplina de **Desenvolvimento Web II** do Professor Thomas Marquez.

Nomes:

Gustavo Felicioni - Integração com Docker, Frontend, Hospedagem, Banco de Dados e APIs. 
Matheus Bedani - Backend, Lógica Geral, Debugging, Segurança e Funções Web.

Trata-se de um sistema completo de gerenciamento de acervo bibliográfico, usuários e empréstimos, estruturado com front-end desacoplado em **React (SPA)**, API RESTful em **Laravel 11**, banco de dados **PostgreSQL** e integração externa com as APIs **Google Books** e **Open Library**.

---

##  Tecnologias Utilizadas

### Front-end
- **React (Vite)**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**
- **Lucide Icons**
- **Hospedagem:** [Vercel](https://vercel.com)

### Back-end
- **PHP 8.3**
- **Laravel 11** (API RESTful)
- **Laravel Sanctum** (Autenticação e Sessão)
- **PHPUnit** (Testes automatizados)
- **Hospedagem:** [Render](https://render.com) (Container Docker)

### Banco de Dados & Storage
- **PostgreSQL 16** (Hospedagem: [Supabase](https://supabase.com))
- **Laravel Storage** (Armazenamento local/nuvem para capas de livros e anexos)

---

##  Modelagem de Dados (DER)

```mermaid
erDiagram
    USERS ||--o{ LOANS : realiza
    BOOKS ||--o{ LOANS : pertence
    CATEGORIES ||--o{ BOOKS : classifica

    USERS {
        bigint id PK
        string name
        string email UK
        string password
        string role "admin | leitor"
        string phone
        timestamps created_at
    }

    CATEGORIES {
        bigint id PK
        string name
        text description
    }

    BOOKS {
        bigint id PK
        bigint category_id FK
        string title
        string author
        string genre
        string isbn UK
        string cover_path
        text synopsis
        int total_copies
        int available_copies
        string published_year
        string publisher
        timestamps created_at
    }

    LOANS {
        bigint id PK
        bigint user_id FK
        bigint book_id FK
        date loan_date
        date due_date
        date return_date
        string status "ativo | devolvido | atrasado"
        text notes
        timestamps created_at
    }
