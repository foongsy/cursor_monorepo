"""
Article service layer for business logic and data access.
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Optional

from app.models import Article, ArticleCategory, ArticlesResponse


class ArticleService:
    """
    Service class for article-related operations.
    Handles data loading, filtering, sorting, and pagination with in-memory caching.
    """

    def __init__(self, data_path: Optional[Path] = None) -> None:
        """
        Initialize the ArticleService.

        Args:
            data_path: Optional custom path to articles.json. If None, uses default location.
        """
        if data_path is None:
            # Default path relative to this file
            self._data_path = (
                Path(__file__).parent.parent / "data" / "articles.json"
            )
        else:
            self._data_path = data_path

        # In-memory cache
        self._articles_cache: Optional[list[Article]] = None
        self._cache_timestamp: Optional[datetime] = None

    def _load_articles(self, force_reload: bool = False) -> list[Article]:
        """
        Load articles from JSON file with caching.

        Args:
            force_reload: If True, bypass cache and reload from file.

        Returns:
            List of Article objects.

        Raises:
            FileNotFoundError: If articles.json doesn't exist.
            ValueError: If JSON is malformed or validation fails.
        """
        # Return cached data if available and not forcing reload
        if not force_reload and self._articles_cache is not None:
            return self._articles_cache

        # Load from file
        if not self._data_path.exists():
            raise FileNotFoundError(f"Articles data file not found: {self._data_path}")

        with open(self._data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Parse and validate articles using Pydantic models
        articles = [Article(**article_data) for article_data in data["articles"]]

        # Update cache
        self._articles_cache = articles
        self._cache_timestamp = datetime.now()

        return articles

    def get_articles(
        self,
        page: int = 1,
        limit: int = 20,
        category: Optional[ArticleCategory] = None,
        search: Optional[str] = None,
        sort_by: str = "publishedAt",
        sort_order: str = "desc",
    ) -> ArticlesResponse:
        """
        Get paginated and filtered articles.

        Args:
            page: Page number (starting from 1).
            limit: Number of items per page.
            category: Optional category filter.
            search: Optional search query (searches in title and summary).
            sort_by: Field to sort by (default: publishedAt).
            sort_order: Sort order, "asc" or "desc" (default: desc).

        Returns:
            ArticlesResponse with paginated articles and metadata.
        """
        # Load all articles
        articles = self._load_articles()

        # Filter by category
        if category:
            articles = [a for a in articles if a.category == category]

        # Filter by search query (case-insensitive search in title and summary)
        if search:
            search_lower = search.lower()
            articles = [
                a
                for a in articles
                if search_lower in a.title.lower() or search_lower in a.summary.lower()
            ]

        # Sort articles
        reverse = sort_order.lower() == "desc"
        if sort_by == "publishedAt":
            articles = sorted(articles, key=lambda x: x.publishedAt, reverse=reverse)
        elif sort_by == "title":
            articles = sorted(articles, key=lambda x: x.title.lower(), reverse=reverse)
        elif sort_by == "category":
            articles = sorted(articles, key=lambda x: x.category.value, reverse=reverse)

        # Calculate pagination
        total = len(articles)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_articles = articles[start_idx:end_idx]

        return ArticlesResponse(
            articles=paginated_articles,
            total=total,
            page=page,
            limit=limit,
        )

    def get_article_by_id(self, article_id: str) -> Optional[Article]:
        """
        Get a single article by its ID.

        Args:
            article_id: The unique article identifier.

        Returns:
            Article object if found, None otherwise.
        """
        articles = self._load_articles()
        return next((a for a in articles if a.id == article_id), None)

    def get_categories(self) -> list[str]:
        """
        Get list of all available article categories.

        Returns:
            List of category names.
        """
        return [category.value for category in ArticleCategory]

    def get_articles_by_category(self, category: ArticleCategory) -> list[Article]:
        """
        Get all articles in a specific category.

        Args:
            category: The category to filter by.

        Returns:
            List of articles in the specified category.
        """
        articles = self._load_articles()
        return [a for a in articles if a.category == category]

    def search_articles(self, query: str, limit: Optional[int] = None) -> list[Article]:
        """
        Search articles by query string in title, summary, and tags.

        Args:
            query: Search query string.
            limit: Optional maximum number of results to return.

        Returns:
            List of matching articles, sorted by relevance (publishedAt desc).
        """
        articles = self._load_articles()
        query_lower = query.lower()

        # Filter articles that match the query
        matching_articles = [
            a
            for a in articles
            if (
                query_lower in a.title.lower()
                or query_lower in a.summary.lower()
                or any(query_lower in tag.lower() for tag in a.tags)
            )
        ]

        # Sort by published date (newest first)
        matching_articles = sorted(
            matching_articles, key=lambda x: x.publishedAt, reverse=True
        )

        # Apply limit if specified
        if limit:
            matching_articles = matching_articles[:limit]

        return matching_articles

    def get_recent_articles(self, limit: int = 10) -> list[Article]:
        """
        Get the most recent articles.

        Args:
            limit: Maximum number of articles to return.

        Returns:
            List of recent articles, sorted by publishedAt (newest first).
        """
        articles = self._load_articles()
        sorted_articles = sorted(articles, key=lambda x: x.publishedAt, reverse=True)
        return sorted_articles[:limit]

    def clear_cache(self) -> None:
        """
        Clear the in-memory article cache.
        Useful for forcing a reload of data from file.
        """
        self._articles_cache = None
        self._cache_timestamp = None

    def get_cache_info(self) -> dict[str, Optional[datetime | int]]:
        """
        Get information about the current cache state.

        Returns:
            Dictionary with cache timestamp and article count.
        """
        return {
            "cached_at": self._cache_timestamp,
            "article_count": len(self._articles_cache) if self._articles_cache else 0,
        }


# Singleton instance for dependency injection
_article_service_instance: Optional[ArticleService] = None


def get_article_service() -> ArticleService:
    """
    Get or create the singleton ArticleService instance.
    Used for dependency injection in FastAPI routes.

    Returns:
        The singleton ArticleService instance.
    """
    global _article_service_instance
    if _article_service_instance is None:
        _article_service_instance = ArticleService()
    return _article_service_instance

