/**
 * Current Active Blog Configuration
 * ---------------------------------
 * PURPOSE
 *   Holds **all** of the real, environment-specific values used by your blog (titles, URLs, counts, etc.).
 *   Anything in here is _live data_ that will be bundled into your site.
 *
 * QUICK START
 *   • Change `siteName` below to rename your site – most derived values update automatically.
 *   • Update individual sections (branding, theme, layout, navigation…) as required.
 *   • Do **NOT** add types here – extend the interfaces in `blog-template.ts` instead.
 *
 * TIP
 *   If you rename or add keys, TypeScript will help you by flagging mismatches against the `BlogConfig` interface.
 */


import type { BlogConfig } from './blog-template';
import { THEME_PRESETS } from './blog-template';

// Current active configuration
const siteName = 'StockSage';
const siteUrl = `https://stocksage.apanaresult.com`;

export const BLOG_CONFIG: BlogConfig = {

  // Site Identity
  site: {
    name: siteName,
    tagline: 'Investment Education',
    description: 'Expert analysis and practical lessons on Indian and global stock markets.',
    url: siteUrl,
    author: 'Vipin Bihari', 
    email: `vipinbiharitiwari25@gmail.com`,
    language: 'en',
    locale: 'en-US',
  },

  // Branding & Visual Identity
  branding: {
     logo: {
         light: '/images/blog/logo.svg',
         dark: '/images/blog/logo.svg', 
         alt: `${siteName} Logo`,
         width: 180,
         height: 40,
     },
    favicon: '/images/blog/logo.svg',
    ogImage: '/images/blog/logo.svg',
    appleTouchIcon: '/images/apple-touch-icon.png',
    placeholderImageService: 'https://placehold.co',
  },
  
  // Theme Configuration
  theme: {
    colors: {
      primary: THEME_PRESETS.green.primary,
      secondary: THEME_PRESETS.green.secondary,
    },
    typography: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
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
    darkMode: true, // Dark mode is enabled by default
  },
  
  // Layout Configuration
  layout: {
    postPerPage: 10, // Primary posts per page for pagination
    featuredPostsCount: 10, // Number of featured posts to fetch for carousels/listings
    relatedPostsCount: 3, // Number of related posts to show on a post page
    latestPostsOnHomepage: 10, // Number of latest posts to show on the homepage carousel
    breadcrumbSeparator: '›',
    heroConfig: {
      title: `Welcome to ${siteName}`,
      subtitle: 'Discover insightful articles, tutorials, and resources. Explore the latest trends and expert opinions.',
      ctaButton1: { text: 'Explore Articles', url: '/posts/page/1' },
      ctaButton2: { text: 'About Us', url: '/about' },
      // Hero background image with comprehensive configuration
      heroBackgroundImage: {
        src: '/images/blog/blog-home-image-1280.webp',
        alt: 'Hero background image',
        width: 1280,
        height: 640
      }
    }
  },
  
  // Navigation Configuration
  navigation: {
    header: [
      { label: 'Home', href: '/' },
      { label: 'Market News', href: '/categories/market-news/page/1' },
      { label: 'Technical Analysis', href: '/categories/technical-analysis/page/1' },
      { label: 'Fundamental Analysis', href: '/categories/fundamental-analysis/page/1' },
    //  { label: 'About', href: '/about' },
    //  { label: 'Contact', href: '/contact' },
    ],
    
    // Footer navigation sections
    footer: [
      {
        title: 'Categories',
        links: [
          { label: 'Technical Analysis', href: '/categories/technical-analysis/page/1' },
          { label: 'Fundamental Analysis', href: '/categories/fundamental-analysis/page/1' },
          { label: 'Market News', href: '/categories/market-news/page/1' }
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Sitemap', href: '/sitemap.xml' },

        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Disclaimer', href: '/disclaimer' },
        ],
      },
    ],
    
    // Social media links for navigation are now sourced from the top-level BLOG_CONFIG.social
  },
  
  // Footer Configuration
  footer: {
    copyright: ` 2025 ${siteName}. All rights reserved.`
  },
  
  // Social Media Links
  social: [
    {
      platform: 'twitter',
      url: `https://twitter.com/tradetonicindia`, // Replace YourTwitterHandle
      label: 'Follow us on Twitter',
    },
    {
      platform: 'linkedin',
      url: `https://linkedin.com/company/tradetonicindia`, // Replace YourLinkedInPage
      label: 'Connect on LinkedIn',
    },
    {
      platform: 'facebook',
      url: `https://facebook.com/tradetonicindia`, // Replace YourFacebookPage
      label: 'Like us on Facebook',
    },
    {
      platform: 'youtube',
      url: `https://youtube.com/@tradetonicindia`,
      label: 'Subscribe on YouTube',
    },
    // Add other platforms like Instagram, GitHub, etc. as needed
    // {
    //   platform: 'instagram',
    //   url: `https://instagram.com/tradetonicindia`,
    //   label: 'Follow us on Instagram',
    // },
  ],
  

  // SEO Configuration
  seo: {
    defaultTitle: siteName,
    titleTemplate: `%s | ${siteName}`,
    robotsDirectives: ['index,follow'],
    twitterHandle: `@${siteName.toLowerCase().replace(/\s+/g, '')}`,
  },
  
  aboutPage: {
    title: `About ${siteName}`,
    description: `Learn more about ${siteName} - your trusted source for expert stock market analysis and investment education.`,
    hero: {
      headline: "Decoding the Market, <span class='text-primary-600 dark:text-primary-400'>Empowering You.</span>",
      subheadline: `${siteName} is your trusted partner in navigating the complexities of the stock market. We provide expert analysis, educational resources, and actionable insights to help you achieve your financial goals.`,
      ctaButton: {
        text: 'Explore Our Insights',
        href: '/posts',
        style: 'primary'
      }
    },
    mission: {
      title: 'Our Mission',
      text: 'To empower investors of all levels with clear, actionable market insights and comprehensive financial education. We strive to demystify the stock market, making financial literacy accessible and helping individuals make informed investment decisions with confidence.',
      imageUrl: '/images/blog/mission_blog_320.webp',
      imageAlt: `Our Mission at ${siteName}`
    },
    whoWeAre: {
      title: 'Who We Are',
      content: `Founded in 2023, ${siteName} is a passionate team of financial analysts, market experts, and educators dedicated to providing high-quality content on Indian and global stock markets. We believe that with the right knowledge and tools, anyone can achieve success in investing.`
    },
    whatWeOffer: {
      title: 'What We Offer',
      items: [
        { title: 'Technical Analysis', description: 'Detailed chart patterns, indicators, and trading strategies.', icon: '📈' },
        { title: 'Fundamental Analysis', description: 'Company valuations, financial metrics, and industry trends.', icon: '📊' },
        { title: 'Market News & Updates', description: 'Timely updates on market movements, economic events, and corporate actions.', icon: '📰' },
        { title: 'Educational Content', description: 'Comprehensive guides, tutorials, and resources for all investor levels.', icon: '🎓' }
      ]
    },
    values: {
      title: 'Our Core Values',
      items: [
        {
          name: 'Accuracy',
          description: 'We prioritize factual, well-researched information, ensuring our analysis is based on reliable data.',
          icon: '🎯'
        },
        {
          name: 'Clarity',
          description: 'We explain complex financial concepts in simple, accessible language for investors of all experience levels.',
          icon: '💡'
        },
        {
          name: 'Integrity',
          description: 'We maintain editorial independence and transparency in all our content and recommendations.',
          icon: '⚖️'
        },
        {
          name: 'Education',
          description: 'We believe in empowering investors through knowledge, providing resources that help build financial literacy.',
          icon: '📚'
        }
      ]
    },
    team: {
      title: 'Meet The Team',
      members: [
        {
          name: 'Vipin Bihari',
          role: 'Founder & Chief Analyst',
          imageUrl: '/images/authors/vipin-bihari.webp',
          bio: 'Vipin Bihari is the voice behind StockSage, turning market charts into clear, practical tips. He blends hands-on technical analysis with real world technological experiments to help everyday investors feel confident.'
        },
        {
          name: 'Praveen Yadav',
          role: 'Lead Technical Strategist',
          imageUrl: 'https://placehold.co/400x400?text=PY',
          bio: 'Praveen specializes in technical analysis and chart patterns, helping traders identify market opportunities with precision.'
        }
      ]
    },
    callToAction: {
      headline: 'Ready to Elevate Your Investment Journey?',
      subheadline: 'Explore our latest analyses, sign up for our newsletter, or get in touch with our team.',
      buttons: [
        { text: 'Contact Us', href: '/contact', style: 'secondary' },
        { text: 'Read Our Blog', href: '/posts', style: 'outline' }
      ]
    }
  },


  
  // Legal Pages Configuration
  legalPages: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'June 7, 2025',
      sections: [
        {
          title: 'Introduction',
          content: `Welcome to ${siteName}. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you visit our website or use our services.`
        },
        {
          title: 'Information We Collect',
          content: 'We may collect personal information such as your name, email address, and demographic information when you subscribe to our newsletter, comment on our articles, or fill out a contact form. We also automatically collect certain technical data when you visit our website, including your IP address, browser type, pages viewed, and time spent on our site.'
        },
        {
          title: 'How We Use Your Information',
          content: 'We use your information to provide and improve our services, respond to comments and inquiries, send periodic emails with financial insights, market updates, and promotional content (if you have subscribed to our newsletter), and analyze usage patterns to enhance user experience.'
        },
        {
          title: 'Cookies and Tracking Technologies',
          content: 'Our website uses cookies and similar tracking technologies to collect information about your browsing activities. These tools help us understand how visitors use our site and allow us to improve functionality, personalize content, and provide a better user experience. You can control cookies through your browser settings.'
        },
        {
          title: 'Data Security',
          content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.'
        },
        {
          title: 'Third-Party Services',
          content: 'We may use third-party services such as analytics providers, commenting systems, and email marketing platforms. These third parties may have access to your personal information only to perform specific tasks on our behalf and are obligated to maintain confidentiality.'
        },
        {
          title: 'Your Rights',
          content: 'Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your information. If you wish to exercise these rights, please contact us using the information provided below.'
        },
        {
          title: 'Changes to Our Privacy Policy',
          content: 'We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page with a new effective date.'
        },
        {
          title: 'Contact Information',
          content: `If you have questions or concerns about our privacy policy or practices, please contact us at privacy@${siteName.toLowerCase().replace(/\s+/g, '')}.com.`
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'June 7, 2025',
      sections: [
        {
          title: 'Agreement to Terms',
          content: `By accessing and using ${siteName}, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using this site.`
        },
        {
          title: 'Use License',
          content: `Permission is granted to temporarily access the materials on ${siteName} for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title. Under this license, you may not: modify or copy the materials; use the materials for any commercial purpose; attempt to decompile or reverse engineer any software contained on the site; remove any copyright or other proprietary notations; or transfer the materials to another person or 'mirror' the materials on any other server.`
        },
        {
          title: 'Investment Disclaimer',
          content: `The content provided on ${siteName} is for informational purposes only and does not constitute financial advice, investment advice, or any other type of advice. We do not recommend that any specific security, portfolio of securities, transaction, or investment strategy is suitable for any specific person. You understand that all investments involve risk, and the past performance of a security, industry, sector, market, financial product, trading strategy, or individual's trading does not guarantee future results or returns.`
        },
        {
          title: 'User Content',
          content: 'Certain parts of the website may allow users to post comments, feedback, and other content. By providing user content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any media. User content must not be illegal, defamatory, offensive, or infringing on third-party rights.'
        },
        {
          title: 'Accuracy of Materials',
          content: `The materials appearing on ${siteName} could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the website are accurate, complete, or current. We may make changes to the materials at any time without notice, and we do not commit to updating the materials.`
        },
        {
          title: 'Links to Third-Party Websites',
          content: `${siteName} may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.`
        },
        {
          title: 'Limitation of Liability',
          content: `In no event shall ${siteName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the.materials on the website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.`
        },
        {
          title: 'Governing Law',
          content: 'These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.'
        },
        {
          title: 'Changes to Terms',
          content: 'We reserve the right to modify these terms at any time without prior notice. By continuing to use the website after such changes, you agree to be bound by the revised terms.'
        }
      ]
    },
    disclaimer: {
      title: 'Disclaimer',
      lastUpdated: 'June 7, 2025',
      sections: [
        {
          title: 'Financial Information Disclaimer',
          content: `The information provided on ${siteName} is for general informational purposes only and should not be considered as financial advice. We are not certified financial planners, registered investment advisors, or licensed brokers. Before making any investment decisions, we strongly recommend consulting with a qualified financial advisor who can provide personalized advice tailored to your specific financial situation, investment goals, and risk tolerance.`
        },
        {
          title: 'No Investment Recommendations',
          content: `Nothing published on ${siteName} should be interpreted as a recommendation to buy, sell, or hold any particular security or investment product. The content we provide reflects our opinions and analyses based on publicly available information, but we make no representations or warranties about the accuracy or completeness of such information.`
        },
        {
          title: 'Investment Risks',
          content: 'Investing in securities and other financial instruments involves substantial risk, including the potential loss of principal. Stock markets are volatile and can fluctuate significantly in response to company, industry, political, regulatory, market, or economic developments. Past performance is not indicative of future results, and no representation is made that any investment will or is likely to achieve profits or losses similar to those shown.'
        },
        {
          title: 'Research and Data',
          content: 'While we strive to provide accurate and up-to-date information, we cannot guarantee that all data presented is free from errors or omissions. Our analyses may use data from third-party sources that we consider reliable, but we do not independently verify all such information and cannot vouch for its accuracy.'
        },
        {
          title: 'Tax Considerations',
          content: `The information provided on ${siteName} does not address specific tax implications of any investments or strategies. Tax laws vary by jurisdiction and are subject to change. We strongly recommend consulting with a qualified tax professional regarding the tax consequences of any investment decisions.`
        },
        {
          title: 'Educational Content',
          content: 'Our content is provided for educational purposes only. While we aim to explain complex financial concepts and market dynamics in an accessible way, readers should verify all information and conduct their own research before making investment decisions.'
        },
        {
          title: 'Affiliate Disclosure',
          content: `${siteName} may receive compensation from affiliate partners for products or services mentioned on our website. These partnerships help support our content creation efforts, but they do not influence our opinions or evaluations. We disclose such relationships when applicable.`
        },
        {
          title: 'No Fiduciary Relationship',
          content: `By using ${siteName}, you acknowledge that no fiduciary relationship is created between you and our company or its contributors. We are not acting as your agent or advisor, and we have no obligation to prioritize your interests over our own.`
        },
        {
          title: 'Updates to Disclaimer',
          content: 'We reserve the right to update or modify this disclaimer at any time without prior notice. By continuing to use our website, you accept and agree to be bound by the current version of this disclaimer.'
        }
      ]
    }
  },

  // UpstoxCTA Component Configuration
  upstoxCTA: {
    enabled: true, // Set to false to disable the component globally
    title: 'Open a Demat Account',
    logo: {
      src: '/images/blog/upstox.jpeg',
      alt: 'Upstox Logo'
    },
    badge: {
      text: 'Recommended',
      showBadge: true
    },
    description: 'Looking to start your investment journey? Open a demat account with Upstox, one of India\'s leading discount brokers with powerful tools, low brokerage, and seamless trading experience.',
    features: [
      '₹0 Account Maintenance Charges*',
      '₹20 Brokerage*',
      'Quick Account Opening',
      'Advanced Charts'
    ],
    ctaSection: {
      title: 'Open Your Account Today',
      buttonText: 'Open an Account',
      buttonUrl: 'https://upstox.com/open-demat-account/?f=4EA75T',
      disclaimer: 'Disclaimer: I am an authorized person (AP2513032321) with Upstox.'
    }
  },

  // Authors Configuration
  authors: {
    'Vipin Bihari': {
      bio: 'Vipin Bihari is the voice behind StockSage, turning market charts into clear, practical tips. He blends hands-on technical analysis with real world technological experiments to help everyday investors feel confident.',
      avatar: '/images/authors/vipin-bihari.webp',
      twitter: 'bihari_web',
      linkedin: 'bihari_web'
    },
   /* 'Praveen': {
      bio: 'Praveen is a seasoned financial analyst with over 15 years of experience in investment banking and portfolio management.',
      avatar: '/images/authors/praveen.jpg',
      twitter: 'praveen',
      linkedin: 'praveen'
    }*/
  },

  // Contact Page Configuration
  contactPage: {
    title: 'Contact Us',
    description: 'Get in touch with our team. We welcome your questions, feedback, and inquiries.',
    faqs: [
      {
        question: `How can I contact ${siteName}?`,
        answer: 'You can reach us via email, phone, or our contact form. All details are listed on this page.'
      },
      {
        question: 'What is your response time?',
        answer: 'We aim to respond to all inquiries within 1-2 business days.'
      },
      {
        question: 'Can I schedule a call?',
        answer: 'Yes, please mention your preferred time in the message and we will get back to you to confirm.'
      }
    ],
    email: { name: 'Email Us', address: `admin@${siteUrl.replace(/https?:\/\//, '')}` },
    phone: { name: 'Call Us', number: '+91 8127411373', formattedNumber: '+91 8127411373' },
    address: { name: 'Our Office', location: '168, Kandhi, Kanpur Dehat, Uttar Pradesh, India' },
    businessHours: {
      title: 'Business Hours',
      hours: [
        { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
        { days: 'Saturday - Sunday', hours: 'Closed' },
      ]
    }
  }
};

export const CURRENT_CONFIG = BLOG_CONFIG;

// Helper function to get current config
export const getCurrentConfig = () => BLOG_CONFIG;

// Helper function to get theme colors for Tailwind
export const getThemeColors = () => ({
  primary: BLOG_CONFIG.theme.colors.primary,
  secondary: BLOG_CONFIG.theme.colors.secondary,
}); 