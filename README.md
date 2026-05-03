# Linguistix

Linguistix is a full-stack Language Learning Hub where users can learn 12+ languages through interactive lessons, gamified XP/streak systems, pronunciation practice with speech recognition, a conversation partner, and a global leaderboard.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui (semantic design tokens)
- **Routing:** React Router v6
- **State / Data:** TanStack Query, React Context (Auth)
- **Backend:** Managed Postgres + Auth + Edge Functions
- **PWA:** Installable web app via `manifest.webmanifest`

## Project Structure

```
src/
  pages/           Route-level screens (Index, Auth, Dashboard, Lessons, LessonDetail, Chat, Leaderboard, Install, NotFound)
  components/      Layout, Navbar, Footer, Logo, ProtectedRoute, ui/ (shadcn primitives)
  contexts/        AuthContext — session listener + signOut
  lib/             progress.ts (XP/level/streak helpers + RPC calls), language-content.ts (lesson data),
                   speech.ts (Web Speech API wrappers), mock-data.ts, utils.ts
  integrations/    Auto-generated Postgres client + types
supabase/
  migrations/      SQL: profiles, user_progress, lesson_completions, RLS policies, record_completion()
                   security-definer function and get_leaderboard() RPC
public/
  manifest.webmanifest, icon-192.png, icon-512.png, apple-touch-icon.png
```

## Key Concepts

- **Auth:** email/password + Google OAuth. Session is restored on load and kept in `AuthContext`.
- **Protected routes:** `<ProtectedRoute>` wraps Dashboard, Lessons, LessonDetail, Chat.
- **Progress tracking:** `recordCompletion()` calls a server-side `record_completion` SQL function that
  validates and clamps XP/score to prevent client tampering, then updates streak, weekly XP, level, and gems atomically.
- **Leaderboard:** `get_leaderboard()` RPC exposes only public fields (display name, level, weekly XP).
- **Speech:** `src/lib/speech.ts` uses `SpeechSynthesis` for TTS and `SpeechRecognition` for pronunciation scoring.
- **Design system:** All colors are HSL semantic tokens defined in `src/index.css` and `tailwind.config.ts`.

## Scripts

```
npm install
npm run dev       # local dev server on :8080
npm run build     # production build
npm run preview   # preview the production bundle
```
