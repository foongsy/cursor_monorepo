import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ArticleGrid } from "@/components/articles";
import { getSampleArticles } from "@/data/sampleArticles";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/types";

export function CategoryPage(): React.JSX.Element {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const allArticles = getSampleArticles();
  
  const categoryName = name ? decodeURIComponent(name) : "";
  
  const filteredArticles: Article[] = allArticles.filter(
    (article: Article) => article.category === categoryName
  );

  const handleArticleClick = (article: Article): void => {
    navigate(`/article/${article.id}`);
  };

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
            {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <ArticleGrid 
            articles={filteredArticles}
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

