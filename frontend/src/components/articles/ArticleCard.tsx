import type { Article } from "@/types"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  formatArticleDate, 
  formatRelativeTime, 
  truncateText, 
  calculateReadingTime 
} from "@/utils/articleUtils"

interface ArticleCardProps {
  article: Article
  onClick?: (article: Article) => void
}

export const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  return (
    <Card 
      className="flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden"
      onClick={() => onClick?.(article)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/90 hover:bg-background">
            {article.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground font-medium text-crunchyroll-orange">
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>
        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-crunchyroll-orange transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 flex-1">
        <CardDescription className="line-clamp-3 text-sm">
          {truncateText(article.summary, 100)}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {article.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1 h-5 text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center border-t bg-muted/5 py-2 mt-auto">
        <span>{formatArticleDate(article.publishedAt)}</span>
        <span>{calculateReadingTime(article.content)} min read</span>
      </CardFooter>
    </Card>
  )
}

