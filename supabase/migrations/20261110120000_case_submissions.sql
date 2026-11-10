create table public.case_submissions (
  id uuid primary key default gen_random_uuid(),
  team_name text not null check (char_length(team_name) between 1 and 100),
  members text not null check (char_length(members) between 1 and 500),
  problem text not null check (char_length(problem) between 1 and 2000),
  work_url text not null check (char_length(work_url) <= 500 and work_url ~* '^https?://'),
  track text not null check (track in ('chat', 'prototype', 'pull_request')),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.case_submissions enable row level security;

create policy "Anyone can submit a case entry"
  on public.case_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view case submissions"
  on public.case_submissions for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'super-admin')
    )
  );
