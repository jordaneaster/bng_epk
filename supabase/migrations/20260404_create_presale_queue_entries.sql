create extension if not exists pgcrypto;

create table if not exists public.presale_queue_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  queue_item_id text not null,
  queue_item_name text not null,
  source text not null default 'merch-presale-queue',
  subscriber_id bigint,
  interests text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists presale_queue_entries_email_idx
  on public.presale_queue_entries (email);

create index if not exists presale_queue_entries_item_idx
  on public.presale_queue_entries (queue_item_id);

create index if not exists presale_queue_entries_created_at_idx
  on public.presale_queue_entries (created_at desc);

create or replace function public.set_presale_queue_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_presale_queue_entries_updated_at on public.presale_queue_entries;

create trigger set_presale_queue_entries_updated_at
before update on public.presale_queue_entries
for each row
execute function public.set_presale_queue_entries_updated_at();