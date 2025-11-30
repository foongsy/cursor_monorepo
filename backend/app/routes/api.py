from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.models import ArticleDetail, ArticleCategory, ArticlesResponse
from app.services import get_article_service

router = APIRouter()


@router.get("/news", response_model=ArticlesResponse)
async def get_news(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    category: Optional[ArticleCategory] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query"),
    sort_by: str = Query("publishedAt", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
) -> ArticlesResponse:
    """
    Get paginated list of news articles with filtering and sorting.
    
    - **page**: Page number (starting from 1)
    - **limit**: Number of items per page (max 100)
    - **category**: Optional category filter
    - **search**: Optional search query (searches in title and summary)
    - **sort_by**: Field to sort by (publishedAt, title, category)
    - **sort_order**: Sort order (asc or desc)
    """
    service = get_article_service()
    return service.get_articles(
        page=page,
        limit=limit,
        category=category,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/news/latest", response_model=list[ArticleDetail])
async def get_latest_news(
    limit: int = Query(10, ge=1, le=50, description="Number of latest articles")
) -> list[ArticleDetail]:
    """
    Get the latest news articles.
    
    - **limit**: Maximum number of articles to return (max 50)
    """
    service = get_article_service()
    articles = service.get_recent_articles(limit=limit)
    return [ArticleDetail.from_article(a) for a in articles]


@router.get("/news/category/{name}", response_model=list[ArticleDetail])
async def get_news_by_category(name: str) -> list[ArticleDetail]:
    """
    Get all news articles in a specific category.
    
    - **name**: The category name (e.g., "Anime", "Exhibition", "Movie")
    """
    service = get_article_service()
    
    # Try to find matching category (case-insensitive)
    try:
        category = ArticleCategory(name)
    except ValueError:
        # Try case-insensitive match
        matching_category = None
        for cat in ArticleCategory:
            if cat.value.lower() == name.lower():
                matching_category = cat
                break
        
        if not matching_category:
            raise HTTPException(
                status_code=404, 
                detail=f"Category '{name}' not found. Available categories: {', '.join([c.value for c in ArticleCategory])}"
            )
        category = matching_category
    
    articles = service.get_articles_by_category(category)
    return [ArticleDetail.from_article(a) for a in articles]


@router.get("/news/{id}", response_model=ArticleDetail)
async def get_news_detail(id: str) -> ArticleDetail:
    """
    Get detailed news article by ID with computed fields.
    
    - **id**: The unique article identifier
    """
    service = get_article_service()
    article = service.get_article_by_id(id)
    
    if not article:
        raise HTTPException(status_code=404, detail=f"Article {id} not found")
    
    return ArticleDetail.from_article(article)


@router.get("/categories", response_model=list[str])
async def get_categories() -> list[str]:
    """
    Get list of all available article categories.
    """
    service = get_article_service()
    return service.get_categories()

