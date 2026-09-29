// TODO: Placeholder Unsplash photos for the For Companies page.
// Swap these for real PMA / BYU photos when we have them.
const unsplash = (id: string, width = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`;

export const companyImages = {
  hero: unsplash('1600880292203-757bb62b4baf', 1200),
  aiFoundry: unsplash('1531538606174-0f90ff5dce83'),
  internships: unsplash('1521737604893-d14cc237f11d'),
  careerFair: unsplash('1504384308090-c894fdcc538d'),
  speaker: unsplash('1591115765373-5207764f72e7'),
  onSite: unsplash('1559136555-9303baea8ebd'),
};
