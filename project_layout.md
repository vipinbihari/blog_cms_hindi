# Project Layout

This document outlines the directory structure and purpose of each file in the blog CMS project.

## Root Directory

### `.github/`

Contains GitHub-specific files, primarily for defining automated workflows.

-   `workflows/`: Holds YAML files that define GitHub Actions workflows (e.g., for CI/CD, automated checks, deployment).

### `public/`

This directory contains static assets that are copied directly to the root of the build output directory (`dist/`) without processing. Astro will not transform or bundle these files.

-   `.nojekyll`: An empty file that tells GitHub Pages not to run the site through Jekyll. This is important for sites built with other static site generators like Astro.
-   `images/`: Contains static image assets that are directly served.
            -   `authors/`: Stores author profile pictures.
                -   `vipin-bihari.webp`: Profile picture for Vipin Bihari.
            -   `blog/`: Holds general blog-related static images, often fallbacks or pre-generated responsive versions not part of the primary content pipeline.
                -   `blog-home-image-1280.png`: PNG version of a blog home image (1280px wide).
                -   `blog-home-image-1280.webp`: WebP version of a blog home image (1280px wide).
                -   `blog-home-image-320.png`: PNG version (320px wide).
                -   `blog-home-image-320.webp`: WebP version (320px wide).
                -   `blog-home-image-640.png`: PNG version (640px wide).
                -   `blog-home-image-640.webp`: WebP version (640px wide).
                -   `blog-home-image-960.png`: PNG version (960px wide).
                -   `blog-home-image-960.webp`: WebP version (960px wide).
                -   `blog-home-image.png`: Original, possibly unoptimized, blog home image.
            -   `optimized/`: Contains images processed by `src/scripts/optimizeImages.js`, typically responsive versions (different sizes, WebP format) of images used in blog posts. Each subdirectory corresponds to a post slug.
                -   `dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025/`: Optimized images for the post with this slug.
                -   `dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025/`: Optimized images for the post with this slug.
                -   *(... and 17 other similar post-specific directories containing optimized image assets)*
            -   `uploads/`: Contains directories, seemingly mirroring `optimized/`. The exact purpose or difference from `optimized/` needs clarification; possibly for original uploads before optimization, a staging area, or a legacy structure. Each subdirectory corresponds to a post slug.
                -   `dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025/`: Uploaded images related to the post with this slug.
                -   `dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025/`: Uploaded images related to the post with this slug.
                -   *(... and 17 other similar post-specific directories)*

### `src/`

This is the heart of the Astro application, containing all the source code that gets processed and bundled to build the website.

-   `env.d.ts`: TypeScript declaration file for environment variables. It helps with type checking environment variables used within the Astro project (e.g., `import.meta.env`).
-   `components/`: Contains reusable UI components written as Astro components (`.astro`), or React components (`.jsx`, `.tsx`) for client-side interactivity.
    -   `AuthorBio.astro`: Astro component to display author biography information, typically on post pages or an author's page.
    -   `FormattedDate.astro`: Astro component for formatting and displaying dates in a consistent style across the site.
    -   `NewsletterSignup.astro`: Astro component for a newsletter signup form.
    -   `PageNavigation.astro`: Astro component to render 'Next Post' / 'Previous Post' navigation links.
    -   `PostCard.astro`: Astro component used to display a summary or preview of a blog post, often used on listing pages (e.g., homepage, category pages).
    -   `Quiz.jsx`: React component for embedding interactive quizzes within content.
    -   `ReadingProgress.jsx`: React component to display a visual reading progress bar, typically at the top of blog posts.
    -   `RelatedPosts.astro`: Astro component to display a list of related blog posts, usually at the end of a post.
    -   `ResponsiveImage.astro`: Astro component for handling responsive images, likely integrating with Astro's image optimization or custom image solutions to serve appropriately sized images.
    -   `ShareButtons.jsx`: React component providing social media sharing buttons for posts.
    -   `TableOfContents.jsx`: React component to automatically generate and display a table of contents for a page, typically for long articles.
    -   `ThemeToggle.jsx`: React component to allow users to switch between light and dark themes.
    -   `SearchBar.jsx`: React component that renders the responsive site-wide search bar (full input on large screens, magnifier icon with overlay input on smaller screens). It fetches the static JSON index and filters results client-side.
    -   `layout/`: Subdirectory for components that are part of the main page layouts.
        -   `ConfigurableFooter.astro`: Astro component for the site footer, pulls social links from the top-level `BLOG_CONFIG.social` array (not from `navigation.social`).
        -   `ConfigurableHeader.astro`: Astro component for the site header, including navigation, logo, and possibly theme toggle, configured via blog settings.
    -   `ui/`: Subdirectory for general-purpose, often smaller, UI primitive components.
        -   `Logo.astro`: Astro component to display the site logo, potentially with configurable text or image source.
        -   `Navigation.astro`: Astro component to render the main site navigation links, configured via `BLOG_CONFIG`.
        -   `SocialLinks.astro`: Astro component to display social media icons/links, configured via `BLOG_CONFIG`.
-   `config/`: Holds configuration files for the blog template, defining its structure, appearance, and behavior.
    -   `blog-template.ts`: Defines the TypeScript interfaces and types for the overall blog configuration (`BlogConfig`, `SiteConfig`, `LayoutConfig`, `NavigationConfig`, etc.). This file acts as a schema for the configuration, ensuring type safety and providing autocompletion when editing `current-config.ts`.
    -   `current-config.ts`: The active configuration file for the blog. It exports the `BLOG_CONFIG` object, which implements the interfaces defined in `blog-template.ts`. This is where the site name, URLs, navigation links, social media handles, layout settings (like hero section), and other customizable aspects of the blog are set.
    -   `templates/`: Contains template configurations or presets for different blog niches or styles. These can be copied or adapted to create new `current-config.ts` files.
        -   `lifestyle-blog.ts`: Currently an empty placeholder template for a lifestyle blog configuration (exports a `BlogConfig` object once populated).
        -   `technology-blog.ts`: A template configuration file (likely exporting a `BlogConfig` object) pre-filled with settings suitable for a technology-focused blog.
-   `content/`: Manages content using Astro's content collections feature. This is where Markdown (`.md`, `.mdx`) files for blog posts, author profiles, or other structured content are stored.
    -   `config.ts`: Defines the schemas for the content collections. For example, it specifies the expected frontmatter fields (like `title`, `pubDate`, `author`, `tags`, `image`) for blog posts, ensuring data consistency and providing type safety when querying content.
    -   `posts/`: Contains the individual blog post files, typically in Markdown (`.md` or `.mdx`) format. Each file represents a blog post and includes frontmatter metadata (title, date, author, tags, image, etc.) and the main content of the post.
        -   `dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025.mdx`: Example blog post about market trends.
        -   `dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025.mdx`: Example blog post about market rally.
        -   *(... and 17 other similar .mdx files representing individual blog posts on various topics, primarily finance and stock market analysis, and a series on learning investment.)*
-   `data/`: Intended for storing other data files (e.g., JSON, YAML) that might be used to populate parts of the site. This directory is currently empty, suggesting its use is for future expansion or was part of a previous structure.
-   `layouts/`: Defines the overall page structure or templates. Astro pages in `src/pages/` use these layouts to wrap their content, providing consistent site-wide elements like headers, footers, and navigation.
    -   `BaseLayout.astro`: A fundamental layout component that likely includes the `<html>`, `<head>`, and `<body>` tags, global stylesheets, scripts, and slots for page-specific content. It might also integrate the `ConfigurableHeader` and `ConfigurableFooter` components.
    -   `PostLayout.astro`: A layout specifically designed for individual blog posts. It probably extends `BaseLayout.astro` and adds elements relevant to posts, such as author information, date, table of contents, related posts, and comment sections.
-   `lib/`: A common directory for utility functions, helper scripts, and other TypeScript/JavaScript modules that provide reusable logic across the application.
    -   `content/`: Contains modules related to fetching, processing, and querying content from Astro's collections.
        -   `queries.ts`: Provides functions for querying blog posts, categories, and tags, often with sorting, filtering, and pagination capabilities (e.g., `getPosts`, `getPostBySlug`, `getCategories`, `getPostsByCategory`).
        -   `related.ts`: Contains logic to find and retrieve related posts based on shared tags or categories.
        -   `search.ts`: Implements search functionality for blog posts, likely using frontmatter data or full-text search if integrated.
    -   `images/`: Contains utility functions related to image handling.
        -   `utils.ts`: Provides image utility functions, such as `generatePlaceholderImage` for creating placeholder images (e.g., via placehold.co) and `getResponsiveImageSizes` for generating `sizes` attributes for responsive images.
    -   `index.ts`: Often serves as an entry point for the `lib` directory, re-exporting commonly used functions or modules from other files within `lib` for easier importing elsewhere in the project.
    -   `pagination/`: Contains utility functions for implementing pagination logic.
        -   `utils.ts`: Provides helper functions for pagination, such as calculating total pages, generating page URLs, and determining which posts appear on a given page.
    -   `seo/`: Contains modules and functions for managing SEO-related aspects.
        -   `utils.ts`: Provides utility functions for SEO, such as generating page titles, meta descriptions, canonical URLs, and structured data (JSON-LD) for improved search engine visibility.
-   `pages/`: This directory is fundamental to Astro's file-based routing. Each `.astro`, `.md`, or `.mdx` file here becomes a page on the website. Subdirectories create nested routes.
    -   `404.astro`: Defines the content and layout for the 404 'Page Not Found' error page.
    -   `about.astro`: The 'About Us' page, providing information about the blog or its author(s).
    -   `categories/`: Directory for category-specific listing pages.
        -   `index.astro`: Lists all available categories, likely with links to their respective pages.
        -   `[category]/`: A dynamic route directory for individual category pages.
            -   `index.astro`: Displays the first page of posts for the specified `[category]`.
            -   `[page].astro`: Handles paginated views for a specific category (e.g., `/categories/my-category/page/2`).
    -   `contact.astro`: The 'Contact Us' page, likely containing a contact form or contact information.
    -   `disclaimer.astro`: A page displaying any necessary disclaimers for the blog's content.
    -   `index.astro`: The homepage of the blog. It typically lists recent posts or featured content.
    -   `posts/`: Directory for individual blog post pages and paginated post listings.
        -   `index.astro`: The main blog listing page, often showing the first page of posts, potentially with a redirect to `posts/page/1`.
        -   `[slug].astro`: Dynamic route for displaying individual blog posts. The `slug` corresponds to the filename of the post in `src/content/posts/`.
        -   `page/`: Directory for paginated blog post listing pages.
            -   `[page].astro`: Dynamic route for displaying a specific page of blog posts (e.g., `/posts/page/2`).
    -   `privacy.astro`: The 'Privacy Policy' page, outlining how user data is handled.
    -   `search-index.json.ts`: Build-time endpoint that generates a static `/search-index.json` file used by the `SearchBar` for instant, totally static search.
    -   `tags/`: Directory for tag-specific listing pages.
        -   `index.astro`: Lists all available tags, likely with links to their respective pages.
        -   `[tag]/`: Dynamic route directory for paginated tag views (e.g., `/tags/my-tag/page/2`).
            -   `[page].astro`: Handles paginated views for a specific tag.
    -   `terms.astro`: The 'Terms of Service' or 'Terms and Conditions' page.
-   `scripts/`: Contains standalone JavaScript or TypeScript scripts for build-time tasks, utilities, or other operations not directly part of the Astro component/page lifecycle.
    -   `optimizeImages.js`: A script likely used to process and optimize images (e.g., resizing, converting to WebP) found in the project, possibly populating the `public/images/optimized/` directory. It seems to use the Sharp library.
    -   `prebuild.js`: A script that runs before the main Astro build process. It might perform setup tasks, data fetching, or file generation required by the build.
-   `styles/`: Contains global stylesheets (CSS, SCSS, etc.) and potentially CSS modules or other styling-related files.
    -   `global.css`: A global CSS file imported into layouts or pages to provide base styles, resets, utility classes (like Tailwind's base/components/utilities), or site-wide theming.
    -   `hero-animation.css`: CSS file specifically for animations used in the hero section of the website.
-   `types/`: Holds custom TypeScript type definitions and interfaces used throughout the project to ensure type safety and improve developer experience.
    -   `content.ts`: Likely contains TypeScript type definitions related to the structure of content collections, such as the frontmatter for blog posts or author profiles.
    -   `global.d.ts`: A TypeScript declaration file for augmenting global scope or declaring types for modules that don't have their own type definitions. It might include declarations for Astro's `locals` or other environment-specific types.

## Other Root-level Files

-   `.astro/`: A directory used by Astro for caching and other internal build-time purposes. It's typically gitignored.
-   `.git/`: Contains all the information necessary for your project in version control with Git, including history, branches, and metadata. This directory is hidden by default and managed by Git.
-   `.gitignore`: A text file that tells Git which files or folders to ignore in a project. Common entries include `node_modules/`, `dist/`, `.env`, and IDE-specific or OS-specific files.
-   `BLOG_TEMPLATE_GUIDE.md`: A Markdown document providing guidance on using and customizing the blog template.
-   `BLOG_TEMPLATE_TRANSFORMATION.md`: A Markdown document detailing the transformation process of the blog template, possibly from its original state (e.g., "StockSage") to its current generic form.
-   `CLEANUP_SUMMARY.md`: A Markdown document summarizing cleanup activities performed on the codebase.
-   `README.md`: The primary documentation file for the project. It typically includes a project description, setup instructions, usage guidelines, and other essential information for developers or users.
-   `REFACTORING_GUIDE.md`: A Markdown document that outlines the refactoring process undertaken in the project, including goals, strategies, and key changes.
-   `astro.config.mjs`: The main configuration file for the Astro build system. It defines site-wide settings, integrations (e.g., sitemap, Tailwind CSS, React, MDX), image optimization, and build options.
-   `dist/`: The default output directory where Astro places the built static site. This directory is generated during the build process and contains all the HTML, CSS, JavaScript, images, and other assets ready for deployment. It is typically gitignored.
-   `node_modules/`: Directory where npm (Node Package Manager) installs project dependencies (packages listed in `package.json`). This directory can be very large and is always gitignored, as dependencies can be reinstalled using `npm install`.
-   `package-lock.json`: Automatically generated by npm, this file records the exact versions of all direct and indirect dependencies used in the project. It ensures consistent installations across different environments.
-   `package.json`: The manifest file for Node.js projects. It contains metadata about the project (name, version, description), lists dependencies and development dependencies, and defines scripts for common tasks (e.g., `dev`, `build`, `preview`, `lint`).
-   `project_layout.md`: This document itself, detailing the project's directory structure and file purposes.
-   `project_status.md`: A Markdown document tracking the status, progress, and potentially to-do items for the project.
-   `tailwind.config.mjs`: The configuration file for Tailwind CSS. It allows customization of Tailwind's default utility classes, themes (colors, fonts, spacing), plugins, and content sources (files to scan for class usage).
-   `technical_implementation.md`: A Markdown document describing the technical details and implementation choices made during the project's development.
-   `tsconfig.json`: The configuration file for the TypeScript compiler (tsc). It specifies root files, compiler options (e.g., target ECMAScript version, module system, strictness, JSX settings), and paths for the TypeScript project.
