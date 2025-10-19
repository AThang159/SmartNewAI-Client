"use client";

import { Badge } from "@/components/ui/badge";
import { fetchNews } from "@/lib/api/news-api";
import { News } from "@/types/news";
import { Clock, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// 🕒 Hàm hiển thị "x giờ trước"
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
    if (count >= 1) return `${count} ${interval.label} trước`;
  }

  return "Vừa xong";
}

export function TrendingSidebar() {
  const [articles, setArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        // 🗓️ Lấy khoảng thời gian của tháng hiện tại
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const data = await fetchNews({
          limit: 5,
          order_by: "view_count",
          order_dir: "DESC",
          date_from: firstDay.toISOString(),
          date_to: lastDay.toISOString(),
        });

        setArticles(data.items || data || []);
      } catch (err) {
        console.error("Lỗi khi tải trending news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  if (loading)
    return (
      <aside className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
        Đang tải tin nổi bật...
      </aside>
    );

  if (!articles || articles.length === 0)
    return (
      <aside className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
        Chưa có tin nổi bật trong tháng này.
      </aside>
    );

  return (
    <aside className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">
          🔥 Tin nổi bật tháng này
        </h2>
      </div>

      {/* Danh sách bài */}
      <div className="space-y-5">
        {articles.map((article, index) => (
          <Link
            href={`/news/${article.slug}`}
            key={article.id}
            className="group block"
          >
            <div className="flex items-start gap-3">
              {/* Thứ hạng */}
              <span className="text-2xl font-extrabold text-primary/70 mt-1 w-8 text-center">
                {(index + 1).toString().padStart(2, "0")}
              </span>

              <div className="flex-1 space-y-1">
                {/* Tiêu đề */}
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {article.title}
                </h3>

                {/* Phân loại + thời gian */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[11px]">
                    {article.section || "Tin tức"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo(article.published_time)}</span>
                  </div>
                </div>

                {/* View count */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{article.view_count} lượt xem</span>
                </div>
              </div>
            </div>

            {index < articles.length - 1 && (
              <hr className="border-border mt-4 opacity-60" />
            )}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-border">
        <Link
          href="/trending"
          className="block text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Xem tất cả tin nổi bật →
        </Link>
      </div>
    </aside>
  );
}
