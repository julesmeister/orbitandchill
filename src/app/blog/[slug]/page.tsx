/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BlogSEO from '@/components/blog/BlogSEO';
import EmbeddedChartDisplay from '@/components/charts/EmbeddedChartDisplay';
import EmbeddedVideoDisplay from '@/components/videos/EmbeddedVideoDisplay';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Calendar, User, Tag, Eye, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  avatar?: string;
  preferredAvatar?: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  embeddedChart?: any;
  embeddedVideo?: any;
  isPublished: boolean;
  isPinned: boolean;
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // First try to fetch from discussions API with blog post filter
        const response = await fetch(`/api/discussions/by-slug/${resolvedParams.slug}`);
        
        if (!response.ok) {
          throw new Error('Post not found');
        }

        const data = await response.json();
        
        if (data.success && data.discussion) {
          const discussion = data.discussion;
          
          // Check if this is actually a blog post
          if (!discussion.isBlogPost) {
            router.push(`/discussions/${resolvedParams.slug}`);
            return;
          }
          
          setPost({
            id: discussion.id,
            title: discussion.title,
            slug: discussion.slug,
            content: discussion.content,
            excerpt: discussion.excerpt,
            authorId: discussion.authorId,
            authorName: discussion.authorName,
            avatar: discussion.avatar,
            preferredAvatar: discussion.preferredAvatar,
            category: discussion.category,
            tags: discussion.tags || [],
            views: discussion.views || 0,
            likes: discussion.upvotes || 0,
            createdAt: discussion.createdAt,
            updatedAt: discussion.updatedAt,
            embeddedChart: discussion.embeddedChart,
            embeddedVideo: discussion.embeddedVideo,
            isPublished: discussion.isPublished,
            isPinned: discussion.isPinned
          });
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.slug, router]);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-black animate-bounce"></div>
            </div>
            <p className="text-black/60 font-open-sans">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-space-grotesk text-4xl font-bold text-black mb-4">
              Article Not Found
            </h1>
            <p className="text-black/60 font-open-sans mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-open-sans hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authorAvatar = post.preferredAvatar || post.avatar || '/images/default-avatar.svg';

  return (
    <>
      <BlogSEO 
        post={post}
        isHomePage={false}
      />

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
        <article className="min-h-screen">
          {/* Header */}
          <header className="px-[2%] py-8 border-b border-black">
            <div className="max-w-4xl mx-auto">
              <Link 
                href="/blog"
                className="inline-flex items-center text-black hover:bg-black hover:text-white px-3 py-2 transition-colors font-open-sans mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              {post.isPinned && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-[#ff91e9] text-black text-sm font-medium border border-black font-open-sans">
                    ⭐ Featured Article
                  </span>
                </div>
              )}

              <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-black/70 font-open-sans">
                <div className="flex items-center gap-2">
                  <img 
                    src={authorAvatar} 
                    alt={post.authorName}
                    className="w-8 h-8 border border-black object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-avatar.svg';
                    }}
                  />
                  <span className="font-medium">{post.authorName}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.toISOString()}>
                    {formatDate(post.createdAt)}
                  </time>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime(post.content)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} views</span>
                </div>
              </div>

              {post.excerpt && (
                <p className="mt-6 text-lg text-black/80 font-open-sans leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="px-[2%] py-12">
            <div className="max-w-4xl mx-auto">
              {/* Embedded Chart */}
              {post.embeddedChart && (
                <div className="mb-12 border border-black">
                  <div className="p-4 bg-gray-50 border-b border-black">
                    <h3 className="font-space-grotesk font-bold text-black text-lg">
                      📊 {post.embeddedChart.metadata?.chartTitle || 'Chart'}
                    </h3>
                    <p className="text-sm text-black/70 font-open-sans mt-1">
                      {post.embeddedChart.chartType?.charAt(0).toUpperCase() + post.embeddedChart.chartType?.slice(1)} Chart
                    </p>
                  </div>
                  <div className="p-6 bg-white">
                    <EmbeddedChartDisplay 
                      chart={post.embeddedChart} 
                      isPreview={false}
                      showFullDetails={true}
                    />
                  </div>
                </div>
              )}

              {/* Embedded Video */}
              {post.embeddedVideo && (
                <div className="mb-12 border border-black">
                  <div className="p-4 bg-gray-50 border-b border-black">
                    <h3 className="font-space-grotesk font-bold text-black text-lg">
                      📹 {post.embeddedVideo.title}
                    </h3>
                    <p className="text-sm text-black/70 font-open-sans mt-1">
                      {post.embeddedVideo.platform?.charAt(0).toUpperCase() + post.embeddedVideo.platform?.slice(1)} Video
                    </p>
                  </div>
                  <div className="p-6 bg-white">
                    <EmbeddedVideoDisplay 
                      video={post.embeddedVideo} 
                      isPreview={false}
                    />
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none font-open-sans
                  [&_h1]:font-space-grotesk [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-black [&_h1]:mt-12 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-black [&_h1]:pb-3
                  [&_h2]:font-space-grotesk [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-black [&_h2]:pb-2
                  [&_h3]:font-space-grotesk [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-3
                  [&_p]:text-black [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-lg
                  [&_strong]:text-black [&_strong]:font-bold
                  [&_em]:text-black [&_em]:italic
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 [&_ul]:mb-6 [&_ul]:space-y-2
                  [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 [&_ol]:mb-6 [&_ol]:space-y-2
                  [&_li]:text-black [&_li]:leading-relaxed [&_li]:text-lg [&_li]:ml-0 [&_li]:pl-1
                  [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-gray-50 [&_blockquote]:pl-6 [&_blockquote]:pr-4 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:mb-6 [&_blockquote]:text-black/80
                  [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-sm [&_code]:border [&_code]:border-gray-300 [&_code]:rounded
                  [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:border [&_pre]:border-black [&_pre]:rounded [&_pre]:mb-6 [&_pre]:overflow-x-auto
                  [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium hover:[&_a]:bg-black hover:[&_a]:text-white [&_a]:transition-colors [&_a]:px-1 [&_a]:py-0.5
                  [&_img]:rounded [&_img]:border [&_img]:border-black [&_img]:mb-6 [&_img]:max-w-full [&_img]:h-auto"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-black">
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="font-space-grotesk text-sm font-bold text-black flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Link
                          key={index}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="inline-flex items-center px-3 py-1 bg-black text-white text-sm border border-black font-open-sans hover:bg-gray-800 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="mt-6">
                <Link
                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                  className="inline-flex items-center px-4 py-2 bg-white text-black border border-black font-open-sans hover:bg-black hover:text-white transition-colors"
                >
                  Category: {post.category}
                </Link>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="px-[2%] py-12 border-t border-black bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-open-sans hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Articles
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}