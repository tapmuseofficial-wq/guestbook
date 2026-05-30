create table subscriptions (
  id                    uuid        default gen_random_uuid() primary key,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null,
  user_id               uuid        references auth.users(id) on delete cascade not null unique,
  stripe_customer_id    text        unique,
  stripe_subscription_id text       unique,
  plan                  text        not null default 'free',
  status                text        not null default 'active',
  current_period_end    timestamptz
);

alter table subscriptions enable row level security;

create policy "Users can read own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at_column();
