import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { 
  FeaturedArticle,
  CategoryTabs,
  ArticleGrid,
} from "@/components/articles";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useApiImmediate } from "@/hooks";
import { fetchLatestNews, fetchCategories, type ArticleDetail } from "@/api/client";
import { AlertCircle } from "lucide-react";

export function HomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Fetch latest news (20 articles for homepage)
  const { 
    data: articles, 
    loading: articlesLoading, 
    error: articlesError,
    refetch: refetchArticles 
  } = useApiImmediate((signal) => fetchLatestNews(20, signal));

  // Fetch categories
  const { 
    data: categoriesData, 
    loading: categoriesLoading 
  } = useApiImmediate((signal) => fetchCategories(signal));

  // Prepare categories with "all" option
  const categories: string[] = categoriesData ? ["all", ...categoriesData] : ["all"];

  // Get featured article (first article)
  const featuredArticle: ArticleDetail | null = articles && articles.length > 0 ? articles[0] : null;

  // Filter articles (exclude featured article from grid)
  const gridArticles: ArticleDetail[] = articles 
    ? articles.slice(1).filter((article: ArticleDetail) => 
        activeCategory === "all" || article.category === activeCategory
      )
    : [];

  const handleArticleClick = (article: ArticleDetail): void => {
    navigate(`/article/${article.id}`);
  };

  const handleCategoryChange = (category: string): void => {
    setActiveCategory(category);
    if (category !== "all") {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };

  // Loading state
  if (articlesLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Featured Article Skeleton */}
          <div className="mb-12">
            <Skeleton className="w-full h-96 rounded-lg" />
            <Skeleton className="w-3/4 h-8 mt-4" />
            <Skeleton className="w-1/2 h-4 mt-2" />
          </div>

          {/* Category Tabs Skeleton */}
          <div className="mb-8">
            <Skeleton className="w-48 h-10 mb-6" />
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="w-24 h-10 rounded-full" />
              ))}
            </div>
          </div>

          {/* Articles Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (articlesError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Failed to Load News</h1>
          <p className="text-muted-foreground mb-8">
            {articlesError.message || "An error occurred while fetching the latest news."}
          </p>
          <Button onClick={() => refetchArticles()}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  // Empty state
  if (!articles || articles.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">No News Available</h1>
          <p className="text-muted-foreground mb-8">
            There are no articles to display at the moment. Please check back later.
          </p>
          <Button onClick={() => refetchArticles()}>
            Refresh
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Featured Article Hero */}
        {featuredArticle && (
          <div className="mb-12">
            <FeaturedArticle 
              article={featuredArticle} 
              onClick={handleArticleClick}
            />
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground border-l-4 border-crunchyroll-orange pl-4">
              Latest News
            </h2>
          </div>
          {categoriesLoading ? (
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="w-24 h-10 rounded-full" />
              ))}
            </div>
          ) : (
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>

        {/* Articles Grid */}
        {gridArticles.length > 0 ? (
          <ArticleGrid 
            articles={gridArticles}
            onArticleClick={handleArticleClick}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

