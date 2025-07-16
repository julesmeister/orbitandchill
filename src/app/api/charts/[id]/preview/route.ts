import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const shareToken = searchParams.get('shareToken');
    
    // Get chart data
    let chart;
    if (shareToken) {
      chart = await ChartService.getChartByShareToken(shareToken);
    } else {
      // For private charts, you'd need userId validation here
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }
    
    // Generate a simple preview image (for now we'll create a basic SVG)
    const previewSvg = generateChartPreview(chart);
    
    return new NextResponse(previewSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
    
  } catch (error) {
    console.error('Error generating chart preview:', error);
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}

function generateChartPreview(chart: any): string {
  // Extract key chart information
  const subjectName = chart.subjectName || 'Someone';
  const birthDate = chart.birthDate ? new Date(chart.birthDate).toLocaleDateString() : '';
  const birthLocation = chart.birthLocation || 'Unknown location';
  
  // Create a branded preview SVG
  const previewSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Brand Section -->
      <rect x="0" y="0" width="1200" height="80" fill="#000000"/>
      <text x="60" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">
        Orbit and Chill
      </text>
      <text x="1140" y="50" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" text-anchor="end">
        ✨ Natal Chart
      </text>
      
      <!-- Main Content -->
      <text x="60" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1a202c">
        ${subjectName}'s Natal Chart
      </text>
      
      <!-- Birth Info -->
      <text x="60" y="240" font-family="Arial, sans-serif" font-size="24" fill="#4a5568">
        Born: ${birthDate}
      </text>
      <text x="60" y="280" font-family="Arial, sans-serif" font-size="24" fill="#4a5568">
        Location: ${birthLocation}
      </text>
      
      <!-- Decorative Chart Circle -->
      <circle cx="900" cy="350" r="180" fill="none" stroke="#e2e8f0" stroke-width="2"/>
      <circle cx="900" cy="350" r="150" fill="none" stroke="#cbd5e0" stroke-width="1"/>
      <circle cx="900" cy="350" r="120" fill="none" stroke="#cbd5e0" stroke-width="1"/>
      <circle cx="900" cy="350" r="90" fill="none" stroke="#cbd5e0" stroke-width="1"/>
      
      <!-- Zodiac Symbols (simplified) -->
      <text x="900" y="170" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♈</text>
      <text x="1080" y="200" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♉</text>
      <text x="1080" y="350" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♊</text>
      <text x="1080" y="500" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♋</text>
      <text x="900" y="530" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♌</text>
      <text x="720" y="500" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♍</text>
      <text x="720" y="350" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♎</text>
      <text x="720" y="200" font-family="Arial, sans-serif" font-size="24" fill="#4a5568" text-anchor="middle">♏</text>
      
      <!-- Call to Action -->
      <rect x="60" y="450" width="300" height="60" fill="#000000" rx="4"/>
      <text x="210" y="485" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">
        Create Your Own Chart
      </text>
      
      <!-- Footer -->
      <text x="60" y="580" font-family="Arial, sans-serif" font-size="16" fill="#718096">
        Discover your cosmic blueprint at orbitandchill.com
      </text>
    </svg>
  `;
  
  return previewSvg;
}