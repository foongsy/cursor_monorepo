import type { Article } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatArticleDate, calculateReadingTime } from "@/utils/articleUtils"
import { PlayCircle, Clock } from "lucide-react"

interface FeaturedArticleProps {
  article: Article
  onClick?: (article: Article) => void
}

export const FeaturedArticle = ({ article, onClick }: FeaturedArticleProps) => {
  return (
    <div 
      className="relative w-full aspect-[21/9] min-h-[400px] rounded-xl overflow-hidden group cursor-pointer shadow-xl"
      onClick={() => onClick?.(article)}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-10">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <Badge className="bg-crunchyroll-orange hover:bg-crunchyroll-orange-dark text-white border-none text-sm py-1">
              {article.category}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-gray-200">
              <Clock className="w-3 h-3" />
              {formatArticleDate(article.publishedAt)}
            </span>
            <span className="text-sm text-gray-300">• {calculateReadingTime(article.content)} min read</span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-crunchyroll-orange transition-colors line-clamp-2 drop-shadow-lg">
            {article.title}
          </h1>

          <p className="text-gray-200 text-sm md:text-base lg:text-lg line-clamp-2 md:line-clamp-3 max-w-3xl drop-shadow-md">
            {article.summary}
          </p>

          <div className="pt-4">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-crunchyroll-orange hover:text-white transition-all font-bold gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Read Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

