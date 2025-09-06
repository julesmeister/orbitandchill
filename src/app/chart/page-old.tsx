import { Metadata } from 'next';
import { generateSharedChartMeta, generateSharedChartStructuredData } from '@/utils/sharedChartMeta';
import { ChartService } from '@/db/services/chartService';
import ChartPageClient from './ChartPageClient';

interface PageProps {
  searchParams: Promise<{
    shareToken?: string;
  }>;
}

// Generate dynamic metadata for shared charts
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const shareToken = params.shareToken;

  return generateSharedChartMeta({ shareToken });
}

export default async function ChartPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const shareToken = params.shareToken;

  // If there's a share token, try to get the chart data for structured data
  let sharedChart = null;
  if (shareToken) {
    try {
      sharedChart = await ChartService.getChartByShareToken(shareToken);
    } catch (error) {
      console.error('Error loading shared chart for structured data:', error);
    }
  }

  return (
    <>
      {/* Add structured data for shared charts */}
      {sharedChart && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateSharedChartStructuredData(sharedChart)),
          }}
        />
      )}
      
      {/* Client-side chart functionality */}
      <ChartPageClient />
    </>
  );
}