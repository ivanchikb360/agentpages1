create table public.pages (
  id uuid default gen_random_uuid() primary key,
  structure jsonb not null,
  requirements jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up row level security
alter table public.pages enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.pages
  for select using (true);

create policy "Enable insert for authenticated users only" on public.pages
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.pages
  for update using (auth.role() = 'authenticated');

-- Create indexes
create index pages_created_at_idx on public.pages (created_at);
create index pages_updated_at_idx on public.pages (updated_at); 