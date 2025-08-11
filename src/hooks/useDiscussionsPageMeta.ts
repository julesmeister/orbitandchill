/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from 'react';

/**
 * Custom hook for managing discussions page SEO meta tags
 */
export function useDiscussionsPageMeta() {
  useEffect(() => {
    // Set document title
    document.title = "Astrology Discussions - Luckstrology Community";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const description =
      "Join our vibrant astrology community to discuss natal charts, transits, synastry, and astrological insights. Connect with fellow astrology enthusiasts and share your experiences.";

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords =
      "astrology discussions, natal chart analysis, astrology community, transits, synastry, horoscope forum, astrological insights";

    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    // Cleanup function to reset meta tags (optional)
    return () => {
      // You might want to reset to default meta tags here
      // This is optional and depends on your app's behavior
    };
  }, []);

  // Function to update meta tags dynamically (for filtered results)
  const updateMetaForFilters = (selectedCategory: string, searchQuery: string, resultCount: number) => {
    let dynamicTitle = "Astrology Discussions - Luckstrology Community";
    let dynamicDescription = "Join our vibrant astrology community to discuss natal charts, transits, synastry, and astrological insights.";

    if (searchQuery) {
      dynamicTitle = `"${searchQuery}" - Astrology Discussions | Luckstrology`;
      dynamicDescription = `Search results for "${searchQuery}" in our astrology community. ${resultCount} discussions found.`;
    } else if (selectedCategory !== "All Categories") {
      dynamicTitle = `${selectedCategory} Discussions - Luckstrology Community`;
      dynamicDescription = `Explore ${selectedCategory.toLowerCase()} discussions in our astrology community. ${resultCount} discussions in this category.`;
    }

    document.title = dynamicTitle;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", dynamicDescription);
    }
  };

  return {
    updateMetaForFilters
  };
}