# Expense Tracker (React + Supabase)

Production-ready expense tracking app with auth, categorization, and analytics.

## First-time setup
1) Create a Supabase project
2) Run the SQL migration in `web/supabase/migrations/001_init.sql` using the Supabase SQL editor
3) Create `web/.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4) Install dependencies and start the app:
```sh
cd web
npm install
npm run dev
```
5) Open the local URL from the terminal and sign up

## Scripts
- `npm run dev` start the dev server
- `npm run build` build for production
- `npm run preview` preview the production build
- `npm run lint` run ESLint

## More details
See `web/plan.md` for full architecture, data model, and API details.
