// Global type definitions to address TypeScript errors in the Blog CMS project

// Declarations for AST-related packages used by Astro
declare module 'babel__core' {}
declare module 'babel__generator' {}
declare module 'babel__template' {}
declare module 'babel__traverse' {}
declare module 'estree' {}
declare module 'estree-jsx' {}
declare module 'hast' {}
declare module 'mdast' {}
declare module 'mdx' {}
declare module 'nlcst' {}
declare module 'unist' {}
declare module 'prop-types' {}

// Node.js types
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  }
  
  interface Process {
    env: ProcessEnv;
  }
}

declare var process: NodeJS.Process;

// Explicitly declare the 'node' module to fix the TypeScript error
declare module 'node' {
  export = NodeJS;
}

// Astro content collections type declarations
declare module 'astro:content' {
  export interface CollectionEntry<T> {
    id: string;
    slug: string;
    body: string;
    collection: string;
    data: T;
    render(): Promise<{ Content: any; headings: any[]; remarkPluginFrontmatter: any }>;
  }

  export function getCollection<T>(
    collection: string,
    filter?: (entry: CollectionEntry<T>) => boolean
  ): Promise<CollectionEntry<T>[]>;
  
  export function getEntryBySlug<T>(
    collection: string,
    slug: string
  ): Promise<CollectionEntry<T> | undefined>;
  
  export function getEntry<T>(
    collection: string,
    slug: string
  ): Promise<CollectionEntry<T> | undefined>;
}

// Declare image file types for import in TypeScript
declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const content: React.FC<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// Astro component props type
declare namespace Astro {
  export interface Props {
    [key: string]: any;
  }
}
