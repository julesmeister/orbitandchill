import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
  position: number;
}

interface BlogBreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export default function BlogBreadcrumbs({ items, currentPage }: BlogBreadcrumbsProps) {
  const allItems = [
    { name: 'Home', href: '/', position: 1 },
    { name: 'Blog', href: '/blog', position: 2 },
    ...items,
    { name: currentPage, href: '', position: items.length + 3 }
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item) => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.href ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}${item.href}` : undefined
    }))
  };

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        {allItems.map((item, index) => (
          <React.Fragment key={item.position}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.name}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}