/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Structured Data for Astrological Events
 * 
 * This component provides JSON-LD structured data for astrological events
 * to help search engines understand and index our astronomical content.
 */

import React from 'react';
import { AstrologicalEvent } from '../../utils/astrologicalEventDetection';

interface AstrologicalEventsStructuredDataProps {
  events: AstrologicalEvent[];
  siteName: string;
  siteUrl: string;
}

export default function AstrologicalEventsStructuredData({ 
  events, 
  siteName, 
  siteUrl 
}: AstrologicalEventsStructuredDataProps) {
  // Take only the most significant upcoming events for structured data
  const significantEvents = events
    .filter(event => ['rare', 'veryRare'].includes(event.rarity))
    .slice(0, 10);

  // Generate Event schema for astronomical events
  const eventSchemas = significantEvents.map(event => ({
    '@type': 'Event',
    'name': event.name,
    'description': event.description,
    'startDate': event.date.toISOString(),
    'eventStatus': 'https://schema.org/EventScheduled',
    'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
    'location': {
      '@type': 'VirtualLocation',
      'url': `${siteUrl}/#astrological-events-section`
    },
    'organizer': {
      '@type': 'Organization',
      'name': siteName,
      'url': siteUrl
    },
    'about': {
      '@type': 'Thing',
      'name': 'Astrology',
      'description': 'The study of celestial bodies and their influence on human affairs'
    },
    'category': event.type,
    'keywords': [
      'astrology',
      'astronomical event',
      event.type,
      'planetary alignment',
      'celestial event',
      'horoscope'
    ].join(', '),
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Rarity',
        'value': event.rarity
      },
      {
        '@type': 'PropertyValue',
        'name': 'Astrological Impact',
        'value': event.impact
      }
    ]
  }));

  // Generate FAQ schema for common astrological questions
  const faqSchema = {
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What are astrological events?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Astrological events are significant celestial occurrences such as planetary conjunctions, retrogrades, eclipses, and rare alignments that astrologers believe influence human experiences and energies.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How rare are these astronomical events?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Astronomical events vary in rarity from common monthly occurrences like moon phases to very rare events like outer planet conjunctions that happen every 100+ years. We classify events as common, uncommon, rare, or very rare based on their astronomical frequency.'
        }
      },
      {
        '@type': 'Question',
        'name': 'When is the next significant astrological event?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${significantEvents.length > 0 
            ? `The next significant astrological event is ${significantEvents[0].name} on ${significantEvents[0].date.toLocaleDateString()}.` 
            : 'Check our real-time astrological events tracker for the latest upcoming celestial events.'
          }`
        }
      }
    ]
  };

  // Generate WebApplication schema for our astrology tool
  const webAppSchema = {
    '@type': 'WebApplication',
    'name': `${siteName} - Astrological Events Tracker`,
    'description': 'Real-time tracker of rare astrological and astronomical events including planetary conjunctions, retrogrades, eclipses, and celestial alignments.',
    'url': `${siteUrl}/#astrological-events-section`,
    'applicationCategory': 'Astrology Tool',
    'operatingSystem': 'Web Browser',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'featureList': [
      'Real-time astronomical event detection',
      'Planetary conjunction tracking',
      'Retrograde period notifications',
      'Moon phase calendars',
      'Rare celestial event alerts',
      'Astrological impact interpretations'
    ]
  };

  // Combine all schemas
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Events
      ...eventSchemas,
      // FAQ
      faqSchema,
      // Web Application
      webAppSchema
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}