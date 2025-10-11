"use client";

import { fetchNewsDetail } from "@/lib/api/news-api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ArticleResponse = {
  ArticleBody: string[];
};

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getArticle() {
      try {
        const data = await fetchNewsDetail(id);

        // ✅ Nếu server trả về JSON string, parse lại
        let parsedData = data?.article;
        if (typeof parsedData === "string") {
          try {
            parsedData = JSON.parse(parsedData);
          } catch (e) {
            console.error("Không parse được JSON:", e);
          }
        }

        setArticle(parsedData);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) getArticle();
  }, [id]);

  if (loading) return <p className="p-4 text-gray-500">Đang tải bài viết...</p>;
  if (!article || !Array.isArray(article.ArticleBody))
    return <p className="p-4 text-red-500">Không có dữ liệu bài viết.</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <article className="prose prose-lg bg-white text-black p-6 rounded-2xl shadow-md">
        {article.ArticleBody.map((html, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </article>
    </main>
  );
}
