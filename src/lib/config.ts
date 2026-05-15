export const siteConfig = {
  name: 'Water Environment & Resource Recovery Lab',
  shortName: 'WER²L',
  tagline: 'Advancing Civil Engineering Through Research and Innovation',
  description:
    'A university research laboratory dedicated to advancing civil engineering through cutting-edge research in structural, geotechnical, transportation, hydraulic, and materials engineering.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4006',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'lab@university.edu',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Lab Goal', href: '/lab-goal' },
    { label: 'Highlights', href: '/highlights' },
    { label: 'Team', href: '/members' },
    { label: 'Works', href: '/works' },
    { label: 'Guidelines', href: '/guidelines' },
    { label: 'About', href: '/about' },
  ],
};
