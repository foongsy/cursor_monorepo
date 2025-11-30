import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, Calendar, Tag, AlertCircle } from "lucide-react";
import { useApiImmediate } from "@/hooks";
import { fetchNewsById } from "@/api/client";

export function ArticleDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch article by ID
  const { 
    data: article, 
    loading, 
    error,
    refetch 
  } = useApiImmediate((signal) => fetchNewsById(id || "", signal));

  // Loading state
  if (loading) {
    return (
      <Layout>
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button Skeleton */}
          <Skeleton className="w-24 h-10 mb-6" />

          {/* Article Header Skeleton */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-24 h-6 rounded-full" />
              <Skeleton className="w-32 h-4" />
            </div>
            <Skeleton className="w-full h-12 mb-4" />
            <Skeleton className="w-3/4 h-12 mb-2" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-2/3 h-6" />
          </header>

          {/* Featured Image Skeleton */}
          <Skeleton className="w-full h-96 rounded-lg mb-8" />

          {/* Content Skeleton */}
          <div className="space-y-3 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="w-full h-4" />
            ))}
            <Skeleton className="w-3/4 h-4" />
          </div>
        </article>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            {error.message.includes('404') ? 'Article Not Found' : 'Failed to Load Article'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {error.message.includes('404')
              ? "The article you're looking for doesn't exist or has been removed."
              : error.message || "An error occurred while fetching the article."}
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

  // Article not found (shouldn't happen with proper error handling, but just in case)
  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </Layout>
    );
  }

  // Use formatted date from API or format it
  const publishedDate: string = article.formattedDate || new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{article.category}</Badge>
            <span className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {publishedDate}
            </span>
            {article.readingTime && (
              <span className="text-sm text-muted-foreground">
                {article.readingTime} min read
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {article.summary}
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <div className="whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 items-center">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Source Link */}
        <div className="pt-8 border-t">
          <a 
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-crunchyroll-orange hover:underline"
          >
            View original article on natalie.mu
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* Related Category */}
        <div className="mt-8 pt-8 border-t">
          <Link 
            to={`/category/${encodeURIComponent(article.category)}`}
            className="inline-block"
          >
            <Button variant="outline">
              More from {article.category}
            </Button>
          </Link>
        </div>
      </article>
    </Layout>
  );
}

