-- Seed existing resources data from hardcoded ResourcesPage.tsx

-- Insert categories
INSERT INTO public.resource_categories (slug, title, description, icon, color, display_order) VALUES
  ('ai-tools', 'AI Tools to Build', 'Build projects with cutting-edge AI tools', 'Cpu', 'from-violet-500 to-purple-500', 1),
  ('resume-interview', 'Resume & Interview Guide', 'Build a standout resume and ace your interviews', 'FileText', 'from-blue-500 to-cyan-500', 2),
  ('linkedin', 'LinkedIn Optimization', 'Perfect your LinkedIn profile to attract recruiters', 'Linkedin', 'from-blue-600 to-blue-400', 3),
  ('company-research', 'Company Research', 'Research companies and understand their culture', 'Building2', 'from-purple-500 to-pink-500', 4),
  ('networking', 'Networking & Coffee Chats', 'Connect with industry professionals and build relationships', 'Coffee', 'from-amber-500 to-orange-500', 5),
  ('job-search', 'Job Search Tools', 'Find and apply for PM positions and internships', 'Briefcase', 'from-green-500 to-emerald-500', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert resources for AI Tools category (with subcategories)
-- Low - No Code subcategory
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  'Low - No Code',
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('Lovable.dev', 'Create apps and websites by chatting with AI.', 'https://lovable.dev', '/assets/lovable.png', ARRAY[]::text[], false, 1),
  ('Replit', 'Collaborative coding platform with AI assistance.', 'https://replit.com', '/assets/replit.jpg', ARRAY[]::text[], false, 2),
  ('Base44', 'No-code platform for building modern applications.', 'https://base44.com', '/assets/base44.jpg', ARRAY[]::text[], false, 3),
  ('Firebase Studio', 'Accelerate development with AI agents.', 'https://firebase.studio', '/assets/firebase-studio.jpg', ARRAY[]::text[], false, 4),
  ('Kiro.dev', 'AI-powered no-code platform for building applications.', 'https://kiro.dev', '/assets/kiro.jpg', ARRAY[]::text[], false, 5)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'ai-tools';

-- AI and LLM subcategory
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  'AI and LLM',
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('Azure AI', 'Explore AI solutions with Azure.', 'https://ai.azure.com', '/assets/azure-ai.jpg', ARRAY[]::text[], false, 1),
  ('Hugging Face', 'Collaborate on models, datasets, and applications.', 'https://huggingface.co', '/assets/huggingface.jpg', ARRAY[]::text[], false, 2),
  ('Google Vertex AI', 'Build and deploy AI models on Google Cloud.', 'https://console.cloud.google.com/vertex-ai/studio', '/assets/vertex-ai.jpg', ARRAY[]::text[], false, 3)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'ai-tools';

-- Code With AI subcategory
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  'Code With AI',
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('Cursor', 'AI code editor with a free year subscription for students.', 'https://cursor.com/students', '/assets/cursor.jpg', ARRAY[]::text[], false, 1),
  ('Claude Code', 'AI-powered coding assistant by Anthropic.', 'https://claude.ai', '/assets/claude-code.jpg', ARRAY[]::text[], false, 2)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'ai-tools';

-- Automation subcategory
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  'Automation',
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('Relay.app', 'Create AI agents that work for you with Relay.app.', 'https://www.relay.app', '/assets/relay.jpg', ARRAY[]::text[], false, 1)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'ai-tools';

-- Resume & Interview Guide resources
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  NULL,
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('Jobright.ai', 'AI-powered job search copilot for more interviews with less effort.', 'https://jobright.ai/jobs/resume', '/assets/jobright.jpg', ARRAY[]::text[], false, 1),
  ('PMF Labs', 'Use AI tools to practice and improve your interview skills.', 'https://www.pmflabs.ai', '/assets/pmflabs.jpg', ARRAY['Practice, practice, practice', 'Find common interview questions and write out concise stories', 'Practice at least once a week with a friend or tool'], true, 2),
  ('Leland+', 'Access to recruiting resources created by industry professionals', 'https://start.joinleland.com/campus-race?utm_source=amb-byu-dylan-mattern&utm_campaign=leland_plus_student', '/assets/leland.png', ARRAY[]::text[], true, 3)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'resume-interview';

-- LinkedIn Optimization resources
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  NULL,
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('LinkedIn''s Official Guide', 'Explore LinkedIn''s tips and best practices for optimizing your profile.', 'https://www.linkedin.com/help/linkedin/answer/4443', '/assets/linkedin-guide.jpg', ARRAY['Show your personality - recruiters assess cultural fit', 'Be involved - make posts, share updates, comment to increase visibility', 'Follow people and companies you''re interested in'], false, 1),
  ('HubSpot''s LinkedIn Tips', 'Learn how to optimize your LinkedIn profile with HubSpot''s comprehensive guide.', 'https://blog.hubspot.com/marketing/linkedin-profile-tips', '/assets/hubspot-linkedin.jpg', ARRAY[]::text[], false, 2)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'linkedin';

-- Company Research resources
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  NULL,
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('Glassdoor', 'Read company reviews and learn about their culture.', 'https://www.glassdoor.com', '/assets/glassdoor.jpg', ARRAY['Create a list of your top 10 target companies', 'Explore company websites and news articles', 'Consider locations, reviews, and salary insights', 'Ensure it''s a company or product you''re excited about'], false, 1),
  ('Levels.fyi', 'Get insights on salary levels. These tend to be pretty accurate!', 'https://www.levels.fyi', '/assets/levels-fyi.png', ARRAY[]::text[], false, 2)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'company-research';

-- Networking & Coffee Chats resources
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  NULL,
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('Coffee Chat Guide', 'Learn how to conduct effective coffee chats and informational interviews.', '#', '/assets/coffee-chat.jpg', ARRAY['Connect with BYU alumni and conduct informational interviews', 'Learn about their company, projects, and culture', 'Make it friendly and get to know them personally', 'Ask if they would be willing to provide a referral', 'Get insider tips on how to stand out as an applicant'], false, 1)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'networking';

-- Job Search Tools resources
INSERT INTO public.resources (category_id, subcategory, title, description, url, image_url, tips, is_paid, display_order)
SELECT 
  rc.id,
  NULL,
  r.title,
  r.description,
  r.url,
  r.image_url,
  r.tips,
  r.is_paid,
  r.display_order
FROM public.resource_categories rc
CROSS JOIN (VALUES
  ('NewGrad Jobs', 'Explore entry-level job opportunities for new graduates.', 'https://www.newgrad-jobs.com', '/assets/newgrad-jobs.jpg', ARRAY['Use job search engines and company career pages', 'Set alerts for positions matching your criteria', 'Customize your resume and cover letter for each application', 'Try to get a referral before applying'], false, 1),
  ('Intern List', 'Find internships and entry-level positions across various industries.', 'https://www.intern-list.com', '/assets/intern-list.jpg', ARRAY[]::text[], false, 2),
  ('LinkedIn Jobs', 'Find job openings and connect with recruiters on LinkedIn.', 'https://www.linkedin.com/jobs/', '/assets/linkedin-jobs.jpg', ARRAY[]::text[], false, 3),
  ('APM Season', 'Stay up-to-date on the latest APM programs and internships for aspiring product managers.', 'https://www.apmseason.com', '/assets/apm-season.jpg', ARRAY[]::text[], false, 4),
  ('Jobright', 'Utilize AI to find job matches and streamline your job search process.', 'https://jobright.ai', '/assets/jobright.jpg', ARRAY[]::text[], false, 5)
) AS r(title, description, url, image_url, tips, is_paid, display_order)
WHERE rc.slug = 'job-search';
