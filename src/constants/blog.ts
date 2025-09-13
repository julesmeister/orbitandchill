/* eslint-disable @typescript-eslint/no-unused-vars */

import { BlogCategory } from '@/types/blog';

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'all',
    name: 'All Posts',
    description: 'Browse all blog posts',
    postCount: 0
  },
  {
    id: 'guides',
    name: 'Astrology Guides',
    description: 'Comprehensive guides to understand astrology',
    postCount: 0
  },
  {
    id: 'zodiac',
    name: 'Zodiac Signs',
    description: 'Deep dives into each zodiac sign',
    postCount: 0
  },
  {
    id: 'planets',
    name: 'Planetary Influences',
    description: 'Understanding planetary energies and transits',
    postCount: 0
  },
  {
    id: 'houses',
    name: 'Astrological Houses',
    description: 'Exploring the 12 houses and their meanings',
    postCount: 0
  },
  {
    id: 'aspects',
    name: 'Aspects & Angles',
    description: 'How planets interact through aspects',
    postCount: 0
  },
  {
    id: 'techniques',
    name: 'Techniques & Methods',
    description: 'Advanced astrological techniques and methods',
    postCount: 0
  },
  {
    id: 'news',
    name: 'Astrology News',
    description: 'Latest updates and cosmic events',
    postCount: 0
  }
];

export const POSTS_PER_PAGE = 9;

export const POPULAR_TAGS = [
  'mercury retrograde',
  'full moon',
  'new moon',
  'eclipse',
  'saturn return',
  'venus',
  'mars',
  'jupiter',
  'neptune',
  'pluto',
  'ascendant',
  'midheaven',
  'synastry',
  'composite',
  'solar return'
];