"use client";

import { fetchNews } from "@/lib/api/news-api";
import { News } from "@/types/news";
import { Clock, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type NewsGridProps = {
  section?: string;
  subSection?: string;
};

export function NewsGrid({ section, subSection }: NewsGridProps) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: "năm", seconds: 31536000 },
      { label: "tháng", seconds: 2592000 },
      { label: "ngày", seconds: 86400 },
      { label: "giờ", seconds: 3600 },
      { label: "phút", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label} trước`;
      }
    }

    return "Vừa xong";
  }

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await fetchNews({
          sections: section
            ? subSection
              ? [`${section}/${subSection}`]
              : [section]
            : [],
          limit: 20,
          order_by: "published_time",
          order_dir: "DESC",
        });
        setNews((data as any).items || data || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [section, subSection]);

  if (loading) return <p className="text-center py-8">Đang tải tin tức...</p>;

  if (news.length === 0)
    return (
      <p className="text-center py-8 text-muted-foreground">
        Chưa có bài viết nào.
      </p>
    );

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group cursor-pointer block"
          >
            <div className="relative overflow-hidden rounded-lg mb-4">
              {/* Thumbnail */}
              <img
                src={article.thumbnail || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />

              {/* Overlay hiển thị lượt xem */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                <Eye className="w-3 h-3" />
                <span>{article.view_count ?? 0}</span>
              </div>
            </div>

            {/* Nội dung */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {article.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{timeAgo(article.published_time)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
