/** @type {import('tailwindcss').Config} */
import { getThemeColors } from './src/config/current-config.ts';

// Get current theme colors
const themeColors = getThemeColors();

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...themeColors,
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
             typography: (theme) => ({
         DEFAULT: {
           css: {
             maxWidth: 'none',
             color: theme('colors.slate.700'),
             lineHeight: '1.7',
             fontSize: '16px',
             'h1, h2, h3, h4, h5, h6': {
               color: theme('colors.slate.900'),
               fontWeight: '700',
               lineHeight: '1.25',
             },
             'h1': {
               fontSize: '2.5rem',
               marginTop: '0',
               marginBottom: '2rem',
             },
             'h2': {
               fontSize: '2rem',
               marginTop: '3rem',
               marginBottom: '1.5rem',
             },
             'h3': {
               fontSize: '1.5rem',
               marginTop: '2.5rem',
               marginBottom: '1rem',
             },
             'h4': {
               fontSize: '1.25rem',
               marginTop: '2rem',
               marginBottom: '0.75rem',
             },
             p: {
               marginTop: '1.25rem',
               marginBottom: '1.25rem',
               color: theme('colors.slate.700'),
             },
             a: {
               color: theme('colors.primary.600'),
               textDecoration: 'none',
               fontWeight: '500',
               '&:hover': {
                 color: theme('colors.primary.700'),
                 textDecoration: 'underline',
               },
             },
             blockquote: {
               borderLeftWidth: '4px',
               borderLeftColor: theme('colors.primary.500'),
               backgroundColor: theme('colors.primary.50'),
               padding: theme('spacing.4'),
               borderRadius: theme('borderRadius.lg'),
               fontStyle: 'italic',
               margin: '2rem 0',
             },
             code: {
               color: theme('colors.pink.600'),
               backgroundColor: theme('colors.gray.100'),
               padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
               borderRadius: theme('borderRadius.md'),
               fontSize: '0.875rem',
               fontWeight: '600',
             },
             'pre code': {
               backgroundColor: 'transparent',
               padding: '0',
               color: theme('colors.gray.200'),
             },
             pre: {
               backgroundColor: theme('colors.slate.900'),
               color: theme('colors.gray.200'),
               padding: theme('spacing.4'),
               borderRadius: theme('borderRadius.lg'),
               overflow: 'auto',
               margin: '2rem 0',
             },
             ul: {
               listStyleType: 'disc',
               paddingLeft: '1.5rem',
             },
             ol: {
               listStyleType: 'decimal',
               paddingLeft: '1.5rem',
             },
             li: {
               margin: '0.5rem 0',
               color: theme('colors.slate.700'),
             },
           },
         },
         dark: {
           css: {
             color: theme('colors.slate.300'),
             'h1, h2, h3, h4, h5, h6': {
               color: `${theme('colors.slate.50')} !important`,
               fontWeight: '700',
             },
             p: {
               color: `${theme('colors.slate.300')} !important`,
             },
             li: {
               color: `${theme('colors.slate.300')} !important`,
             },
             a: {
               color: `${theme('colors.primary.400')} !important`,
               '&:hover': {
                 color: `${theme('colors.primary.300')} !important`,
               },
             },
             blockquote: {
               borderLeftColor: theme('colors.primary.400'),
               backgroundColor: theme('colors.primary.900'),
               color: `${theme('colors.slate.200')} !important`,
             },
             code: {
               color: `${theme('colors.pink.400')} !important`,
               backgroundColor: theme('colors.slate.800'),
             },
             pre: {
               backgroundColor: theme('colors.slate.900'),
               color: theme('colors.slate.200'),
             },
             'pre code': {
               color: theme('colors.slate.200'),
             },
             strong: {
               color: `${theme('colors.slate.50')} !important`,
             },
             'thead th': {
               color: `${theme('colors.slate.100')} !important`,
             },
             'tbody td': {
               color: `${theme('colors.slate.300')} !important`,
             },
           },
         },
       }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
