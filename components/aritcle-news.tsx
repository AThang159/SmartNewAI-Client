"use client";

import { increaseNewsView } from "@/lib/api/news-api";
import { News } from "@/types/news";
import { useEffect, useState } from "react";

type Props = { news: News };

export default function ArticleNews({ news }: Props) {
  const [articleBody, setArticleBody] = useState<string[]>([]);

  useEffect(() => {
    if (news?.id) increaseNewsView(news.id);

    if (typeof news.article === "string") {
      try {
        const parsed = JSON.parse(news.article);
        if (Array.isArray(parsed.ArticleBody)) setArticleBody(parsed.ArticleBody);
      } catch {
        console.error("Không parse được ArticleBody");
      }
    } else if (Array.isArray(news.article?.ArticleBody)) {
      setArticleBody(news.article.ArticleBody);
    }
  }, [news]);

  if (!articleBody.length)
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
