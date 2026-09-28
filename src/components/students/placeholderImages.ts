// TODO: Placeholder Unsplash photos for the For Students page.
// Swap these for real PMA / BYU photos when we have them.
const unsplash = (id: string, width = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`;

export const studentImages = {
  hero: unsplash('1531482615713-2afd69097998', 1200),
  strategy: unsplash('1552664730-d307ca884978'),
  informationSystems: unsplash('1519389950473-47ba0277781c'),
  computerScience: unsplash('1498050108023-c5249f4df085'),
  businessMarketing: unsplash('1460925895917-afdab827c52f'),
  designUX: unsplash('1581291518857-4e27b48ff24e'),
  econStats: unsplash('1551288049-bebda4e38f71'),
  anyMajor: unsplash('1523240795612-9a054b0db644', 1400),
  faq: unsplash('1522071820081-009f0129c71c', 1000),
};
