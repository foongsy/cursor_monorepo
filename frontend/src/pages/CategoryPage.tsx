import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ArticleGrid } from "@/components/articles";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useApiImmediate } from "@/hooks";
import { fetchNewsByCategory, type ArticleDetail } from "@/api/client";

export function CategoryPage(): React.JSX.Element {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  
  const categoryName: string = name ? decodeURIComponent(name) : "";
  
  // Fetch articles by category
  const { 
    data: articles, 
    loading, 
    error,
    refetch 
  } = useApiImmediate((signal) => fetchNewsByCategory(categoryName, signal));

  const handleArticleClick = (article: ArticleDetail): void => {
    navigate(`/article/${article.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Back Button Skeleton */}
          <Skeleton className="w-32 h-10 mb-6" />

          {/* Category Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="w-64 h-10 mb-2" />
            <Skeleton className="w-32 h-6" />
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
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            {error.message.includes('404') ? 'Category Not Found' : 'Failed to Load Articles'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {error.message.includes('404')
              ? `The category "${categoryName}" doesn't exist or is not available.`
              : error.message || "An error occurred while fetching articles."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            {!error.message.includes('404') && (
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground border-l-4 border-crunchyroll-orange pl-4 mb-2">
            {categoryName}
          </h1>
          <p className="text-muted-foreground pl-4">
            {articles ? articles.length : 0} {articles && articles.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* Articles Grid */}
        {articles && articles.length > 0 ? (
          <ArticleGrid 
            articles={articles}
            onArticleClick={handleArticleClick}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No articles found in this category.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/")}
            >
              Browse All News
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

