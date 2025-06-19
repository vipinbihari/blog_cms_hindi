import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Client-side search bar that fetches `/search-index.json` (generated at build)
 * and filters posts in the browser. Shown as a dropdown of matching posts.
 */
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState([]);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileInputVisible, setMobileInputVisible] = useState(false);
  const inputRef = useRef(null);

  // Fetch index once
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data) => setIndex(data))
      .catch((err) => console.error('Failed to load search index', err));
  }, []);

  // Filter whenever query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      setOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = index
      .filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
    setResults(filtered);
    setOpen(true);
  }, [query, index]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.parentNode.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative text-sm">
      {/* Large-screen input */}
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts…"
        className="hidden lg:block w-40 xl:w-56 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink"
      />

      {/* Icon for mobile & medium screens */}
      <button
        type="button"
        className="lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Search"
        onClick={() => setMobileInputVisible(true)}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z" />
        </svg>
      </button>

      {/* Mobile overlay input */}
      {mobileInputVisible &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 lg:hidden" onClick={() => setMobileInputVisible(false)}>
            <div
              className="bg-white dark:bg-gray-900 w-full rounded-md shadow-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts…"
                  autoFocus
                  className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  className="p-2 text-gray-600 dark:text-gray-300"
                  aria-label="Close search"
                  onClick={() => {
                    setMobileInputVisible(false);
                    setQuery('');
                  }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {open && results.length > 0 && (
                <ul className="mt-2 max-h-60 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-inner">
                  {results.map((r) => (
                    <li key={r.slug}>
                      <a
                        href={r.slug}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setMobileInputVisible(false)}
                      >
                        {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* Dropdown for large screens */}
      {open && results.length > 0 && (
        <ul className="hidden lg:block absolute right-0 mt-1 w-72 max-h-64 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
          {results.map((r) => (
            <li key={r.slug}>
              <a
                href={r.slug}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
