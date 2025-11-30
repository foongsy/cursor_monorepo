"""
Article models for data validation and serialization.
"""
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl, field_validator


class ArticleCategory(str, Enum):
    """
    Article categories from natalie.mu
    """

    EXHIBITION = "Exhibition"
    NEW_SERIES = "New Series"
    ANIME = "Anime"
    EVENT = "Event"
    MANGA_RELEASE = "Manga Release"
    LIVE_ACTION = "Live-Action"
    CAMPAIGN = "Campaign"
    MOVIE = "Movie"


class Article(BaseModel):
    """
    Article model matching backend data schema from backend/app/data/articles.json
    """

    id: str = Field(..., description="Unique article identifier")
    title: str = Field(..., min_length=1, max_length=500, description="Article title")
    summary: str = Field(
        ..., min_length=1, max_length=1000, description="Brief article summary"
    )
    content: str = Field(..., min_length=1, description="Full article content")
    imageUrl: HttpUrl = Field(..., description="URL to article image")
    category: ArticleCategory = Field(..., description="Article category")
    publishedAt: datetime = Field(..., description="Publication timestamp (ISO 8601)")
    sourceUrl: HttpUrl = Field(..., description="Original source URL")
    tags: list[str] = Field(
        default_factory=list, description="List of article tags"
    )

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, v: list[str]) -> list[str]:
        """
        Validate that tags are non-empty strings and remove duplicates.
        """
        if v is None:
            return []
        # Filter out empty tags and strip whitespace
        cleaned_tags = [tag.strip() for tag in v if tag and tag.strip()]
        # Remove duplicates while preserving order
        seen = set()
        unique_tags = []
        for tag in cleaned_tags:
            if tag not in seen:
                seen.add(tag)
                unique_tags.append(tag)
        return unique_tags

    @field_validator("publishedAt", mode="before")
    @classmethod
    def parse_published_at(cls, v: str | datetime) -> datetime:
        """
        Parse publishedAt from ISO 8601 string to datetime.
        """
        if isinstance(v, datetime):
            return v
        if isinstance(v, str):
            return datetime.fromisoformat(v.replace("Z", "+00:00"))
        raise ValueError(f"Invalid publishedAt format: {v}")

    class Config:
        """Pydantic configuration"""

        json_schema_extra = {
            "example": {
                "id": "650043",
                "title": "Skip and Loafer Exhibition Reveals New Visual",
                "summary": "The Skip and Loafer Exhibition unveils a special exhibition anime visual.",
                "content": "The Skip and Loafer Exhibition based on Takamatsu Misaki's manga...",
                "imageUrl": "https://ogre.natalie.mu/media/news/comic/2025/1130/skipandloafer.jpg",
                "category": "Exhibition",
                "publishedAt": "2025-11-30T02:42:00Z",
                "sourceUrl": "https://natalie.mu/comic/news/650043",
                "tags": ["Skip and Loafer", "Exhibition", "Visual Reveal"],
            }
        }


class ArticlesResponse(BaseModel):
    """
    Response structure for article list endpoints.
    """

    articles: list[Article] = Field(..., description="List of articles")
    total: Optional[int] = Field(None, description="Total number of articles")
    page: Optional[int] = Field(None, description="Current page number")
    limit: Optional[int] = Field(None, description="Items per page")

    class Config:
        """Pydantic configuration"""

        json_schema_extra = {
            "example": {
                "articles": [],
                "total": 100,
                "page": 1,
                "limit": 20,
            }
        }


class ArticlePaginationParams(BaseModel):
    """
    Pagination parameters for article API requests.
    """

    page: int = Field(1, ge=1, description="Page number (starting from 1)")
    limit: int = Field(20, ge=1, le=100, description="Items per page (max 100)")
    category: Optional[ArticleCategory] = Field(
        None, description="Filter by category"
    )
    search: Optional[str] = Field(
        None, min_length=1, max_length=200, description="Search query"
    )


class ArticlePreview(BaseModel):
    """
    Utility model for article preview (used in cards/lists).
    Lighter version of Article with only essential fields.
    """

    id: str = Field(..., description="Unique article identifier")
    title: str = Field(..., description="Article title")
    summary: str = Field(..., description="Brief article summary")
    imageUrl: HttpUrl = Field(..., description="URL to article image")
    category: ArticleCategory = Field(..., description="Article category")
    publishedAt: datetime = Field(..., description="Publication timestamp")
    tags: list[str] = Field(default_factory=list, description="List of article tags")


class ArticleDetail(Article):
    """
    Utility model for article detail view.
    Extends Article with computed fields.
    """

    formattedDate: str = Field(..., description="Human-readable formatted date")
    readingTime: int = Field(..., ge=1, description="Estimated reading time in minutes")

    @classmethod
    def from_article(cls, article: Article) -> "ArticleDetail":
        """
        Create an ArticleDetail from an Article with computed fields.
        """
        # Calculate reading time (average 200 words per minute)
        word_count = len(article.content.split())
        reading_time = max(1, word_count // 200)

        # Format date
        formatted_date = article.publishedAt.strftime("%B %d, %Y")

        return cls(
            **article.model_dump(),
            formattedDate=formatted_date,
            readingTime=reading_time,
        )

