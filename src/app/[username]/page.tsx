import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import UserProfilePageClient from './UserProfilePageClient';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  
  try {
    // Fetch user data for metadata
    const response = await fetch(`${siteUrl}/api/users/by-username/${encodeURIComponent(username)}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    const data = await response.json();
    
    if (!data.success || !data.user) {
      return {
        title: `User Not Found | ${BRAND.name}`,
        description: `The user "${username}" could not be found on ${BRAND.name}.`,
        robots: {
          index: false,
          follow: false,
        },
      };
    }
    
    const user = data.user;
    const title = `${user.username}'s Profile | ${BRAND.name}`;
    let description = `View ${user.username}'s astrology profile on ${BRAND.name}.`;
    
    // Add astrological info to description if public
    if (user.sunSign && user.privacy?.showZodiacPublicly) {
      description += ` ${user.sunSign} sun sign.`;
    }
    
    if (user.stelliumSigns && user.stelliumSigns.length > 0 && user.privacy?.showStelliumsPublicly) {
      description += ` Stelliums in ${user.stelliumSigns.join(', ')}.`;
    }
    
    const keywords = [
      'astrology profile',
      'natal chart',
      user.sunSign ? `${user.sunSign} astrology` : '',
      'astrological community',
      'birth chart analysis',
      'astrology enthusiast'
    ].filter(Boolean).join(', ');

    return {
      title,
      description,
      keywords,
      authors: [{ name: BRAND.name }],
      creator: BRAND.name,
      publisher: BRAND.name,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: `/${username}`,
      },
      openGraph: {
        title,
        description,
        url: `/${username}`,
        siteName: BRAND.name,
        locale: 'en_US',
        type: 'profile',
        images: [
          {
            url: '/images/profile-og.jpg',
            width: 1200,
            height: 630,
            alt: `${user.username}'s Astrology Profile`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/images/profile-og.jpg'],
        creator: '@orbitandchill',
        site: '@orbitandchill',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching user for metadata:', error);
    return {
      title: `${username} | ${BRAND.name}`,
      description: `View ${username}'s astrology profile and community activity on ${BRAND.name}.`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function UserProfilePage({ params }: PageProps) {
  return <UserProfilePageClient params={params} />;
}