# Coinfess (React + Supabase)

Production-ready expense tracking app with auth, categorization, and analytics.

## First-time setup
1) Create a Supabase project
2) Run the SQL migration in `web/supabase/migrations/001_init.sql` using the Supabase SQL editor
3) Create `web/.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://coinfess.vercel.app
```
4) In Supabase, set Authentication → URL Configuration:
   - Site URL: your Vercel URL
   - Redirect URLs allow-list: `http://localhost:5174` and your Vercel URL
5) Install dependencies and start the app:
```sh
cd web
npm install
npm run dev
```
6) Open the local URL from the terminal and sign up

## Scripts
- `npm run dev` start the dev server
- `npm run build` build for production
- `npm run preview` preview the production build
- `npm run lint` run ESLint

## More details
See `web/plan.md` for full architecture, data model, and API details.
