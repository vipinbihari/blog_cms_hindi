/**
 * ReadingProgress component
 * Displays a progress bar showing how far a user has scrolled through an article
 * Progress starts immediately on scroll and reaches 100% at the ShareButtons component
 */

import React, { useState, useEffect } from 'react';

const ReadingProgress = () => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    // Find ShareButtons element - end point of our reading progress
    const findShareButtons = () => {
      try {
        // Try multiple selector strategies
        return (
          // First try to find the specific container with ShareButtons
          document.querySelector('article div.border-t:has(div.ShareButtons)') || 
          document.querySelector('article div.border-t:has(div[class*="ShareButtons"])') ||
          // Then try by more generic border-t within article (which is usually ShareButtons container)
          document.querySelector('article > div > article > div.border-t') ||
          document.querySelector('article div.mt-8.pt-4.border-t')
        );
      } catch (e) {
        // Some browsers might not support :has selector
        return document.querySelector('article div.border-t');
      }
    };

    // Calculate reading progress
    const calculateReadingProgress = () => {
      // Get main document elements
      const article = document.querySelector('article');
      if (!article) return 0;
      
      const shareButtons = findShareButtons();
      if (!shareButtons) {
        // If ShareButtons not found, fall back to default calculation
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const contentHeight = article.scrollHeight; 
        const visibleContentHeight = Math.min(contentHeight, windowHeight);
        const maxScroll = contentHeight - visibleContentHeight;
        return Math.max(0, Math.min(100, (scrollPosition / maxScroll) * 100));
      }

      // Current scroll position from top of page
      const scrollPosition = window.scrollY;
      
      // Get the position where we want to show 100% progress
      // (when ShareButtons enters the viewport)
      const shareButtonsPosition = shareButtons.getBoundingClientRect().top + window.scrollY;
      const viewportHeight = window.innerHeight;
      const targetScrollPosition = Math.max(0, shareButtonsPosition - viewportHeight * 0.9);
      
      // If we've already scrolled past the target position
      if (scrollPosition >= targetScrollPosition) {
        return 100;
      }
      
      // If we're at the top of the page
      if (scrollPosition === 0) {
        return 0;
      }
      
      // Calculate percentage (scrollPosition / targetScrollPosition)
      return Math.min(100, Math.max(0, (scrollPosition / targetScrollPosition) * 100));
    };

    // Debounce the scroll events for better performance
    let rafId = null;
    const updateProgress = () => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        setReadingProgress(calculateReadingProgress());
      });
    };
    
    // Add event listeners
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    
    // Initial calculation
    updateProgress();
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div 
        className="h-full bg-primary-600 dark:bg-primary-400 transition-all duration-100 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
