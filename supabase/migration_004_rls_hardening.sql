-- Drop all existing policies on guides (handles any naming from initial setup)
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where tablename = 'guides' and schemaname = 'public'
  loop
    execute format('drop policy %I on guides', pol.policyname);
  end loop;
end $$;

-- guides: public read for published guides (guest page — no auth required)
create policy "Public read published guides"
  on guides for select
  using (published = true);

-- guides: owners can read all their own guides (including drafts)
create policy "Owners read own guides"
  on guides for select
  using (auth.uid() = user_id);

-- guides: owners can insert their own guides only
create policy "Owners insert own guides"
  on guides for insert
  with check (auth.uid() = user_id);

-- guides: owners can update their own guides only
create policy "Owners update own guides"
  on guides for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- guides: owners can delete their own guides only
create policy "Owners delete own guides"
  on guides for delete
  using (auth.uid() = user_id);


-- subscriptions: drop and recreate with explicit no-write policies
-- (service role bypasses RLS — only the webhook can write)
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where tablename = 'subscriptions' and schemaname = 'public'
  loop
    execute format('drop policy %I on subscriptions', pol.policyname);
  end loop;
end $$;

create policy "Owners read own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for subscriptions:
-- regular users cannot modify subscription records at all.
-- The Stripe webhook uses the service role key which bypasses RLS.
