/**
 * ShareButtons component
 * Provides social media sharing functionality for blog posts
 */

import React, { useState } from 'react';

const ShareButtons = ({ title, url: propsUrl, description, tags = [] }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentUrl] = useState(() => {
    if (propsUrl) return propsUrl;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  });
  
  // Generate hashtags for Twitter from post tags
  const hashtags = tags.map(tag => tag.replace(/-/g, '')).join(',');
  
  // Social media share URLs - using the dynamic currentUrl instead of props url
  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}&hashtags=${encodeURIComponent(hashtags)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`
  };
  
  // Handle copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Share this article</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Twitter */}
        <a 
          href={socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd8] dark:bg-white/10 text-white rounded-xl hover:scale-105 shadow-md hover:shadow-lg transform transition-all duration-200 dark:border dark:border-gray-600"
          aria-label="Share on Twitter"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
        
        {/* Facebook */}
        <a 
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1877F2] to-[#0d5dbc] dark:bg-white/10 text-white rounded-xl hover:scale-105 shadow-md hover:shadow-lg transform transition-all duration-200 dark:border dark:border-gray-600"
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        </a>
        
        {/* LinkedIn */}
        <a 
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#0A66C2] to-[#064785] dark:bg-white/10 text-white rounded-xl hover:scale-105 shadow-md hover:shadow-lg transform transition-all duration-200 dark:border dark:border-gray-600"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        
        {/* Reddit */}
        <a 
          href={socialLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#FF4500] to-[#d93a00] dark:bg-white/10 text-white rounded-xl hover:scale-105 shadow-md hover:shadow-lg transform transition-all duration-200 dark:border dark:border-gray-600"
          aria-label="Share on Reddit"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2.5-5.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm5 0c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z" />
            <path d="M12 13.75c-2.068 0-3.75-1.682-3.75-3.75S9.932 6.25 12 6.25s3.75 1.682 3.75 3.75-1.682 3.75-3.75 3.75z" />
          </svg>
        </a>
        
        {/* Copy URL Button */}
        <button 
          onClick={copyToClipboard}
          className={`group flex items-center justify-center w-12 h-12 bg-gradient-to-br ${copySuccess ? 'from-emerald-500 to-emerald-700 dark:bg-white/10' : 'from-gray-600 to-gray-800 dark:bg-white/10'} text-white rounded-xl hover:scale-105 shadow-md hover:shadow-lg transform transition-all duration-200 dark:border dark:border-gray-600`}
          aria-label="Copy link to clipboard"
          title="Copy link"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            {copySuccess ? (
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            ) : (
              <>
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </>
            )}
          </svg>
          {copySuccess && <span className="sr-only">Link copied!</span>}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
