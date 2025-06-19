/**
 * TableOfContents component
 * Automatically generates a navigation structure for long-form blog posts
 */

import React, { useState, useEffect } from 'react';

const TableOfContents = ({ selector = 'article .content', minHeadings = 3 }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  // Generate TOC on component mount
  useEffect(() => {
    // Find all h2 and h3 elements ONLY in the main blog content
    // Using a specific selector that targets only the content div where MDX is rendered
    const contentDiv = document.querySelector(selector);
    if (!contentDiv) {
      console.log('Content div not found for Table of Contents');
      return;
    }
    
    // Only get headings from the content div (blog body) not from other sections
    const headingElements = Array.from(contentDiv.querySelectorAll('h2, h3'));
    
    // Skip if there are too few headings
    if (headingElements.length < minHeadings) {
      setIsVisible(false);
      return;
    }
    
    // Add IDs to headings if they don't have them
    headingElements.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
    });
    
    // Extract heading data
    const headingsData = headingElements.map(heading => ({
      id: heading.id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1))
    }));
    
    setHeadings(headingsData);
    setIsVisible(headingsData.length >= minHeadings); // Only show TOC if there are enough headings
  }, []);
  
  // Track active heading when scrolling
  useEffect(() => {
    // Wait for the DOM to be fully updated
    setTimeout(() => {
      const headingElements = Array.from(document.querySelectorAll(`${selector} h2, ${selector} h3`));
      if (headingElements.length === 0) {
        console.log('No headings found for Table of Contents');
        return;
      }
      
      console.log('Found headings for TOC:', headingElements.length);
      
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollPosition = window.scrollY + 100; // 100px offset for better UX
            
            // Find the current heading
            for (let i = headingElements.length - 1; i >= 0; i--) {
              const heading = headingElements[i];
              if (heading.offsetTop <= scrollPosition) {
                setActiveId(heading.id);
                break;
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initialize on first render
      
      return () => window.removeEventListener('scroll', handleScroll);
    }, 500); // Small delay to ensure content has rendered
  }, [headings, selector]);
  
  // Don't render if not enough headings
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg sticky top-20"
      style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
    >
      <h4 className="font-bold text-gray-900 dark:text-white mb-3">Table of Contents</h4>
      <nav className="toc">
        <ul className="space-y-2 text-sm">
          {headings.map(heading => (
            <li 
              key={heading.id}
              className={`${heading.level === 3 ? 'ml-4' : ''}`}
            >
              <a
                href={`#${heading.id}`}
                className={`
                  block py-1 px-2 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 
                  ${activeId === heading.id ? 
                    'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium' : 
                    'text-gray-700 dark:text-gray-300'}
                `}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id).scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
