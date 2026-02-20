-- Seed FAQ items from Airtable CSV export
-- This migration inserts FAQ data into the faq_items table

INSERT INTO public.faq_items (question, answer, sort_order, is_public)
VALUES
  ('Where do I access the Kickoff Recording?', 'https://drive.google.com/file/d/1t7hiuPlC4F4CeeA9uPQVN5K5-X4DupVf/view?usp=sharing', 1, true),
  ('Where do I access the Kickoff Packet?', 'https://docs.google.com/document/d/1nmCo65RX5TYVdI883X89FrRnt4IqsqUUne8-QOgsixI/edit?usp=sharing', 2, true),
  ('What are your requirements regarding attendance on the presentation day?', 'You don''t have to have everyone on the team present for judging, or if no one on your team can attend you can send a pre-recorded video.', 3, true),
  ('How do I find the link to sign-up for a presentation time slot?', 'Sign-up sheet will be available on Tuesday, February 10th.', 4, true),
  ('Would you recommend focusing on a specific subset of students or keeping it broad (all students) for the customer persona?', 'The goal is to decide on a specific problem and customer base, so a specific customer is a good idea for creating a product!', 5, true),
  ('What''s the prompt?', 'You are the founding team of a startup built on the belief that school should not feel like a constant struggle to stay afloat.

Your mission is to design a product that helps students thrive academically and socially at the same time.', 6, true),
  ('What is the maximum number of people for my team?', 'Max of 5 people per team. Solo teams are allowed.', 7, true),
  ('Where do I see the teams?', 'https://docs.google.com/spreadsheets/d/1E6gwdwUTF210AcMFflWT34SS7CTyetkwTrBuu5bug9o/edit?usp=sharing', 8, true)
ON CONFLICT DO NOTHING;
