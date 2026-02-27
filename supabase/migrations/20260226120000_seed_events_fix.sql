-- Seed events if table is empty (fix for migration that may have failed due to invalid ON CONFLICT)
-- Safe to run: only inserts if no events exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.events LIMIT 1) THEN
    INSERT INTO public.events (title, description, start_time, end_time, location, is_public, registration_link)
    VALUES
      ('Rollins Center Block Party', 'Come join us to learn about the PMA and many other Associations and win awesome prizes', '2025-09-12 16:30:00-06:00', NULL, 'Rollins Center', true, NULL),
      ('What is Product Management', 'Our Fall Kickoff!! Are you interested in Business or tech but not sure where to start? Come explore Product Management, eat good food, and meet even better people!', '2025-09-17 16:45:00-06:00', NULL, 'TNRB W310', true, NULL),
      ('Recruiting Bootcamp', 'It might seem intimidating to apply for roles at top companies. Our students have done it over and over again and we are going to teach you exactly how to do it! You aren''t going to want to miss this one.', '2025-10-01 18:00:00-06:00', NULL, 'TNRB 260', true, NULL),
      ('Career Fair', 'Career fairs our overwhelming. Welcome to the PMA''s very own curated Career Fair. We have invited companies from all over Utah County and others with Product roles who are willing to share them with our students! Come learn about different Product roles and companies that you want to be apart of!', '2025-10-15 18:00:00-06:00', NULL, 'TNRB 710', true, NULL),
      ('Product Adjacent Roles and Interview Prep', '90% of Product Managers don''t start their career there, they pivot! Come learn about what those careers look like and how to pivot to your dream spot. Also learn about our new partnership with an AI Interview tool!', '2025-10-29 17:30:00-06:00', NULL, 'TNRB W310', true, NULL),
      ('Vibe Coding for Product Managers', 'https://meet.google.com/zjc-fnbr-scv
Come learn from Avinash Mahalingam with a hands-on lesson on "Vibe Coding" with AI. If you have an app or website idea that you have been dying to build but just don''t know how to code, here is your chance to use AI to completely build it for you!', '2025-11-12 18:00:00-07:00', NULL, 'TNRB W310', true, 'https://meet.google.com/zjc-fnbr-scv'),
      ('PMA Closing Social', 'Come to our end of the semester party! Games, big prizes, and food', '2025-12-03 18:00:00-07:00', NULL, NULL, true, NULL),
      ('Product Trio Social', 'Come and join us for a Product Trio Social THIS WEDNESDAY! Play games and network with fellow students pursuing careers in tech. Hear from top BYU clubs about upcoming events. **Chick-fil-A will be provided**', '2026-01-14 19:00:00-07:00', NULL, 'TNRB 374', true, NULL),
      ('PM Hackathon', '2/9 - 2/13 

Put your skills to the test in this fast-paced competition. Work in teams to identify a problem, build a prototype, and pitch your solution to a panel of judges.

Kickoff will be on Monday (2/9) and presentations will be on Friday (2/13)', '2026-02-09 18:00:00-07:00', '2026-02-13 23:59:59-07:00', 'Via Google Meet (sign-up required)', true, NULL),
      ('AI PM Hackathon Presentations', 'Presentations for the AI Product Hackathon will take place in person on Friday, February 13th, from 2:00 PM to 5:00 PM.   

Teams will present their AI-built MVPs to a panel of industry professional judges at the Kiln. Each team has 7 minutes to present, followed by a 3 minutes Q&A session. Presentation times will be emailed to teams individually after they submit their deliverables', '2026-02-13 14:00:00-07:00', '2026-02-13 17:00:00-07:00', 'The Kiln', true, NULL),
      ('Local Company Visits', 'Go behind the scenes at top local tech companies. Tour their offices, meet their product teams, and see firsthand how product management works in the real world. 

**Sign-up required**', '2026-02-27 12:00:00-07:00', NULL, 'TBA', true, NULL),
      ('Recruiting Workshop', 'Optimize your job search strategy. We''ll cover resume tailoring, LinkedIn networking, and how to navigate the specific hiring cycles of major tech firms.', '2026-03-11 19:00:00-07:00', NULL, 'TBA', true, NULL),
      ('Personal Project Build Night', 'Bring your ideas to life! Join us for a dedicated session to work on your portfolio projects with mentors available to help you troubleshoot and refine your product.', '2026-03-25 19:00:00-07:00', NULL, 'TBA', true, NULL),
      ('Closing Social', 'Celebrate the end of the semester with the PMA community. Join us for food, games, and a chance to connect with peers before finals.', '2026-04-08 19:00:00-06:00', NULL, 'TBA', true, NULL);
  END IF;
END $$;
