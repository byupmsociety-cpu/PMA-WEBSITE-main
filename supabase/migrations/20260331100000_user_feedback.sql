create table public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('bug', 'feature_request', 'general', 'help')),
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'in_progress', 'completed', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_feedback enable row level security;

create policy "Users can insert their own feedback"
  on public.user_feedback for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own feedback"
  on public.user_feedback for select
  using (auth.uid() = user_id);

create policy "Admins can view all feedback"
  on public.user_feedback for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'super-admin')
    )
  );

create policy "Admins can update feedback status"
  on public.user_feedback for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'super-admin')
    )
  );
