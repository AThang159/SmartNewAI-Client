"use client";

import { Badge } from "@/components/ui/badge";
import { fetchNews } from "@/lib/api/news-api";
import { News } from "@/types/news";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

type NewsGridProps = {
  section?: string;
  subSection?: string;
};

export function NewsGrid({ section, subSection }: NewsGridProps) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        let data = await fetchNews({
          sections: section
            ? subSection
              ? [`${section}/${subSection}`]
              : [section]
            : [],
        });
        console.log(data);
        setNews((data as any).items || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [section, subSection]);

  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Breaking News Banner */}
      <div className="mb-8">
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-white text-destructive font-bold"
            >
              BREAKING
            </Badge>
            <span className="font-medium">
              Trump's UK State Visit: King Charles Hosts Ceremonies at Windsor
              Castle
            </span>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Top Stories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {news.map((article, index) => {
            const articleClasses =
              index === 0
                ? "group cursor-pointer lg:col-span-2"
                : "group cursor-pointer";
            const imageClasses =
              index === 0
                ? "w-full object-cover transition-transform group-hover:scale-105 h-80"
                : "w-full object-cover transition-transform group-hover:scale-105 h-60";
            const titleClasses =
              index === 0
                ? "font-bold text-foreground group-hover:text-primary transition-colors text-balance text-2xl"
                : "font-bold text-foreground group-hover:text-primary transition-colors text-balance text-xl";

            return (
              <article key={article.id} className={articleClasses}>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={article.thumbnail || "/placeholder.svg"}
                    alt={article.title}
                    className={imageClasses}
                  />
                  {article.section}
                </div>
                <div className="space-y-2">
                  <h3 className={titleClasses}>{article.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{article.published_time}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* More News */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">More News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={article.thumbnail || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <Badge
                  variant="secondary"
                  className="absolute bottom-4 left-4 bg-background/90 text-foreground"
                >
                  {article.section}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors text-balance">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                  {article.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{article.published_time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
