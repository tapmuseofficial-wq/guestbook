create table if not exists guides (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamp with time zone default timezone('utc', now()) not null,
  updated_at  timestamp with time zone default timezone('utc', now()) not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  slug        text not null,
  published   boolean default false not null,
  content     jsonb default '[]'::jsonb not null
);

alter table guides enable row level security;

create policy "owners can do all" on guides
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "published guides are public" on guides
  for select using (published = true);

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger guides_updated_at
  before update on guides
  for each row execute function update_updated_at();
