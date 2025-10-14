"use client";

import { Badge } from "@/components/ui/badge";
import { fetchNews, fetchSections } from "@/lib/api/news-api";
import { News } from "@/types/news";
import { Section } from "@/types/section";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SectionWithNews extends Section {
  newsList?: News[];
}

export default function CategorySections() {
  const [sections, setSections] = useState<SectionWithNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const sectionData = await fetchSections();

        const sectionPromises = sectionData.map(async (section) => {
          const dataNewsList = await fetchNews({
            sections: [section.label],
            limit: 4,
            order_by: "published_time",
            order_dir: "DESC",
          });
          const newsList = dataNewsList.items;
          return { ...section, newsList };
        });

        const results = await Promise.all(sectionPromises);
        console.log(results);
        setSections(results);
      } catch (error) {
        console.error("Lỗi khi load section/news:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        Đang tải danh mục tin tức...
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 space-y-16">
      {sections.map((section) => {
        const newsList = section.newsList || [];

        return (
          <div key={section.label}>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {section.label}
              </h2>
              <Link
                href={section.href}
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Danh sách tin */}
            {newsList.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Chưa có tin nào trong mục này.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newsList.map((news) => (
                  <Link
                    href={`/news/${news.slug}`}
                    key={news.id}
                    className="group block rounded-lg overflow-hidden border border-border hover:shadow-md transition-all duration-200"
                  >
                    {news.thumbnail && (
                      <div className="relative overflow-hidden">
                        <img
                          src={news.thumbnail}
                          alt={news.title}
                          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Badge className="absolute bottom-2 left-2 bg-background/80 text-foreground text-xs">
                          {section.label}
                        </Badge>
                      </div>
                    )}

                    <div className="p-3 space-y-2">
                      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground text-xs line-clamp-2">
                        {news.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(news.published_time).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
