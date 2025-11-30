import { useState } from "react"
import { Layout } from "@/components/layout"
import { 
  FeaturedArticle,
  CategoryTabs,
  ArticleGrid,
} from "@/components/articles"
import { getSampleArticles } from "@/data/sampleArticles"
import { getUniqueCategories } from "@/utils/articleUtils"
import type { Article } from "@/types"

function App() {
  const allArticles = getSampleArticles()
  const categories = getUniqueCategories(allArticles)
  
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Get featured article (first article)
  const featuredArticle = allArticles[0]

  // Filter articles (exclude featured article from grid)
  const gridArticles = allArticles.slice(1).filter(article => 
    activeCategory === "all" || article.category === activeCategory
  )

  const handleArticleClick = (article: Article) => {
    console.log("Clicked article:", article.title)
    // Navigation logic will be added later
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Featured Article Hero */}
        <div className="mb-12">
          <FeaturedArticle 
            article={featuredArticle} 
            onClick={handleArticleClick}
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground border-l-4 border-crunchyroll-orange pl-4">
              Latest News
            </h2>
          </div>
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Articles Grid */}
        <ArticleGrid 
          articles={gridArticles}
          onArticleClick={handleArticleClick}
        />
      </div>
    </Layout>
  )
}

export default App
