import type { BlogConfig } from './blog-template';
import { THEME_PRESETS } from './blog-template';

// -----------------------------------------------------------------------------
//  Technology Blog Configuration
// -----------------------------------------------------------------------------
//  NOTE:
//  • This file mirrors the structure of `current-config.ts` but is tailored for
//    a technology-focused publication centred on AI, developer tooling and
//    broader computer-science topics.
//  • It purposefully re-uses any values that stay the same across brands
//    (author, social handles, contact email etc.) so that migrating between the
//    two niches is frictionless.
// -----------------------------------------------------------------------------

const siteName = 'TechTonic';
const siteUrl  = `https://${siteName.toLowerCase().replace(/\s+/g, '')}.apanaresult.com`;

export const BLOG_CONFIG: BlogConfig = {
  // ────────────────────────────────────────────────────────────────────────────
  // Site Identity
  // ────────────────────────────────────────────────────────────────────────────
  site: {
    name: siteName,
    tagline: 'AI & Technology Insights',
    description: 'Practical tutorials, in-depth analysis and opinion pieces on artificial intelligence, developer tooling and the ever-evolving world of technology.',
    url: siteUrl,
    author: 'Vipin Bihari',        // Same author as the stock blog
    email: `contact@${siteName.toLowerCase().replace(/\s+/g, '')}.com`,
    language: 'en',
    locale: 'en-US',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Branding & Visual Identity
  // ────────────────────────────────────────────────────────────────────────────
  branding: {
    logo: {
      light: '/images/tech/logo.svg',       // Provide separate tech logo assets
      dark:  '/images/tech/logo-dark.svg',
      alt: `${siteName} Logo`,
      width: 180,
      height: 40,
    },
    favicon: '/images/tech/logo.svg',
    ogImage: '/images/tech/og-image.png',   // Open-graph image for social cards
    appleTouchIcon: '/images/apple-touch-icon.png',
    placeholderImageService: 'https://placehold.co',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Theme
  // ────────────────────────────────────────────────────────────────────────────
  theme: {
    colors: {
      // Choose a different preset so sites feel distinct
      primary:   THEME_PRESETS.purple.primary,
      secondary: THEME_PRESETS.purple.secondary,
    },
    typography: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSizes: {
        base: '16px',
        headings: {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.75rem',
          h4: '1.5rem',
        },
      },
    },
    spacing: {
      container: '1280px',
      section: '4rem',
    },
    darkMode: true,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Layout
  // ────────────────────────────────────────────────────────────────────────────
  layout: {
    postPerPage: 10,
    featuredPostsCount: 8,
    relatedPostsCount: 4,
    latestPostsOnHomepage: 12,
    breadcrumbSeparator: '›',
    heroConfig: {
      title: `Welcome to ${siteName}`,
      subtitle: 'Stay ahead of the curve with fresh perspectives on AI, programming and dev-ops. Explore guides, opinion pieces and curated resources.',
      ctaButton1: { text: 'Browse Articles', url: '/posts/page/1' },
      ctaButton2: { text: 'About Us',        url: '/about' },
      // Optional image left blank – add when available
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Navigation
  // ────────────────────────────────────────────────────────────────────────────
  navigation: {
    header: [
      { label: 'Home',          href: '/' },
      { label: 'AI & ML',       href: '/categories/ai-ml/page/1' },
      { label: 'Programming',   href: '/categories/programming/page/1' },
      { label: 'Tool Reviews',  href: '/categories/tool-reviews/page/1' },
      // { label: 'About',      href: '/about' },
      // { label: 'Contact',    href: '/contact' },
    ],
    footer: [
      {
        title: 'Categories',
        links: [
          { label: 'AI & ML',      href: '/categories/ai-ml/page/1' },
          { label: 'Programming',  href: '/categories/programming/page/1' },
          { label: 'Tool Reviews', href: '/categories/tool-reviews/page/1' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Contact',  href: '/contact' },
          { label: 'Sitemap',  href: '/sitemap.xml' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy',  href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Disclaimer',       href: '/disclaimer' },
        ],
      },
    ],
  },

  footer: {
    copyright: `2025 ${siteName}. All rights reserved.`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Social
  // ────────────────────────────────────────────────────────────────────────────
  social: [
    // Re-use existing handles so we maintain a single audience across niches
    { platform: 'twitter',  url: 'https://twitter.com/tradetonicindia',    label: 'Follow us on Twitter' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/tradetonicindia', label: 'Connect on LinkedIn' },
    { platform: 'facebook', url: 'https://facebook.com/tradetonicindia',   label: 'Like us on Facebook' },
    { platform: 'youtube',  url: 'https://youtube.com/@tradetonicindia',   label: 'Subscribe on YouTube' },
    { platform: 'github',   url: 'https://github.com/vipinbihari',         label: 'Star us on GitHub' },
  ],

  // ────────────────────────────────────────────────────────────────────────────
  // SEO
  // ────────────────────────────────────────────────────────────────────────────
  seo: {
    defaultTitle: siteName,
    titleTemplate: `%s | ${siteName}`,
    robotsDirectives: ['index,follow'],
    twitterHandle: '@tradetonicindia',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // About Page (brief – extend as needed)
  // ────────────────────────────────────────────────────────────────────────────
  aboutPage: {
    title: `About ${siteName}`,
    description: `${siteName} delivers accessible yet deep technology coverage, demystifying AI and modern software development for enthusiasts and professionals alike.`,
    hero: {
      headline: "Exploring Technology, <span class='text-primary-600 dark:text-primary-400'>Empowering Minds.</span>",
      subheadline: `${siteName} is your companion on the journey through AI breakthroughs, coding best-practices and the tools shaping tomorrow.`,
      ctaButton: { text: 'Explore Articles', href: '/posts', style: 'primary' },
    },
    mission: {
      title: 'Our Mission',
      text: 'To make emerging technology understandable and actionable for creators, developers and decision-makers everywhere.',
      imageUrl: '/images/tech/mission_320.webp',
      imageAlt: `Our Mission at ${siteName}`,
    },
    whoWeAre: {
      title: 'Who We Are',
      content: `Founded in 2025, ${siteName} is a collective of developers, researchers and tech-enthusiasts led by Vipin Bihari.`,
    },
    whatWeOffer: {
      title: 'What We Offer',
      items: [
        { title: 'AI & ML Guides',        description: 'Hands-on tutorials and conceptual explainers.',                   icon: '🤖' },
        { title: 'Tool Reviews',          description: 'In-depth reviews of the latest developer and AI tools.',         icon: '🛠️' },
        { title: 'Programming Tips',      description: 'Best practices across languages, frameworks and paradigms.',     icon: '💻' },
        { title: 'Industry Analysis',     description: 'Commentary on trends shaping the tech landscape.',               icon: '📊' },
      ],
    },
    values: {
      title: 'Our Core Values',
      items: [
        { name: 'Clarity',   description: 'Break down complex topics into digestible insights.',        icon: '🔍' },
        { name: 'Accuracy',  description: 'Back every claim with research and real-world testing.',     icon: '✅' },
        { name: 'Curiosity', description: 'Continuously explore new ideas and foster innovation.',       icon: '🚀' },
        { name: 'Community', description: 'Encourage collaboration and knowledge sharing.',             icon: '🤝' },
      ],
    },
    team: {
      title: 'Meet The Team',
      members: [
        { name: 'Vipin Bihari', role: 'Founder & Chief Editor', imageUrl: '/images/authors/vipin-bihari.webp', bio: 'Software engineer turned tech writer, passionate about AI and developer productivity.' },
      ],
    },
    callToAction: {
      headline: 'Ready to Dive Deeper into Tech?',
      subheadline: 'Join our community, subscribe to the newsletter or start reading now.',
      buttons: [ { text: 'Subscribe', href: '/contact', style: 'secondary' }, { text: 'Latest Posts', href: '/posts', style: 'outline' } ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Legal Pages (concise versions)
  // ────────────────────────────────────────────────────────────────────────────
  legalPages: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'June 18, 2025',
      sections: [
        { title: 'Introduction', content: `Your privacy is important to us at ${siteName}. This policy outlines how we handle your data.` },
        { title: 'Data Collection', content: 'We collect only the information necessary to provide and improve our services, such as analytics and newsletter subscriptions.' },
        { title: 'Your Rights', content: 'You may request access to or deletion of your personal data at any time.' },
      ],
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'June 18, 2025',
      sections: [
        { title: 'Agreement', content: `By using ${siteName} you agree to these terms and applicable laws.` },
        { title: 'Content Usage', content: 'All articles are for informational purposes only and provided "as-is".' },
        { title: 'Limitation of Liability', content: `${siteName} shall not be liable for damages arising from the use of the content.` },
      ],
    },
    disclaimer: {
      title: 'Disclaimer',
      lastUpdated: 'June 18, 2025',
      sections: [
        { title: 'No Professional Advice', content: 'The content on this site does not constitute professional engineering, legal or financial advice.' },
        { title: 'Accuracy of Information', content: 'We strive for accuracy but cannot guarantee completeness or correctness of the information provided.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Contact Page (minimal – expand as required)
  // ────────────────────────────────────────────────────────────────────────────
  contactPage: {
    title: 'Contact Us',
    description: 'Got a question, feedback or partnership idea? Reach out to us using the details below.',
    email: {
      name: 'Email',
      address: `contact@${siteName.toLowerCase().replace(/\s+/g, '')}.com`,
      icon: '✉️',
    },
    phone: {
      name: 'Phone',
      number: '+91 99999 99999',
      formattedNumber: '+91 99999 99999',
      icon: '📞',
    },
    address: {
      name: 'Office',
      location: 'Gurgaon, India',
      icon: '📍',
    },
    businessHours: {
      title: 'Business Hours',
      hours: [
        { days: 'Monday – Friday', hours: '9:00 AM – 6:00 PM IST' },
        { days: 'Saturday – Sunday', hours: 'Closed' },
      ],
    },
    faqs: [
      { question: 'Can I submit guest posts?', answer: 'Yes, please email us with your proposal.' },
      { question: 'Do you offer sponsorships?', answer: 'We offer a range of sponsorship and advertising options – get in touch for details.' },
    ],
  },
};

// Export helpers similar to `current-config.ts` so other modules can import generically
export const CURRENT_CONFIG = BLOG_CONFIG;
export const getCurrentConfig = () => BLOG_CONFIG;
export const getThemeColors = () => ({
  primary: BLOG_CONFIG.theme.colors.primary,
  secondary: BLOG_CONFIG.theme.colors.secondary,
});
