import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"

interface CategoryArticle {
  id: string
  title: string
  summary: string
  timestamp: string
  imageUrl?: string
}

interface CategorySection {
  name: string
  articles: CategoryArticle[]
}

const categorySections: CategorySection[] = [
  {
    name: "Technology",
    articles: [
      {
        id: "tech1",
        title: "AI Revolution Transforms Global Industries",
        summary:
          "Artificial intelligence adoption accelerates across sectors, reshaping business operations and workforce dynamics.",
        timestamp: "2 hours ago",
        imageUrl: "/artificial-intelligence-technology.png",
      },
      {
        id: "tech2",
        title: "Quantum Computing Breakthrough Announced",
        summary:
          "Scientists achieve new milestone in quantum processing power, promising advances in cryptography and research.",
        timestamp: "4 hours ago",
      },
      {
        id: "tech3",
        title: "Social Media Platforms Face New Regulations",
        summary: "Governments worldwide implement stricter data privacy and content moderation requirements.",
        timestamp: "6 hours ago",
      },
    ],
  },
  {
    name: "Business",
    articles: [
      {
        id: "biz1",
        title: "Global Supply Chain Disruptions Continue",
        summary: "International trade faces ongoing challenges as companies adapt to new logistics realities.",
        timestamp: "1 hour ago",
        imageUrl: "/global-supply-chain-shipping-containers.jpg",
      },
      {
        id: "biz2",
        title: "Renewable Energy Investment Surges",
        summary: "Clean energy projects attract record funding as companies commit to sustainability goals.",
        timestamp: "3 hours ago",
      },
      {
        id: "biz3",
        title: "Merger Activity Reaches New Heights",
        summary: "Corporate consolidation accelerates across multiple industries amid economic uncertainty.",
        timestamp: "5 hours ago",
      },
    ],
  },
]

export function CategorySections() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="space-y-12">
        {categorySections.map((section) => (
          <div key={section.name}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{section.name}</h2>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <span className="text-sm font-medium">View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.articles.map((article, index) => {
                const articleClasses = index === 0 ? "group cursor-pointer md:col-span-2" : "group cursor-pointer"
                const imageClasses =
                  index === 0
                    ? "w-full object-cover transition-transform group-hover:scale-105 h-64"
                    : "w-full object-cover transition-transform group-hover:scale-105 h-48"
                const titleClasses =
                  index === 0
                    ? "font-bold text-foreground group-hover:text-primary transition-colors text-balance text-xl"
                    : "font-bold text-foreground group-hover:text-primary transition-colors text-balance text-lg"

                return (
                  <article key={article.id} className={articleClasses}>
                    {article.imageUrl && (
                      <div className="relative overflow-hidden rounded-lg mb-4">
                        <img
                          src={article.imageUrl || "/placeholder.svg"}
                          alt={article.title}
                          className={imageClasses}
                        />
                        <Badge
                          variant="secondary"
                          className="absolute bottom-4 left-4 bg-background/90 text-foreground"
                        >
                          {section.name}
                        </Badge>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className={titleClasses}>{article.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-pretty">{article.summary}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{article.timestamp}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
