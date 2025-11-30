import type { Article, ArticleDetail } from "@/types/article";

/**
 * Format ISO 8601 timestamp to human-readable date
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string (e.g., "November 30, 2025")
 */
export function formatArticleDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format ISO 8601 timestamp to relative time
 * @param isoDate - ISO 8601 date string
 * @returns Relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  return formatArticleDate(isoDate);
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Calculate estimated reading time based on word count
 * @param content - Article content text
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Convert Article to ArticleDetail with additional computed properties
 * @param article - Base article object
 * @returns Article with formatted date and reading time
 */
export function toArticleDetail(article: Article): ArticleDetail {
  return {
    ...article,
    formattedDate: formatArticleDate(article.publishedAt),
    readingTime: calculateReadingTime(article.content),
  };
}

/**
 * Filter articles by category
 * @param articles - Array of articles
 * @param category - Category to filter by
 * @returns Filtered articles
 */
export function filterByCategory(
  articles: Article[],
  category: string
): Article[] {
  return articles.filter((article) => article.category === category);
}

/**
 * Filter articles by tag
 * @param articles - Array of articles
 * @param tag - Tag to filter by
 * @returns Filtered articles
 */
export function filterByTag(articles: Article[], tag: string): Article[] {
  return articles.filter((article) => article.tags.includes(tag));
}

/**
 * Search articles by title, summary, or tags
 * @param articles - Array of articles
 * @param query - Search query
 * @returns Filtered articles matching the query
 */
export function searchArticles(articles: Article[], query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Sort articles by date (newest first)
 * @param articles - Array of articles
 * @returns Sorted articles
 */
export function sortByDateDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Sort articles by date (oldest first)
 * @param articles - Array of articles
 * @returns Sorted articles
 */
export function sortByDateAsc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
}

/**
 * Get unique categories from articles
 * @param articles - Array of articles
 * @returns Array of unique categories
 */
export function getUniqueCategories(articles: Article[]): string[] {
  return Array.from(new Set(articles.map((article) => article.category)));
}

/**
 * Get unique tags from articles
 * @param articles - Array of articles
 * @returns Array of unique tags
 */
export function getUniqueTags(articles: Article[]): string[] {
  const tags = articles.flatMap((article) => article.tags);
  return Array.from(new Set(tags));
}

/**
 * Get the most recent N articles
 * @param articles - Array of articles
 * @param count - Number of articles to return
 * @returns Most recent articles
 */
export function getLatestArticles(articles: Article[], count: number): Article[] {
  return sortByDateDesc(articles).slice(0, count);
}

