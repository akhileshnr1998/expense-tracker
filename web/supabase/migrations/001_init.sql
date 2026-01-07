create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
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

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.expenses enable row level security;
alter table public.profiles enable row level security;

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

create policy "Profiles are private"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
