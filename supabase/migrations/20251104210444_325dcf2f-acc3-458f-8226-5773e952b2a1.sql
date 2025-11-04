-- Add the new specific badges for PMA
INSERT INTO badges (name, description, icon, badge_type, points_required) VALUES
  ('Exploring PM Complete', 'Completed all steps in the Exploring PM section', '🎓', 'milestone', 0),
  ('Starting PM Complete', 'Completed all steps in the Starting PM Path section', '🚀', 'milestone', 0),
  ('Recruiting PM Complete', 'Completed all steps in the Recruiting for PM section', '💼', 'milestone', 0),
  ('PMA Club Member', 'Joined PMA through clubs.byu.edu', '🎯', 'special', 0),
  ('Event Attendee', 'Attended a PMA event', '📅', 'achievement', 0),
  ('Mock Interview Pro', 'Completed a mock interview', '🎤', 'achievement', 0),
  ('Role Secured', 'Landed a full-time or internship role', '🌟', 'achievement', 0),
  ('Success Shared', 'Shared your success story with PMA leadership', '✨', 'achievement', 0),
  ('PMA Champion', 'Earned all badges - eligible for PMA merch!', '🏆', 'special', 0)
ON CONFLICT (name) DO NOTHING;