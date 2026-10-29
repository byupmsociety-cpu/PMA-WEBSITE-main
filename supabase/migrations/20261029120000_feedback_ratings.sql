alter table public.user_feedback alter column user_id drop not null;

alter table public.user_feedback
  add column rating smallint check (rating between 1 and 5),
  add column page text check (char_length(page) <= 200);

alter table public.user_feedback drop constraint user_feedback_type_check;
alter table public.user_feedback
  add constraint user_feedback_type_check check (type in ('bug', 'feature_request', 'general', 'help', 'rating'));

alter table public.user_feedback
  add constraint user_feedback_message_length check (char_length(message) <= 2000);

create policy "Anyone can submit a rating"
  on public.user_feedback for insert
  to anon, authenticated
  with check (
    type = 'rating'
    and rating is not null
    and status = 'new'
    and (
      user_id is null
      or user_id in (select id from public.profiles where profiles.user_id = auth.uid())
    )
  );
