-- Run this in your Supabase SQL editor

create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  sender_email text not null,
  sender_name text not null,
  unsubscribe_link text,
  unsubscribe_mailto text,
  status text default 'active' check (status in ('active', 'unsubscribed', 'pending')),
  email_count integer default 0,
  last_email_date text,
  created_at timestamptz default now(),
  unique(user_id, sender_email)
);

create table if not exists watchers (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  name text not null,
  keywords text[] not null,
  sender_pattern text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists watcher_matches (
  id uuid default gen_random_uuid() primary key,
  watcher_id uuid references watchers(id) on delete cascade not null,
  user_id text not null,
  email_subject text not null,
  sender text not null,
  received_at text not null,
  email_id text not null,
  snippet text,
  created_at timestamptz default now(),
  unique(watcher_id, email_id)
);

-- Indexes for common lookups
create index on subscriptions(user_id);
create index on subscriptions(user_id, status);
create index on watchers(user_id);
create index on watcher_matches(user_id);
create index on watcher_matches(watcher_id);
