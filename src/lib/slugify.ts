/**
 * Creates a URL-safe slug from any string by:
 * - Converting to lowercase
 * - Replacing special characters with hyphens
 * - Removing leading/trailing hyphens
 * - Replacing multiple consecutive hyphens with a single one
 * 
 * @param value The string to slugify
 * @returns A URL-safe slug
 */
export function slugifyTag(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
}
