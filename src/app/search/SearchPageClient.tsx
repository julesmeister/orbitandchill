"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BRAND } from '@/config/brand';

// Thread interface matching PostsTab.tsx
interface Thread {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  preferredAvatar?: string;
  slug?: string;
  isBlogPost: boolean;
  isPublished: boolean;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  upvotes: number;
  downvotes: number;
  replies: number;
  featuredImage?: string;
  category: string;
  embeddedChart?: any;
  embeddedVideo?: any;
}

interface SearchResult {
  type: 'discussion' | 'blog' | 'guide' | 'faq';
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  author?: string;
  createdAt?: string;
  isPinned?: boolean;
  tags?: string[];
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);

  // Fetch threads data from the same API that PostsTab uses
  const fetchThreads = async () => {
    if (threads.length > 0) return; // Don't refetch if we already have data
    
    setLoadingThreads(true);
    try {
      const response = await fetch('/api/discussions');
      if (response.ok) {
        const data = await response.json();
        const threadsData = Array.isArray(data) ? data : (data.discussions || []);
        setThreads(threadsData.filter((thread: Thread) => thread.isPublished)); // Only show published content
      }
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    } finally {
      setLoadingThreads(false);
    }
  };

  // Static guide and FAQ data
  const staticContent: SearchResult[] = [
    // Guides
    { type: 'guide', id: 'natal-chart', title: 'Your First Natal Chart: A Complete Beginner\'s Guide', description: 'Learn how to create and interpret your natal chart with this comprehensive beginner\'s guide.', url: '/guides/natal-chart', category: 'Beginner' },
    { type: 'guide', id: 'big-three', title: 'Your Big Three: Sun, Moon, and Rising Signs', description: 'Master the foundation of astrological interpretation by understanding your core personality trio.', url: '/guides/big-three', category: 'Beginner' },
    { type: 'guide', id: 'elements-modalities', title: 'Elements and Modalities: The Building Blocks', description: 'Understand the four elements and three modalities that shape astrological interpretation.', url: '/guides/elements-and-modalities', category: 'Beginner' },
    { type: 'guide', id: 'houses', title: 'The Astrological Houses: Life\'s Twelve Stages', description: 'Explore the twelve life themes that shape your cosmic blueprint.', url: '/guides/astrological-houses', category: 'Beginner' },
    { type: 'guide', id: 'horary', title: 'Horary Astrology: Cosmic Question & Answer', description: 'Learn the ancient art of answering specific questions through astrological charts.', url: '/guides/horary-astrology', category: 'Advanced' },
    { type: 'guide', id: 'electional', title: 'Electional Astrology: Perfect Timing for Life Events', description: 'Master the art of choosing the most auspicious times for important events.', url: '/guides/electional-astrology', category: 'Advanced' },
    
    // FAQ topics
    { type: 'faq', id: 'faq-charts', title: 'Natal Chart Questions', description: 'Common questions about generating and interpreting natal charts.', url: '/faq', category: 'Charts' },
    { type: 'faq', id: 'faq-astrology', title: 'Astrology Basics', description: 'Fundamental astrology questions for beginners.', url: '/faq', category: 'Astrology' },
    { type: 'faq', id: 'faq-technical', title: 'Technical Support', description: 'Help with using the platform and troubleshooting issues.', url: '/faq', category: 'Technical' },
  ];

  const performSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Combine static content with dynamic threads
    const threadsAsResults: SearchResult[] = threads.map(thread => ({
      type: thread.isBlogPost ? 'blog' : 'discussion',
      id: thread.id,
      title: thread.title,
      description: thread.excerpt || thread.content.substring(0, 200) + '...',
      url: `/discussions/${thread.slug || thread.id}`,
      category: thread.category,
      author: thread.authorName,
      createdAt: thread.createdAt,
      isPinned: thread.isPinned,
      tags: thread.tags
    }));

    const allContent = [...staticContent, ...threadsAsResults];

    // Simulate API delay
    setTimeout(() => {
      const filteredResults = allContent.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      
      // Sort results by relevance (pinned first, then by date)
      filteredResults.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 300);
  };

  // Fetch threads on component mount
  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL without page reload
    const newUrl = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    window.history.pushState({}, '', newUrl);
  };

  // Synapsas color system for content types
  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'guide': return '📖';
      case 'faq': return '❓';
      case 'discussion': return '💬';
      case 'blog': return '📝';
      default: return '🔍';
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'guide': return '#6bdbff';      // Synapsas blue
      case 'faq': return '#f2e356';        // Synapsas yellow
      case 'discussion': return '#ff91e9'; // Synapsas purple
      case 'blog': return '#51bd94';       // Synapsas green
      default: return '#19181a';           // Synapsas black
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Search {BRAND.name}
          </h1>
          <p className="font-inter text-xl text-black/80 leading-relaxed mb-8">
            Find astrology guides, discussions, and answers to your cosmic questions
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-[5%] py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-black placeholder-black/50 focus:outline-none border-b-2 border-black bg-transparent font-inter text-lg"
                placeholder="Search for guides, discussions, FAQ..."
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-[5%] py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading && (
            <div className="text-center py-16">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-black animate-bounce"></div>
              </div>
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
                Searching...
              </h2>
              <p className="text-black/70">
                Finding relevant content across discussions, guides, and FAQ.
              </p>
            </div>
          )}

          {hasSearched && !isLoading && (
            <>
              <div className="mb-8">
                <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
                  {results.length > 0 
                    ? `Found ${results.length} result${results.length === 1 ? '' : 's'}`
                    : 'No results found'
                  }
                </h2>
                <p className="font-inter text-black/80">
                  {results.length > 0 
                    ? `Searching for "${query}"`
                    : `No matches found for "${query}"`
                  }
                </p>
              </div>

              {results.length > 0 && (
                <div className="space-y-0 border border-black">
                  {results.map((result, index) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className={`relative block p-6 hover:bg-gray-50 transition-all duration-300 group ${
                        index < results.length - 1 ? 'border-b border-black' : ''
                      }`}
                    >
                      {/* Category color indicator */}
                      <div 
                        className="absolute left-0 top-6 w-1 h-8"
                        style={{ backgroundColor: getCategoryColor(result.type) }}
                      />
                      
                      <div className="pl-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span 
                                className="inline-block px-2 py-1 text-xs font-semibold text-white border border-black uppercase"
                                style={{ backgroundColor: getCategoryColor(result.type) }}
                              >
                                {result.type}
                              </span>
                              {result.category && (
                                <span className="text-black/60 text-sm font-inter">
                                  {result.category}
                                </span>
                              )}
                              {result.isPinned && (
                                <span className="inline-block px-2 py-1 bg-black text-white text-xs font-semibold">
                                  PINNED
                                </span>
                              )}
                            </div>
                            <h3 className="font-space-grotesk text-lg font-semibold text-black mb-2 group-hover:underline">
                              {result.title}
                            </h3>
                            <p className="font-inter text-black/70 leading-relaxed mb-3">
                              {result.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-black/60">
                              {result.author && (
                                <span className="font-inter">
                                  By {result.author}
                                </span>
                              )}
                              {result.createdAt && (
                                <span className="font-inter">
                                  {formatDate(result.createdAt)}
                                </span>
                              )}
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex space-x-1">
                                  {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <span 
                                      key={tagIndex}
                                      className="px-2 py-1 bg-black text-white text-xs font-medium border border-black"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {result.tags.length > 3 && (
                                    <span className="px-2 py-1 bg-white text-black text-xs font-medium border border-black">
                                      +{result.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-black/40 group-hover:text-black transition-colors flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-2 border-black flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-space-grotesk text-xl font-bold text-black mb-3">No results found</h3>
                  <p className="font-inter text-black/70 mb-6">
                    Try different keywords or browse our main sections:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/guides" className="px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25">
                      Astrology Guides
                    </Link>
                    <Link href="/discussions" className="px-6 py-3 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15">
                      Community Discussions
                    </Link>
                    <Link href="/faq" className="px-6 py-3 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15">
                      FAQ
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {!hasSearched && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-2 border-black flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-3">What are you looking for?</h3>
              <p className="font-inter text-black/70 mb-8 text-lg">
                Search through our astrology guides, community discussions, and frequently asked questions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0 max-w-4xl mx-auto border border-black">
                <div className="p-6 text-center border-r border-black">
                  <div 
                    className="w-12 h-12 flex items-center justify-center text-xl mx-auto mb-4 border border-black"
                    style={{ backgroundColor: '#6bdbff' }}
                  >
                    📖
                  </div>
                  <h4 className="font-space-grotesk font-semibold text-black mb-2">Guides</h4>
                  <p className="font-inter text-sm text-black/70">Learning astrology concepts</p>
                </div>
                <div className="p-6 text-center border-r border-black">
                  <div 
                    className="w-12 h-12 flex items-center justify-center text-xl mx-auto mb-4 border border-black"
                    style={{ backgroundColor: '#ff91e9' }}
                  >
                    💬
                  </div>
                  <h4 className="font-space-grotesk font-semibold text-black mb-2">Discussions</h4>
                  <p className="font-inter text-sm text-black/70">Community conversations</p>
                </div>
                <div className="p-6 text-center border-r border-black">
                  <div 
                    className="w-12 h-12 flex items-center justify-center text-xl mx-auto mb-4 border border-black"
                    style={{ backgroundColor: '#51bd94' }}
                  >
                    📝
                  </div>
                  <h4 className="font-space-grotesk font-semibold text-black mb-2">Blog Posts</h4>
                  <p className="font-inter text-sm text-black/70">Featured articles</p>
                </div>
                <div className="p-6 text-center">
                  <div 
                    className="w-12 h-12 flex items-center justify-center text-xl mx-auto mb-4 border border-black"
                    style={{ backgroundColor: '#f2e356' }}
                  >
                    ❓
                  </div>
                  <h4 className="font-space-grotesk font-semibold text-black mb-2">FAQ</h4>
                  <p className="font-inter text-sm text-black/70">Common questions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}