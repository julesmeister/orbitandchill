import { useEffect } from "react";
import { DiscussionTemp } from "../types/threads";
import { BRAND } from "../config/brand";

export const useDiscussionMeta = (discussion: DiscussionTemp | undefined) => {
  useEffect(() => {
    if (discussion) {
      const truncatedContent =
        discussion.content?.substring(0, 160) || discussion.excerpt;
      const cleanContent = truncatedContent
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*/g, "");

      document.title = `${discussion.title} - ${BRAND.name} Discussions`;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", cleanContent);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = cleanContent;
        document.head.appendChild(meta);
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const keywords = [
        "astrology",
        "discussion",
        "community",
        ...discussion.tags,
        discussion.category.toLowerCase(),
      ].join(", ");

      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        const meta = document.createElement("meta");
        meta.name = "keywords";
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }
  }, [discussion]);
};
