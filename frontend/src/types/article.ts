/**
 * Article type matching backend data schema from backend/app/data/articles.json
 */
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: ArticleCategory;
  publishedAt: string; // ISO 8601 timestamp
  sourceUrl: string;
  tags: string[];
}

/**
 * Article categories from natalie.mu
 */
export type ArticleCategory =
  | "Exhibition"
  | "New Series"
  | "Anime"
  | "Event"
  | "Manga Release"
  | "Live-Action"
  | "Campaign"
  | "Movie";

/**
 * Response structure from backend API (future Phase 3)
 */
export interface ArticlesResponse {
  articles: Article[];
}

/**
 * Pagination parameters for API requests
 */
export interface ArticlePaginationParams {
  page?: number;
  limit?: number;
  category?: ArticleCategory;
  search?: string;
}

/**
 * Utility type for article preview (used in cards/lists)
 */
export interface ArticlePreview extends Pick<Article, "id" | "title" | "summary" | "imageUrl" | "category" | "publishedAt" | "tags"> {}

/**
 * Utility type for article detail view
 */
export interface ArticleDetail extends Article {
  formattedDate: string;
  readingTime: number; // in minutes
}

