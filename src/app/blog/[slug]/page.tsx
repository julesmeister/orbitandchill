"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  useEffect(() => {
    // Redirect all blog slug routes to discussions
    router.replace(`/discussions/${resolvedParams.slug}`);
  }, [resolvedParams.slug, router]);

  // Show a loading state while redirecting
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-4 h-4 bg-black animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-black animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-black animate-bounce"></div>
        </div>
        <p className="text-black/60 font-inter">Redirecting...</p>
      </div>
    </div>
  );
}