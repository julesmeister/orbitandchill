import { redirect } from 'next/navigation';

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const resolvedParams = await params;
  
  // Server-side 301 redirect to discussions
  redirect(`/discussions/${resolvedParams.slug}`);
}