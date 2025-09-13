import { DiscussionTemp } from "../types/threads";
import { BRAND } from "../config/brand";

// Use centralized domain from brand config
const BASE_URL = BRAND.domain;

export const generateDiscussionStructuredData = (
  discussion: DiscussionTemp
) => {
  return {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: discussion.title,
    description: discussion.excerpt,
    author: {
      "@type": "Person",
      name: discussion.author,
    },
    dateCreated: "2024-12-13T00:00:00Z",
    dateModified: "2024-12-13T00:00:00Z",
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: discussion.views,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReplyAction",
        userInteractionCount: discussion.replies,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: discussion.upvotes,
      },
    ],
    about: {
      "@type": "Thing",
      name: discussion.category,
    },
    keywords: discussion.tags.join(", "),
    url: `${BASE_URL}/discussions/${discussion.id}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/discussions/${discussion.id}`,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      url: BASE_URL,
    },
  };
};
