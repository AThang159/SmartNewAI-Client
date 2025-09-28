import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock } from "lucide-react"

interface TrendingArticle {
  id: string
  title: string
  category: string
  timestamp: string
  readTime: string
}

const trendingArticles: TrendingArticle[] = [
  {
    id: "1",
    title: "Global Markets Rally on Fed Rate Cut Expectations",
    category: "Markets",
    timestamp: "1 hour ago",
    readTime: "3 min read",
  },
  {
    id: "2",
    title: "Tech Giants Report Strong Q4 Earnings",
    category: "Technology",
    timestamp: "3 hours ago",
    readTime: "5 min read",
  },
  {
    id: "3",
    title: "Climate Summit Reaches Historic Agreement",
    category: "World",
    timestamp: "5 hours ago",
    readTime: "4 min read",
  },
  {
    id: "4",
    title: "Cryptocurrency Regulation Updates",
    category: "Business",
    timestamp: "7 hours ago",
    readTime: "2 min read",
  },
  {
    id: "5",
    title: "Space Mission Launches Successfully",
    category: "Technology",
    timestamp: "9 hours ago",
    readTime: "3 min read",
  },
]

export function TrendingSidebar() {
  return (
    <aside className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
      </div>

      <div className="space-y-4">
        {trendingArticles.map((article, index) => (
          <article key={article.id} className="group cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="text-2xl font-bold text-muted-foreground/50 mt-1">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight text-balance">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{article.timestamp}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{article.readTime}</span>
              </div>
            </div>
            {index < trendingArticles.length - 1 && <hr className="border-border mt-4" />}
          </article>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <button className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All Trending Stories →
        </button>
      </div>
    </aside>
  )
}
