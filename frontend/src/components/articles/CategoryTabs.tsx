import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  className?: string
}

export const CategoryTabs = ({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  className 
}: CategoryTabsProps) => {
  return (
    <Tabs 
      value={activeCategory} 
      onValueChange={onCategoryChange}
      className={cn("w-full", className)}
    >
      <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
        <TabsTrigger 
          value="all"
          className="data-[state=active]:bg-crunchyroll-orange data-[state=active]:text-white border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background hover:bg-muted transition-colors rounded-full px-4 py-1.5 h-auto text-sm"
        >
          All News
        </TabsTrigger>
        
        {categories.map(category => (
          <TabsTrigger
            key={category}
            value={category}
            className="data-[state=active]:bg-crunchyroll-orange data-[state=active]:text-white border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background hover:bg-muted transition-colors rounded-full px-4 py-1.5 h-auto text-sm"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

