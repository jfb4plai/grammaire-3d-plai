-- supabase/migrations/20260726000000_create_gram3d_tables.sql

create table if not exists public.gram3d_scenes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titre text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gram3d_scenes enable row level security;

create policy "gram3d_scenes_owner_all" on public.gram3d_scenes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.gram3d_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger gram3d_scenes_set_updated_at
  before update on public.gram3d_scenes
  for each row
  execute function public.gram3d_set_updated_at();
