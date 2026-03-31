drop policy if exists "Users can insert their own feedback" on public.user_feedback;
drop policy if exists "Users can view their own feedback" on public.user_feedback;
drop policy if exists "Admins can view all feedback" on public.user_feedback;
drop policy if exists "Admins can update feedback status" on public.user_feedback;

create policy "Users can insert their own feedback"
  on public.user_feedback for insert
  with check (
    user_id in (
      select id from public.profiles where profiles.user_id = auth.uid()
    )
  );

create policy "Users can view their own feedback"
  on public.user_feedback for select
  using (
    user_id in (
      select id from public.profiles where profiles.user_id = auth.uid()
    )
  );

create policy "Admins can view all feedback"
  on public.user_feedback for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'super-admin')
    )
  );

create policy "Admins can update feedback status"
  on public.user_feedback for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'super-admin')
    )
  );
