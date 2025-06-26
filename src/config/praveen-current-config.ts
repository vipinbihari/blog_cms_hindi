/**
 * Current Active Blog Configuration
 * ---------------------------------
 * PURPOSE
 *   Holds *all* of the real, environment-specific values used by your blog (titles, URLs, counts, etc.).
 *   Anything in here is live data that will be bundled into your site.
 *
 * QUICK START
 *   • Change siteName below to rename your site – most derived values update automatically.
 *   • Update individual sections (branding, theme, layout, navigation…) as required.
 *   • Do *NOT* add types here – extend the interfaces in blog-template.ts instead.
 *
 * TIP
 *   If you rename or add keys, TypeScript will help you by flagging mismatches against the BlogConfig interface.
 */


import type { BlogConfig } from './blog-template';
import { THEME_PRESETS } from './blog-template';

// Current active configuration
const siteName = 'Nivesh Marg';
const siteUrl = `https://niveshmarg.in`;

export const BLOG_CONFIG: BlogConfig = {

  // Site Identity
  site: {
    name: siteName,
    tagline: 'Wealth Guide',
    description: 'Explore Indian and global stock markets through expert research and practical lessons .',
    url: siteUrl,
    author: 'Praveen Yadav', 
    email: `praveenrealchamp@gmail.com`,
    language: 'en',
    locale: 'en-US',
  },

  // Branding & Visual Identity
  branding: {
     logo: {
         light: '/images/blog/logo_praveen.svg',
         dark: '/images/blog/logo_praveen.svg', 
         alt: `${siteName} Logo`,
         width: 180,
         height: 40,
     },
    favicon: '/images/blog/logo_praveen.svg',
    ogImage: '/images/blog/logo_praveen.svg',
    appleTouchIcon: '/images/apple-touch-icon.png',
    placeholderImageService: 'https://placehold.co',
  },
  
  // Theme Configuration
  theme: {
    colors: {
      primary: THEME_PRESETS.blue.primary,
      secondary: THEME_PRESETS.blue.secondary,
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
      subtitle: 'Your trusted path to wealth and market insights',
      ctaButton1: { text: 'Discover Articles', url: '/posts/page/1' },
      ctaButton2: { text: 'About Us', url: '/about' },
      // Hero background image with comprehensive configuration
      heroBackgroundImage: {
        src: '/images/blog/blog-home-image-praveen.jpeg',
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
      { label: 'Market Updates', href: '/categories/market-Updates/page/1' },
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
          { label: 'Market Updates', href: '/categories/market-Updates/page/1' }
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
      url: `https://twitter.com/NiveshMarg`, // Replace YourTwitterHandle
      label: 'Follow us on Twitter',
    },
    {
      platform: 'linkedin',
      url: `https://linkedin.com/company/NiveshMarg`, // Replace YourLinkedInPage
      label: 'Connect on LinkedIn',
    },
    {
      platform: 'facebook',
      url: `https://facebook.com/NiveshMarg`, // Replace YourFacebookPage
      label: 'Like us on Facebook',
    },
    {
      platform: 'youtube',
      url: `https://youtube.com/channel/UCo-Y-9AJr_AK7xn_CZd0vAQ`,
      label: 'Subscribe on YouTube',
    },
    // Add other platforms like Instagram, GitHub, etc. as needed
    // {
    //   platform: 'instagram',
    //   url: https://instagram.com/tradetonicindia,
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
      headline: `Simplifying the Market, <span class='text-primary-600 dark:text-primary-400'>Empowering Your Decisions.</span>`,
      subheadline: `${siteName} is your reliable guide through the complexities of the stock market. We offer expert insights, educational tools, and practical strategies to help you reach your financial goals.`,
      ctaButton: {
        text: 'Explore Our Insights',
        href: '/posts',
        style: 'primary'
      }
    },
    mission: {
      title: 'Our Mission',
      text: `To guide investors of all backgrounds with simplified, insightful market knowledge and practical financial education. We aim to break down the         complexities of the stock market, making financial literacy approachable and helping individuals invest with clarity and confidence.`,
      imageUrl: '/images/blog/mission_blog_praveen.jpeg',
      imageAlt: `Our Mission at ${siteName}`
    },
    whoWeAre: {
      title: 'Who We Are',
      content: `Founded in 2023, ${siteName} is a passionate team of financial analysts, market experts, and educators dedicated to providing high-quality content on Indian and global stock markets. We believe that with the right knowledge and tools, anyone can achieve success in investing.`
    },
    whatWeOffer: {
      title: 'Our Services',
      items: [
        { title: 'Technical Analysis', description: 'In-depth insights into chart patterns, key indicators, and effective trading techniques.', icon: '🧩' },
        { title: 'Fundamental Analysis', description: 'Thorough evaluation of companies, financial health, and sector performance.', icon: '📊' },
        { title: 'Market News & Updates', description: 'Real-time coverage of stock movements, economic trends, and major announcements.', icon: '📢' },
        { title: 'Educational Content', description: 'Step-by-step tutorials, learning materials, and practical resources for all levels of investors.', icon: '💡' }
      ]
    },
    values: {
      title: 'Our Core Values',
      items: [
        {
          name: 'Trustworthy Insights',
          description: 'We focus on delivering well-researched, data-backed content that investors can rely on.',
          icon: '📘'
        },
        {
          name: 'Simplicity',
          description: 'We make finance easy to understand by breaking down complex ideas into clear, simple explanations.',
          icon: '🧠'
        },
        {
          name: 'Transparency',
          description: 'We stay open, unbiased, and honest in every article, analysis, and recommendation we share.',
          icon: '🪞'
        },
        {
          name: 'Investor Empowerment',
          description: 'We aim to build confidence through knowledge, helping investors grow smarter with every post.',
          icon: '🌱'
        }
      ]
    },
    team: {
      title: 'Meet The Team',
      members: [
        {
          name: 'Vipin Bihari',
          role: 'Founder &  Chief Analyst',
          imageUrl: '/images/authors/vipin-bihari.webp',
          bio: 'Vipin Bihari is the voice behind Nivesh Marg, turning market charts into clear, practical tips. He blends hands-on technical analysis with real world technological experiments to help everyday investors feel confident.'
        },
        {
          name: 'Praveen Yadav',
          role: 'Lead Technical Strategist',
          imageUrl: '/images/authors/praveen-yadav.jpeg',
          bio: 'Praveen specializes in technical analysis and chart patterns, helping traders identify market opportunities with precision.'
        }
      ]
    },
    callToAction: {
      headline: 'Take the Next Step Toward Smarter Investing.',
      subheadline: 'Check out our latest insights, join our newsletter, or connect with us directly.',
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
      lastUpdated: 'June 15, 2025',
      sections: [
        {
          title: 'Introduction',
          content: `Welcome to ${siteName}.Your privacy matters to us. This policy outlines how we handle, store, and protect your personal information when you access our site or interact with our services.`
        },
        {
          title: 'Data We Collect',
          content: 'We may collect data like your name, email, and demographic details when you subscribe, comment, or fill out forms. Additionally, we gather technical data such as your IP address, browser type, and the pages you visit to enhance site performance.'
        },
        {
          title: 'How Your Information Helps',
          content: 'The data we collect is used to improve your experience, respond to inquiries, send updates (if you opt in), and better understand usage trends. This helps us deliver relevant insights and improve our platform.'
        },
        {
          title: 'Cookies and Tracking Tools',
          content: 'Our site uses cookies and related tools to monitor user activity. This data helps us improve functionality, personalize content, and optimize user experience. You can manage cookies in your browser settings.'
        },
        {
          title: 'Keeping Your Data Safe',
          content: 'We apply reasonable security measures to protect your data from unauthorized access or misuse. While we strive to secure your information, no online method is completely foolproof.'
        },
        {
          title: 'Third-Party Services',
          content: 'We may partner with third-party services (like analytics tools and email platforms) that help us operate smoothly. These services only access your information when necessary and are bound to maintain confidentiality.'
        },
        {
          title: 'Your Rights & Choices',
          content: 'Depending on your jurisdiction, you may have rights to access, update, or delete your personal data. To make such a request, please contact us using the details below.'
        },
        {
          title: 'Updates to This Policy',
          content: 'We may revise this policy as our practices evolve or to meet legal requirements. Any significant changes will be shared by updating this page with the latest effective date.'
        },
        {
          title: 'Contact Information',
          content: `If you have any questions about this policy or how we handle your data, feel free to reach us at privacy@${siteName.toLowerCase().replace(/\s+/g, '')}.com.`
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'June 15, 2025',
      sections: [
        {
          title: 'Agreement to Terms',
          content:  `By accessing and using ${siteName}, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using this site.`
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
          content: `Certain parts of the website may allow users to post comments, feedback, and other content. By providing user content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any media. User content must not be illegal, defamatory, offensive, or infringing on third-party rights.`
        },
        {
          title: 'Accuracy of Materials',
          content:  `The materials appearing on ${siteName} could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the website are accurate, complete, or current. We may make changes to the materials at any time without notice, and we do not commit to updating the materials.`
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
          content: `These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.`
        },
        {
          title: 'Changes to Terms',
          content: 'We reserve the right to modify these terms at any time without prior notice. By continuing to use the website after such changes, you agree to be bound by the revised terms.'
        }
      ]
    },
    disclaimer: {
      title: 'Disclaimer',
      lastUpdated: 'June 15, 2025',
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
      buttonUrl: 'https://upstox.com/open-demat-account/?f=6PBSXK',
      disclaimer: 'Disclaimer: I am an authorized person (AP2513043591) with Upstox.'
    }
  },

  // Authors Configuration
  authors: {
    'Vipin Bihari': {
      bio: 'Vipin Bihari is the voice behind Nivesh Marg, turning market charts into clear, practical tips. He blends hands-on technical analysis with real world technological experiments to help everyday investors feel confident.',
      avatar: '/images/authors/vipin-bihari.webp',
      twitter: 'bihari_web',
      linkedin: 'bihari_web'
    },
    'Praveen': {
      bio: 'Praveen is a seasoned financial analyst with over 15 years of experience in investment banking and portfolio management.',
      avatar: '/images/authors/praveen.jpg',
      twitter: '@yadav_0073',
      linkedin: 'praveen-yadav-0073'
    }
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
    phone: { name: 'Call Us', number: '+91 7388220266', formattedNumber: '+91 7388220266' },
    address: { name: 'Our Office', location: '211, Bariyamau, Kannauj , Uttar Pradesh, India' },
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