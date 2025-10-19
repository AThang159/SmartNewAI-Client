"use client";

import { fetchNewsDetail, increaseNewsView } from "@/lib/api/news-api";
import { News } from "@/types/news";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArticlePage() {
  const { slug } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [articleBody, setArticleBody] = useState<string[]>([]);

  useEffect(() => {
    async function getArticle() {
      try {
        const data = await fetchNewsDetail(slug as string);

        let parsedArticle: any = data.article;
        if (typeof parsedArticle === "string") {
          try {
            parsedArticle = JSON.parse(parsedArticle);
          } catch (err) {
            console.error("Không parse được article JSON:", err);
          }
        }

        if (data?.id) {
          await increaseNewsView(data.id);
        }

        setNews(data);
        if (Array.isArray(parsedArticle?.ArticleBody)) {
          setArticleBody(parsedArticle.ArticleBody);
        }
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) getArticle();
  }, [slug]);

  if (loading) return <p className="p-4 text-gray-500">Đang tải bài viết...</p>;
  if (!news || articleBody.length === 0)
    return <p className="p-4 text-red-500">Không có dữ liệu bài viết.</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <article className="prose prose-lg bg-white text-black p-6 rounded-2xl shadow-md">
        {articleBody.map((html, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </article>
    </main>
  );
}
