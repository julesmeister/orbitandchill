import { NextRequest, NextResponse } from 'next/server';

// POST - Process pasted Reddit content into discussion candidates
export async function POST(request: NextRequest) {
  try {
    // Check request size
    const contentLength = request.headers.get('content-length');
    console.log('Request content-length header:', contentLength);
    
    const body = await request.json();
    const { content, settings } = body;
    
    console.log('Received content length:', content?.length);
    console.log('Content type:', typeof content);
    console.log('First 200 chars:', content?.substring(0, 200));
    console.log('Last 200 chars:', content?.substring(content.length - 200));
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (content.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Content must be at least 50 characters long' },
        { status: 400 }
      );
    }
    
    // Don't split content - treat it as one cohesive discussion that AI will intelligently process
    const fullContent = content.trim();
    
    // Basic content analysis for the entire pasted content
    const wordCount = fullContent.split(' ').length;
    const hasQuestions = /\?/.test(fullContent);
    const hasPersonalStory = /\b(I|my|me|mine|myself)\b/gi.test(fullContent);
    const hasAstrologyTerms = /\b(natal|chart|planet|sign|house|aspect|transit|retrograde|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|sun|moon|ascendant|midheaven|aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)\b/gi.test(fullContent);
    
    // Suggest category based on content analysis
    let suggestedCategory = 'General Discussion';
    if (hasAstrologyTerms) {
      if (/\b(natal|birth|chart)\b/gi.test(fullContent)) {
        suggestedCategory = 'Natal Chart Analysis';
      } else if (/\b(transit|prediction|future)\b/gi.test(fullContent)) {
        suggestedCategory = 'Transits & Predictions';
      } else if (/\b(relationship|compatibility|synastry)\b/gi.test(fullContent)) {
        suggestedCategory = 'Synastry & Compatibility';
      } else if (/\b(help|reading|interpret)\b/gi.test(fullContent)) {
        suggestedCategory = 'Chart Reading Help';
      }
    }
    
    // Extract potential tags
    const tags = [];
    if (hasQuestions) tags.push('question');
    if (hasPersonalStory) tags.push('personal-experience');
    if (hasAstrologyTerms) tags.push('astrology');
    
    // Extract a potential title from the beginning of the content
    const lines = fullContent.split('\n');
    let title = lines[0].replace(/^#+\s*/, '').replace(/^[\d\.\)]+\s*/, '').trim();
    
    // If title is empty or too long, generate one from content
    if (!title || title.length > 200) {
      const words = fullContent.split(' ').slice(0, 10);
      title = words.join(' ');
      if (title.length > 100) {
        title = title.substring(0, 97) + '...';
      }
    }
    
    // Create a single parsed content object
    const parsedContent = [{
      id: 'parsed_1',
      originalTitle: title,
      originalContent: fullContent,
      fullContent: fullContent,
      wordCount,
      characterCount: fullContent.length,
      hasQuestions,
      hasPersonalStory,
      hasAstrologyTerms,
      suggestedCategory,
      suggestedTags: tags,
      source: 'pasted_content',
      processedAt: new Date().toISOString()
    }];
    
    return NextResponse.json({
      success: true,
      data: parsedContent,
      summary: {
        totalContent: 1,
        wordCount: wordCount,
        characterCount: fullContent.length,
        suggestedCategory: suggestedCategory,
        suggestedTags: tags,
        readyForAI: true
      },
      message: `Content ready for AI transformation (${wordCount} words, ${fullContent.length} characters)`
    });
  } catch (error) {
    console.error('Error processing pasted content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process pasted content: ' + (error as Error).message },
      { status: 500 }
    );
  }
}