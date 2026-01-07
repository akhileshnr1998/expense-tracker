# Coinfess (React + Supabase)

Build a personal expense tracker with authentication, categorization, and analytics (daily/monthly/yearly). This README explains the full implementation: data model, API layer, UI flow, analytics queries, and folder structure.

## Goals
- Track expenses any time and view them in the web app
- Categorize expenses and add descriptions
- Analyze spending by day/month/year with charts
- Secure login/signup with username + password (Supabase handles password hashing)

## Tech Stack
- React + Vite
- Supabase Auth + Postgres
- Charting: Recharts
- Routing: React Router

## Setup
1) Create a Supabase project
2) Copy your keys into `web/.env`
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
3) Install and run
```sh
npm install
npm run dev
```

Supabase schema and policies live in `web/supabase/` as SQL migrations.

## Database Schema (Supabase SQL)
Use the SQL editor in Supabase to create tables and policies.

```sql
-- Categories (per user)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now()
);

-- Expenses
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'INR',
  description text,
  spent_at date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();
```

### Row Level Security (RLS)
```sql
alter table public.categories enable row level security;
alter table public.expenses enable row level security;

create policy "Categories are private"
  on public.categories
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Expenses are private"
  on public.expenses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## Auth (Username + Password)
Supabase Auth already hashes passwords and stores them securely.

- Sign up: email + password (optional username stored in a profile table)
- Login: email + password
- Session persisted via Supabase client

Strong password validation (client-side before sign up):
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number, 1 symbol
- Disallow common passwords (optional list)
- Show inline feedback until all rules pass

Optional profile table if you want a display username:
```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are private"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

## Folder Structure (Suggested)
```
web/
  supabase/
    migrations/
      001_init.sql
  src/
    api/
      auth.js
      expenses.js
      analytics.js
    components/
      charts/
        CategoryPie.jsx
        MonthlyBar.jsx
      forms/
        ExpenseForm.jsx
      layout/
        NavBar.jsx
    pages/
      Login.jsx
      Signup.jsx
      Dashboard.jsx
      Analytics.jsx
    lib/
      supabaseClient.js
      dateRange.js
    styles/
      theme.css
    App.jsx
    main.jsx
```

## Data Flow / Architecture
1) User signs up or logs in via Supabase Auth
2) Session token stored by Supabase client
3) App uses session to read/write `expenses` and `categories`
4) Analytics queries aggregate data by date and category

## API Layer (Supabase JS)
Create thin wrappers in `src/api/` for readability and reuse.

### `src/lib/supabaseClient.js`
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### `src/api/auth.js`
- `signUp(email, password)`
- `signIn(email, password)`
- `signOut()`
- `getSession()`

### `src/api/expenses.js`
- `addExpense({ amount, currency, category_id, description, spent_at })`
- `listExpenses({ from, to })`
- `updateExpense(id, payload)`
- `deleteExpense(id)`
- `listCategories()`
- `createCategory(name, color)`

### `src/api/analytics.js`
- `categoryTotals({ from, to })`
- `monthlyTotals({ from, to })`
- `topExpenses({ from, to, limit })`

Example query for category totals:
```js
const { data } = await supabase
  .from('expenses')
  .select('amount, category:categories(name)')
  .gte('spent_at', from)
  .lte('spent_at', to);
```

## UI Flow
- **Login/Signup**: email + password
- **Dashboard**: add expense form + list for the current day
- **Analytics tab**: charts + filters
  - Category pie chart
  - Month-wise bar chart
  - Top expenses list with daily/weekly/monthly/yearly/custom-range filters

## Analytics Filters
Use date ranges to filter daily/weekly/monthly/yearly plus a custom range selector.

Example utility:
```js
export function getRange(type, now = new Date()) {
  const start = new Date(now);
  if (type === 'daily') start.setDate(now.getDate());
  if (type === 'weekly') start.setDate(now.getDate() - 6);
  if (type === 'monthly') start.setMonth(now.getMonth());
  if (type === 'yearly') start.setFullYear(now.getFullYear());
  return { from: start.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
}
```

Custom range:
- Provide `from` and `to` date pickers
- Query with `.gte('spent_at', from)` and `.lte('spent_at', to)`

## Charts
Recommended: Recharts
- Pie chart: category totals
- Bar chart: month-wise totals

## Implementation Checklist
1) Configure Supabase and add `.env` keys
2) Create tables and RLS policies
3) Build auth pages and session handling
4) Build expense form and list
5) Add categories CRUD
6) Build analytics queries and charts
7) Add filters (daily/weekly/monthly/yearly/custom range)

## Required Pages and Routes
- `/login`
- `/signup`
- `/dashboard` (default after login)
- `/analytics`

## Notes
- Password hashing is handled by Supabase Auth. Do not store plaintext passwords.
- Keep all reads/writes scoped by the authenticated user via RLS.
- Surface API errors in the UI for expense/category actions to avoid silent failures.
- If Supabase relationship joins fail, fetch categories separately and map by `category_id`.
- Include `user_id` on inserts to satisfy RLS policies.
