import type { ArticleDetail } from "@/api/client"
import { ArticleCard } from "./ArticleCard"

interface ArticleGridProps {
  articles: ArticleDetail[]
  onArticleClick?: (article: ArticleDetail) => void
}

export const ArticleGrid = ({ articles, onArticleClick }: ArticleGridProps): React.JSX.Element => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No articles found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {articles.map((article: ArticleDetail) => (
        <div key={article.id} className="h-full">
          <ArticleCard 
            article={article} 
            onClick={onArticleClick} 
          />
        </div>
      ))}
    </div>
  )
}

