/**
 * ReadingProgress component
 * Displays a progress bar showing how far a user has scrolled through an article
 */

import React, { useState, useEffect } from 'react';

const ReadingProgress = () => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      // Get article content element
      const article = document.querySelector('article');
      if (!article) return;
      
      // Calculate reading progress percentage
      const articleHeight = article.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // How far have we scrolled in the article
      const scrollPosition = scrollY - article.offsetTop;
      // How much total can we scroll
      const totalScrollable = articleHeight - windowHeight;
      
      // Calculate progress percentage and clamp between 0-100
      const progress = Math.max(0, Math.min(100, (scrollPosition / totalScrollable) * 100));
      
      setReadingProgress(progress);
    };

    // Add scroll event listener
    window.addEventListener('scroll', updateReadingProgress);
    
    // Initialize progress
    updateReadingProgress();
    
    // Cleanup event listener
    return () => window.removeEventListener('scroll', updateReadingProgress);
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
