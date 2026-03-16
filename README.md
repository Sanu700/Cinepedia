# 🎬 Cinepedia

> **A full-stack movie review platform.** Discover films, write reviews, rate movies, and interact with other cinephiles — all behind a secure Google authentication flow.

![Cinepedia](https://img.shields.io/badge/Cinepedia-v1.0.0-e74c3c?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00c7b7?style=flat-square&logo=netlify)

---

## 🌐 Live Demo

🎬 **[cineepedia.netlify.app](https://cineepedia.netlify.app/movies)**

---

## ✨ Features

- 🔐 **Google OAuth** — Secure one-click login via Supabase Auth
- ⭐ **Movie Ratings** — Rate films and see real-time aggregated scores
- ✍️ **Reviews** — Write, edit, and delete your own movie reviews
- 🎞️ **Movie Discovery** — Browse and explore film listings
- 📱 **Fully Responsive** — Works seamlessly across desktop and mobile
- 🗄️ **Performant Backend** — Supabase PostgreSQL with optimized queries across 10K+ records

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Google OAuth credentials (configured via Supabase)

### Installation

```bash
git clone https://github.com/Sanu700/Cinepedia.git
cd Cinepedia
npm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Project Structure

```
Cinepedia/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Movie listing, detail, profile pages
│   ├── lib/                # Supabase client setup
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript interfaces
├── public/                 # Static assets
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth) |
| Authentication | Google OAuth via Supabase |
| Deployment | Netlify |

---

## 🗄️ Database Schema

```
users         — id, email, name, avatar, created_at
movies        — id, title, description, genre, poster_url, release_year
reviews       — id, user_id, movie_id, content, rating, created_at
ratings       — id, user_id, movie_id, score (aggregated per movie)
```

---

## 📄 License

MIT — feel free to use and build on this project.
