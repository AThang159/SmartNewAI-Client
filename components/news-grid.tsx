import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  summary: string
  category: string
  timestamp: string
  imageUrl: string
  isFeatured?: boolean
  isBreaking?: boolean
}

const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Trump's UK State Visit: King Charles Hosts Ceremonies at Windsor Castle",
    summary:
      "President Trump is currently in Britain for a second state visit, with the UK and US agreeing on a $42 billion tech pact during high-level discussions.",
    category: "World",
    timestamp: "2 hours ago",
    imageUrl: "/uk-state-visit-windsor-castle-ceremony.jpg",
    isFeatured: true,
    isBreaking: true,
  },
  {
    id: "2",
    title: "China's Auto Industry Faces Tailspin Due to Government Overinvestment",
    summary:
      "Investigation reveals how government policies prioritizing production targets over market demand have led to overinvestment and a vehicle glut.",
    category: "Business",
    timestamp: "4 hours ago",
    imageUrl: "/china-auto-industry-factory-cars-production.jpg",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Federal Reserve Expected to Cut Rates Amid Economic Uncertainty",
    summary:
      "Multiple analysts predict Fed rate cuts could impact stock markets and economic recovery in the coming months.",
    category: "Markets",
    timestamp: "6 hours ago",
    imageUrl: "/federal-reserve-building-economics-finance.jpg",
  },
  {
    id: "4",
    title: "EU Firms Brace for Shutdowns Due to China's Rare Earth Controls",
    summary:
      "European companies face potential operational challenges as China tightens control over rare earth mineral exports.",
    category: "Business",
    timestamp: "8 hours ago",
    imageUrl: "/rare-earth-minerals-mining-industrial.jpg",
  },
  {
    id: "5",
    title: "Ukraine Aid: Trump Administration Clears First Arms Package",
    summary:
      "The administration has approved the first Ukraine arms aid package paid for by allied nations, marking a significant policy development.",
    category: "World",
    timestamp: "10 hours ago",
    imageUrl: "/ukraine-military-aid-international-diplomacy.jpg",
  },
  {
    id: "6",
    title: "Navalnaya Claims Foreign Tests Show Husband Was Poisoned",
    summary:
      "Yulia Navalnaya presents evidence from international laboratories regarding her husband's alleged poisoning incident.",
    category: "World",
    timestamp: "12 hours ago",
    imageUrl: "/international-politics-investigation-laboratory.jpg",
  },
]

export function NewsGrid() {
  const featuredArticles = newsArticles.filter((article) => article.isFeatured)
  const regularArticles = newsArticles.filter((article) => !article.isFeatured)

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Breaking News Banner */}
      <div className="mb-8">
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white text-destructive font-bold">
              BREAKING
            </Badge>
            <span className="font-medium">Trump's UK State Visit: King Charles Hosts Ceremonies at Windsor Castle</span>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Top Stories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredArticles.map((article, index) => {
            const articleClasses = index === 0 ? "group cursor-pointer lg:col-span-2" : "group cursor-pointer"
            const imageClasses =
              index === 0
                ? "w-full object-cover transition-transform group-hover:scale-105 h-80"
                : "w-full object-cover transition-transform group-hover:scale-105 h-60"
            const titleClasses =
              index === 0
                ? "font-bold text-foreground group-hover:text-primary transition-colors text-balance text-2xl"
                : "font-bold text-foreground group-hover:text-primary transition-colors text-balance text-xl"

            return (
              <article key={article.id} className={articleClasses}>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img src={article.imageUrl || "/placeholder.svg"} alt={article.title} className={imageClasses} />
                  {article.isBreaking && (
                    <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">BREAKING</Badge>
                  )}
                  <Badge variant="secondary" className="absolute bottom-4 left-4 bg-background/90 text-foreground">
                    {article.category}
                  </Badge>
                </div>
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

      {/* More News */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">More News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <Badge variant="secondary" className="absolute bottom-4 left-4 bg-background/90 text-foreground">
                  {article.category}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors text-balance">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{article.summary}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{article.timestamp}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
