# Blog CMS – Universal Astro Blog Template

A highly-configurable, multi-niche blog starter built with **Astro**, **TypeScript** and **Tailwind CSS**.  
Use it to launch a technology, lifestyle, finance, food, travel – or completely custom – blog in minutes with **zero hard-coding**.

---

## 1  Prerequisites

| Tool | Version |
|------|---------|
| Node | 18 or newer |
| npm  | 9 or newer |

> ⚠️ **Linux permissions** – this repository was initialised with a system-wide Node installation.  
> When you run `npm install` you may hit `EACCES` errors. If so, simply prepend **`sudo`** to any `npm` command.

---

## 2  Installation

```bash
# Clone the repo
$ git clone https://github.com/your-org/blog_cms.git && cd blog_cms

# Install dependencies (use sudo on Linux if you get EACCES)
$ sudo npm install
```

---

## 3  Running the Development Server

```bash
# Start Astro in dev-watch mode
$ npm run dev
```

Browse to **<http://localhost:4321>**.

---

## 4  Building & Previewing Production

```bash
# Generate static production build
$ npm run build

# Preview the build locally
$ npm run preview
```

Deploy the generated **`dist/`** directory to Vercel, Netlify, Cloudflare Pages, GitHub Pages or any static host.

---

## 5  Customising Your Blog

1. **Edit branding and social links** – update site title, description, logos, theme colours, and all social media links inside `src/config/current-config.ts`.
   - **Social links are managed exclusively via the top-level `BLOG_CONFIG.social` array**. Add, remove, or modify your social profiles there.
   - **Centralized site URL/email:** The site URL and contact email are now managed centrally in config and used throughout the project.
   - **Dark mode link styling:** In dark mode, all links inside `.prose` content are light blue/white for readability. Social media icon links are now excluded from this forced color to preserve their brand colors.
   - **Configurable hero background:** The homepage hero section supports a custom background image via `BLOG_CONFIG.layout.heroConfig.heroBackgroundImage`. You can use either a simple string path or a comprehensive object with src, alt, width, and height properties.
2. **Write posts** – place markdown/MDX files in `src/content/posts/`.  
   Front-matter controls category, tags, `featured` flag, hero images, etc.
   - **Featured Posts:** Only posts with `featured: true` in their front-matter will appear in the homepage featured section. If you do not set `featured: true`, your post will not be shown as featured, even if there are fewer featured posts than the configured limit.

Hot-reload means you will see changes instantly.

---

## 5a  Upstox Account Opening CTA

- The homepage and post layout now include a modern, visually appealing Upstox Demat Account Opening card.
- The card uses glassmorphism, gradients, and a responsive layout for a professional look.
- To update or customize the CTA, edit `src/components/features/UpstoxCTA.astro` and the Upstox logo in `public/images/blog/upstox.jpeg`.
- The CTA is automatically included in every post (see `PostLayout.astro`).

## 5b  Image Handling & Zoom Feature

- **Responsive Image Sizing**:
  - **320px** - Home page post cards use smaller 320px images for faster loading
  - **640px** - All blog post content images load at 640px resolution by default
  - **960px** - Images switch to higher resolution when zoomed
- **WebP Prioritization** - WebP format is prioritized when available for improved performance and quality, with fallbacks for compatibility
- **Custom Image Zoom** - A lightweight custom zoom modal replaces the previous FSLightbox dependency
- **Performance Optimizations**:
  - Client-side caching to prevent duplicate requests when zooming the same image multiple times
  - Loading indicators appear during high-resolution image transitions
  - No additional libraries required - pure JavaScript implementation
  - Automatic format selection uses WebP when supported
- **Wide Coverage** - Works for both hero images and all in-post images automatically
- **Homepage Post Cards** - Post card images use smaller 320px resolutions for faster loading

---

## 6  Project Structure (Top-Level)

```
├── content/               # Content submodule (symlink from blog_content repo)
│   ├── posts/             # Blog posts in MDX format
│   └── uploads/           # Blog post images
├── public/                # Static assets (images, icons, fonts…)
├── src/
│   ├── components/        # .astro components
│   ├── config/            # Typed configuration system
│   ├── content/           # Content collection config
│   ├── lib/               # Reusable TS utilities (SEO, images…)
│   ├── pages/             # Route definitions
│   └── types/             # Shared TS types
└── tailwind.config.mjs    # Tailwind design tokens
```

A deeper technical breakdown lives in **`technical_implementation.md`**.

### 6.2 Content Architecture

This blog uses a separated content architecture:

- **Blog code** lives in this repository
- **Blog content** (posts and images) lives in a separate repository (`/blog_content`)

The content is integrated using symbolic links:
- `/blog_content/posts` → `/blog_cms/src/content/posts`
- `/blog_content/uploads` → `/blog_cms/public/images/uploads`

This separation allows:
- Independent versioning of content and code
- Easier content management and editing
- Automated rebuilds when content changes (via GitHub Actions)

---

## 6.1 Carousel & Card Interactivity

- The homepage carousels (featured/latest posts) support smooth drag scrolling and clickable post cards.
- **Featured posts carousel only shows posts with `featured: true`.** There is no fallback to regular posts if there are not enough featured posts.
- **Fully clickable post cards:** The entire post card is now clickable to navigate to the post. Category links still maintain their specific functionality when clicked.
- **Consistent theme colors:** Post dates now use primary theme colors (matching author name styling) for visual consistency across the site.
- **Navigation dots** below each carousel match the number of posts and show post numbers for clarity.
- **Dark mode accessibility:** All carousel controls and dots have high-contrast colors in dark mode.
- **Known issue:** If you add custom wrappers around `PostCard`, ensure they do not block pointer events.

---

## 7  Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Static production build |
| `npm run preview` | Preview production build locally |
| `npm run optimize-images` | Pre-optimise images for best Lighthouse scores |

---

## 8  Support & Contributing

• Open an Issue or Discussion on GitHub.  
• PRs are welcome – please follow conventional commits and include tests where practical.

---

#### License

MIT © Your Name
