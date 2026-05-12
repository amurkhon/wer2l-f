export const siteConfig = {
  name: 'Civil Engineering Research Lab',
  shortName: 'CE Lab',
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
    { label: 'Team', href: '/members' },
    { label: 'Works', href: '/works' },
    { label: 'About', href: '/about' },
  ],
};
