# BYU Marriott Brand Style Guide (for PMA Website)

Source of truth: https://marriott.byu.edu/brand/ (BYU Marriott School of Business brand guide, which itself builds on the university guide at https://brand.byu.edu). This doc distills that guide into concrete values for use in this codebase. Any front end work on this site must follow it.

If a rule here conflicts with something you find live on marriott.byu.edu, trust the live site and flag the discrepancy — this doc was compiled 2026-09.

## Colors

Primary
| Name  | Hex     | HSL              | Notes |
|-------|---------|------------------|-------|
| Navy  | #002E5D | 210 100% 18%     | The BYU Marriott color. Never treat an accent color as equal or secondary to Navy. |
| White | #FFFFFF | 0 0% 100%        | |

Secondary
| Name       | Hex     | HSL           |
|------------|---------|---------------|
| Royal      | #003DA5 | 218 100% 32%  |
| Slate Gray | #7C878E | 203 7% 52%    |

Accent — light tones (use sparingly, in limited/specific contexts)
| Name        | Hex     |
|-------------|---------|
| Yellow      | #F2CD00 |
| Orange      | #DC8633 |
| Purple      | #9B7793 |
| Green       | #6FA287 |
| Slate Blue  | #5B7F95 |

Accent — medium tones
| Name   | Hex     |
|--------|---------|
| Brown  | #9E652E |
| Red    | #D14124 |
| Purple | #72246C |
| Green  | #44693D |
| Blue   | #006FA8 |

Accent — dark tones
| Name        | Hex     |
|-------------|---------|
| Dark Brown  | #493C38 |
| Maroon      | #51140C |
| Dark Purple | #3D023C |
| Dark Green  | #023508 |
| Dark Blue   | #011C2B |

Rules:
- Navy and white carry the brand. Accent colors support specific, limited communication objectives (e.g. one stat callout, one badge) — they are not a general-purpose palette to pick from freely.
- Don't pair an accent color with Navy in a way that implies the accent has equal or secondary-color status.
- The current codebase's PMA blues (`#215096`, `#4299E1`, `#50A0E0`) are **not** BYU Marriott brand colors and should be replaced by Navy/Royal/Slate Gray. These hexes aren't confined to `src/index.css` — they're also hardcoded directly in `Navigation.tsx`, `HomeHero.tsx`, `AboutSection.tsx`, `DiscoverHero.tsx`, and `DiscoverContent.tsx` (confirmed by grep 2026-09-07). The migration isn't done until all of these are updated, not just the CSS tokens.

### CSS custom-property mapping (for `src/index.css` / shadcn tokens)

The doc's brand categories don't map 1:1 to shadcn's token names — use this explicit mapping so nobody has to guess:

| shadcn/Tailwind token      | Brand color | HSL          |
|-----------------------------|-------------|--------------|
| `--primary` / `--ring`      | Navy        | 210 100% 18% |
| `--primary-foreground`      | White       | 0 0% 100%    |
| `--secondary`               | Royal       | 218 100% 32% |
| `--secondary-foreground`    | White       | 0 0% 100%    |
| `--muted-foreground`        | Slate Gray  | 203 7% 52%   |
| `--accent`                  | Pick exactly one accent hex (see below), not the full 15-color set |
| `--accent-foreground`       | White or Navy, whichever passes contrast against the chosen accent |

Accent-color choice: pick a single accent hex for one-off, limited-use call-outs (e.g. a stat badge or highlight chip) — don't wire the full 15-color accent palette into tokens. If unsure which one, default to Slate Blue (#5B7F95, light tone) since it reads closest to Royal/Navy and won't clash with the primary palette.

## Typography

- **Headline/display font:** Ringside Narrow. Paid — $25 single-user license via BYU Brand & Creative, or bundled free only inside BYU's own Brightspot CMS (not available to us since this is a standalone Vite app).
- **Body font:** Freight Text Pro, via Adobe Fonts subscription. Officially paired with Ringside Narrow.
- **BYU's own sanctioned no-license fallbacks** (for contexts without the paid fonts): Franklin Gothic for headlines, Georgia for body.
- The university brand site (brand.byu.edu) states its own web body font is **IBM Plex Sans**, built into Brightspot at no license cost. The Marriott sub-page separately names "Public Sans" for the same role — the two BYU-owned sources disagree; this is a known inconsistency, not a decision we introduced.
- **Confirmed free web stack for this repo**: headline in **Libre Franklin** (Google Fonts, modeled on Franklin Gothic — BYU's own approved fallback), body/UI in **IBM Plex Sans** (Google Fonts, matches the university's own confirmed web usage). Both are real, actively maintained Google Fonts families (Libre Franklin: weights 100–900; IBM Plex Sans: weights 100–700) — verified 2026-09-07.
- **Note:** Libre Franklin is a normal-width grotesque, not a condensed face — unlike Ringside Narrow. Don't expect visual parity with Ringside Narrow's narrow proportions; treat Libre Franklin as its own headline choice (lean on its 700/800/900 weights for headline presence instead of trying to fake condensed tracking).
- Minimum body size online: ~16–18pt equivalent (the two BYU sources give 16pt and 18pt respectively; treat 18px/1.125rem as the safe floor for body text).
- Never use more than two typefaces in one piece (logos/wordmarks are exempt).
- No official numeric type scale (H1–H6 sizes, letter-spacing, line-height) is published by BYU. Use this scale for implementation consistency:

| Level | Font | Size (rem/px) | Weight |
|-------|------|----------------|--------|
| H1 | Libre Franklin | 2.75rem / 44px (mobile: 2.25rem/36px) | 800 |
| H2 | Libre Franklin | 2rem / 32px | 700 |
| H3 | Libre Franklin | 1.5rem / 24px | 700 |
| H4 | Libre Franklin | 1.25rem / 20px | 600 |
| Body | IBM Plex Sans | 1.125rem / 18px | 400 |
| Small/UI | IBM Plex Sans | 0.875rem / 14px | 400–500 |

## Pattern (background motif)

- The BYU Marriott pattern is a repeating "M" shape tiled at a fixed 30° angle. It is a background/texture element, not an icon or logo — never crop it down to a single M.
- Always rendered in Navy, applied over a solid background color (never over photos, illustrations, or another pattern).
- If using an accent color in the composition, balance it with an equal amount of Navy.
- If cropping the pattern (e.g. to fit a section edge), crop along the angle that follows the M shapes' edges — never straight-cut into the middle of an M.
- No public downloadable asset exists; the source file must be requested from BYU Marriott Marketing (marriott@byu.edu, 801-422-7696) if we want the literal pattern rather than a recreation.

## Logos

- Categories: BYU Marriott Logos, Program Logos, Department Logos, Center Logos, Experiential Learning Program Logos, **Student Association Logos** (this is PMA's category), Ancillary Wordmarks & Abbreviations.
- Primary BYU Marriott logo specs (for reference — PMA should use the Student Association variant, not this one, on our own site):
  - Formats: EPS (RGB/CMYK/PMS), PNG, JPG.
  - Color variants: Full Color (navy + slate gray), Navy (one-color), White (reverse), Black (one-color). No other recoloring is permitted.
  - Minimum size: 1.25in / 250px wide.
  - Clear space: equal to the width of the "B" in BYU, kept free of any other text/graphics/photos.
  - Never distort, stretch, recolor outside the four approved variants, add effects, rearrange elements, or place on low-contrast backgrounds.
- **Student Association Logos** (the relevant category for PMA):
  - Must not mimic, alter, or contain any part of an existing BYU or BYU Marriott logo.
  - Must not include BYU athletic marks (stretch-Y, cougar head).
  - Must not spell out "BYU" in any custom typography.
  - New or updated club logos require submission to byumarriottlogos@byu.edu for approval (~2 week turnaround); any change to an already-approved logo needs re-approval.
  - Whether PMA currently has an approved Student Association logo on file was not verifiable from the public page — confirm with BYU Marriott Marketing before assuming the current PMA mark (the blue "P" mark in `src/index.css`) is pre-approved.

## Voice & content patterns (observed on official BYU Marriott sites)

- Mission-driven, "disciple-leader" framing shows up explicitly in copy, e.g. "develop disciple-leaders who transform strategy into human flourishing" and stories framed around "characteristics of Christlike leadership."
- Headlines skew short and aspirational rather than corporate ("Both-And," "Many destinations, many ways to get there"), while admissions/procedural subpages are plain and utilitarian (no hero, no marketing copy — just clear instructions).
- Nav pattern on marriott.byu.edu: persistent top-priority CTAs `APPLY / DONATE / RECRUIT` (all caps) alongside a full mega-menu.
- Social proof favors concrete stat callouts (big numbers: credit hours, placement %, alumni counts) and student profile cards (name + class year + placement/role) over quoted testimonials.
- Footer conventions: social icons, utility links (site-specific + university-wide), program/department listings, AACSB accreditation seal, copyright line, Privacy Notice / Cookie Preferences.

## Decisions (confirmed 2026-09-07)

1. **Fonts**: use the free approved-equivalent stack — **Libre Franklin** (headlines) + **IBM Plex Sans** (body/UI), both via Google Fonts. Not purchasing Ringside Narrow / Freight Text Pro.
2. **PMA logo**: the current PMA mark is already approved by BYU Marriott under the Student Association Logos category — confirmed directly by the user (2026-09-07), overriding the "unconfirmed" note in the research appendix below. Keep it as-is; only site chrome (colors, type, layout) is being restyled to match BYU Marriott brand.

---

## Appendix: raw research notes (2026-09-07)

Kept verbatim for the record. Everything above this line is the distilled/actionable version; this section is the unfiltered source material two research passes returned, in case something was cut during distillation.

### A. Color palette — https://marriott.byu.edu/brand/identity/color-palette/

Primary: Navy #002E5D (RGB 0/46/93, PMS 648 C, CMYK 100/69/0/56); White #FFFFFF (CMYK 0/0/0/0).

Secondary: Royal #003DA5 (RGB 0/61/165, PMS 293 C, CMYK 100/76/0/9); Slate Gray #7C878E (RGB 124/135/142, PMS 430 C, CMYK 50/34/27/11).

Accent (light tones): Yellow #F2CD00 (RGB 242/205/0, PMS 7405 C, CMYK 7/16/100/0); Orange #DC8633 (RGB 220/134/51, PMS 7413 C, CMYK 9/57/92/0); Purple #9B7793 (RGB 155/119/147, PMS 5145 C, CMYK 25/51/5/20); Green #6FA287 (RGB 111/162/135, PMS 556 C, CMYK 54/8/47/14); Slate Blue #5B7F95 (RGB 91/127/149, PMS 5415 C, CMYK 56/24/11/34).

Accent (medium tones): Brown #9E652E (RGB 158/101/46, PMS 730 C, CMYK 30/60/97/17); Red #D14124 (RGB 209/65/36, PMS 7597 C, CMYK 0/85/95/2); Purple #72246C (RGB 114/36/108, PMS 255 C, CMYK 53/100/0/16); Green #44693D (RGB 68/105/61, PMS 7743 C, CMYK 65/14/80/45); Blue #006FA8 (RGB 0/111/168, PMS 3553 C, CMYK 100/51/13/1).

Accent (dark tones): Dark Brown #493C38 (RGB 73/60/56, PMS 439 C, CMYK 58/63/64/50); Maroon #51140C (RGB 81/20/12, PMS 4102 C, CMYK 40/88/84/63); Dark Purple #3D023C (RGB 61/2/60, PMS 6076 C, CMYK 71/99/39/53); Dark Green #023508 (RGB 2/53/8, PMS 2411 C, CMYK 81/50/91/64); Dark Blue #011C2B (RGB 1/28/43, PMS 296 C, CMYK 90/73/56/69).

Usage guidance (verbatim intent): accent colors should be deployed "in limited ways to support specific communication objectives"; the guide cautions against pairing accent hues with navy "in a way that implies it has equal or secondary status as a university color."

### B. Typography — https://marriott.byu.edu/brand/identity/typography/ and https://brand.byu.edu/type

Marriott page: Headline/display font Ringside Narrow, "versatile and can be used for all typographic hierarchies," $25 single-user license via BYU Brand & Creative; bundled into BYU Marriott's WordPress/Brightspot CMS at no extra cost as "Ringside Narrow SSm" in menus/footers. Body font Freight Text Pro, "reserved specifically for body copy as an alternative to Ringside Narrow," licensed via Adobe Fonts subscription; explicit instruction to "pair Freight Text Pro with Ringside Narrow." Fallbacks for unlicensed contexts (Word/PowerPoint): Franklin Gothic for Ringside Narrow, Georgia for Freight Text Pro. Page also states "Public Sans for the body text" alongside Ringside Narrow SSm for web use. Sizing: print body "9 or 10 points or larger"; online body "equivalent of 18 point minimum size." Combining rule: "Do not use more than two different typefaces in one communication piece" (logos/wordmarks/campaign display fonts exempted). No H1–H6 scale, letter-spacing, or line-height values published. Licensing obtained through BYU Brand & Creative, BYU OIT, or Marriott Marketing/Communications/Technology.

University page (brand.byu.edu/type): confirms Ringside Narrow as "the university's primary typeface for brand applications," used only in logo/wordmark artwork — "You do not need a license to Ringside Narrow to use the logos." Names IBM Plex Sans as the web body font ("built into Brightspot," no license needed) — directly conflicts with the Marriott page's "Public Sans" claim; this discrepancy is unresolved and worth confirming with BYU Marriott Marketing if it ever matters beyond our own free-stack choice. States outside logos, "Any well-designed typeface is acceptable." Sizing: print body "about 10 points or larger"; online body "about 16 points or larger" (differs slightly from Marriott's 18pt figure — we treat 18px as the safe floor). No numeric weight/letter-spacing/line-height specs; only qualitative hierarchy guidance (vary size, weight, capitalization, color; keep to a couple of complementary treatments).

### C. Pattern — https://marriott.byu.edu/brand/identity/pattern/

Pattern is repeating "M" shapes, "always tilted on a 30° angle," built for brand recognition — explicitly not an icon or logo. Color rule: "The pattern is always in navy applied over a background color." Composition rule: "Patterns should only be applied over solid colors — never over other patterns, illustrations, or photographs." Secondary/accent-color palettes are allowed but require "equal amount of navy" in the composition. Cropping rule: "If cropping the pattern, do so at an angle that follows the edge of the M shapes. Do not crop into the M's at right or left." Explicit don't: "Do not crop the pattern down to a single M in order to create an icon." Suggested applications: "various applications, from swag to large-scale environmental displays." No direct download link found; files/approval require contacting BYU Marriott Marketing at (801) 422-7696 or marriott@byu.edu.

### D. Logos — https://marriott.byu.edu/brand/identity/logos/ and sub-pages

Overview page links to: BYU Marriott Logos, Program Logos, Department Logos, Center Logos, Experiential Learning Program Logos, Student Association Logos, Ancillary Wordmarks & Abbreviations. Stated overview guidance: "Please review the usage guidelines for each logo type before downloading and using," plus a note that the Marriott brand "is designed to align with and build upon the university brand" at brand.byu.edu.

Primary BYU Marriott logo (byu-marriott-logos/ sub-page): Formats EPS (RGB, CMYK, PMS variants), PNG, JPG. Color variants: Full Color (navy + slate gray), Navy (single color, PMS 648), White (reverse), Black (one-color). Layouts: Centered or left-aligned. Minimum size: "width is at least 1.25 inches or 250 pixels." Clear space: "equal to the width of the B in BYU," kept free of photos/text/graphics. Don'ts: don't distort/stretch; don't pair with graphic iconography; don't change size relationships between logo components; don't recolor outside full color/navy/white/black; don't alter typography or recreate the logo; don't rearrange elements; don't place on a background lacking adequate contrast. Download-login requirement could not be determined from page text.

Student Association Logos (student-association-logos/ sub-page — the relevant category for PMA): no formal definition of "student association" given; page instead lists approved logos by club/major (e.g., Accounting Society, Finance Society, Marketing Association). File formats not specified on-page; downloadable source formats unclear from displayed web images. Color variants vary per club — e.g., Marriott Inclusion & Belonging Society has Color/Black/White versions; others show 1–5 asset options. Minimum size and clear space rules not addressed for this category. Don'ts specific to student org logos: must not "mimic, alter, or contain an existing BYU or BYU Marriott logo in part or in whole"; must not include BYU athletic marks (stretch Y, cougar head); must not contain the word "BYU" in any font treatment. Approval process: submit desired logo/variations to byumarriottlogos@byu.edu; approval takes roughly two weeks; any update to a previously approved logo requires reapproval. No direct download links/instructions were present for this category.

Gaps flagged by the research pass: conflicting web body-font claims (Public Sans vs IBM Plex Sans); no numeric type scale/letter-spacing/line-height published anywhere; unconfirmed whether PMA already has an approved Student Association logo on file; pattern source files not directly downloadable (must request from Marriott Marketing); primary logo page didn't state whether downloads require a login/portal.

### E. Example-site UI patterns

**strategy-program.vercel.app** (closest visual reference): Header reads "BYU Strategy — Marriott School of Business" with nav items About, Curriculum, Community, Outcomes, Admissions, and an "Apply" CTA; a live info-session banner reading "Jun 11, 2026 · 7:00 PM via Zoom · Meeting ID: 981 4275 6437" sits near the top alongside CTAs "Express your interest →" and "Join now." Hero headline "Strategic Management," subheadline "For the AI era," mission statement "The purpose of the Strategic Management program is to develop disciple-leaders who transform strategy into human flourishing," CTAs "Explore the program" and "Apply →." Section order: Meet our students → The Both-And Program → "A challenging academic core *and* real experience" → One program, many destinations → "And the first job is just the start..." → Many destinations, many ways to get there. Student profile cards used as social proof: Alex Napierski (2027, Startups), Cora Montgomery Pratt (2027, Strategy & Ops Intern at Leland), Carter Boswell (2026, Digital Strategy Consulting Intern at Adobe) — pattern is name + class year + placement, not quoted testimonial text. Heavy stat-callout usage: 64 credit-hour core, 6 experiential programs, 456 alumni in senior roles a decade out ("3 in 5"), 326 founders ("1 in 4"), placement stats by post-grad path (169 MBA, 34 JD, 14 PhD), 100% placement rate, career-track percentage breakdown (Management Consulting 21%, Product Management 12%, Corporate Strategy 7%, IB/PE/VC 6%) in a swipeable comparison table. Course list block (STRAT 401/402/411/412/432), 6-item experiential-program grid (AI Foundry, Cougar Strategy Group, APM Lab, Strategy Research Lab, Sandbox, Crocker Fellowship), footer with Program/Community/Partners columns, copyright "© 2026 BYU Marriott School of Business. All rights reserved." A "blue_grey_rgb" class/variable name surfaced in the markup (suggests a blue-grey palette token); Next.js image-optimization syntax visible confirms Next/Image usage. No hex codes or font-family names surfaced — WebFetch's markdown conversion does not expose CSS.

**marriott.byu.edu/infosys/admissions/mism/**: BYU Marriott horizontal logo; top-priority CTAs APPLY, DONATE, RECRUIT (all-caps, site-wide pattern); full mega-nav (About the School, Programs [Graduate: MAcc/MBA/EMBA/MISM/MPA/EMPA; Undergraduate: 10 majors; Minors], Students, Departments & Centers, Alumni, Recruiting); breadcrumb Information Systems > Admissions > MISM. Body content is utilitarian/procedural, not marketing: "There are two different applications for BYU Marriott's MISM program," followed by plain-text descriptions of integrated vs. non-integrated pathways — no hero imagery, no stat callouts, no testimonials. Sidebar nav for BS IS criteria, MISM tracks, FAQs. Footer: social icons (Facebook, X, LinkedIn, Instagram), utility links (Room Reservations, IT Support, BYU, Church of Jesus Christ, Contact Us), program/minor listings, ROTC links, copyright, Privacy Notice, Cookie Preferences, AACSB accreditation seal. Style hint (inferred/descriptive, not confirmed CSS): "white backgrounds, navy and blue accents, light navigation elements."

**marriott.byu.edu** (homepage): Same APPLY/DONATE/RECRUIT top bar and white/navy horizontal SVG logo as the MISM subpage, confirming this nav pattern is site-wide; same mega-menu with deep sub-items (e.g. Our Story includes Mission, The Marriott Story, N. Eldon Tanner; Centers include Rollins/Whitmore/Ballard-named institutes). Featured content section: three story cards (image + headline + short description + "Read More"), e.g. "Why Am I Not Crushing It?" (Shelley Bushman/Christkindlmarkt pivot story), "Finding Purpose in Service" (Abe Peterson), "Meeting Healthcare Leaders Halfway Across the World" (India/Southeast Asia trip, explicitly invoking "characteristics of Christlike leadership in professionals of different faiths"); section ends with a "More Stories" CTA. Footer identical in structure/content to the MISM subpage footer, copyright reads "© 2026 Brigham Young University. All Rights Reserved." Style hint (descriptive only): "white backgrounds, navy/blue accents, light gray text areas" — no hex codes or font names surfaced; WebFetch does not expose underlying CSS for either official page.

**Research caveat (verbatim):** for both marriott.byu.edu pages, WebFetch's markdown conversion stripped essentially all CSS/typography detail — no font-family names, no hex values, no class names beyond the one incidental "blue_grey_rgb" token on the Vercel app. Layout/grid/card inferences for the official site come from content structure and the tool's own descriptive color notes, not from verified style attributes.
