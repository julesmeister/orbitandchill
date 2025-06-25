import { DiscussionTemp } from "../types/threads";

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
    url: `https://luckstrology.com/discussions/${discussion.id}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luckstrology.com/discussions/${discussion.id}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Luckstrology",
      url: "https://luckstrology.com",
    },
  };
};
