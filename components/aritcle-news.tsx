"use client";

import { increaseNewsView } from "@/lib/api/news-api";
import { News } from "@/types/news";
import { useEffect, useState } from "react";

type Props = { news: News };

export default function ArticleNews({ news }: Props) {
  const [articleBody, setArticleBody] = useState<string[]>([]);
  const cleanHtmlSegment = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const selectors = [
      'a[data-testid="LicenceContentButton"]',
      'div[data-testid="ArticleToolbar"]',
      'p[data-testid="promo-box"]',
      'svg[data-testid="NewTabSymbol"]'
    ];
    selectors.forEach(sel => {
      doc.querySelectorAll(sel).forEach(el => el.remove());
    });

    return doc.body.innerHTML;
  };

  useEffect(() => {
    if (news?.id) increaseNewsView(news.id);

    if (typeof news.article === "string") {
      try {
        const parsed = JSON.parse(news.article);
        if (Array.isArray(parsed.ArticleBody)) {
          const cleaned = parsed.ArticleBody.map(cleanHtmlSegment);
          setArticleBody(cleaned);
        } 
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
    <main className="max-w-3xl mx-auto">
      <article className="prose prose-lg bg-white text-black p-6 shadow-md">
        {/* Khung thông tin cơ bản */}
        <header className="bg-white shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
            {news.title}
          </h1>

          <div className="text-right text-sm text-gray-600 mb-2">
            {news.published_time && (
              <p>Ngày đăng: {new Date(news.published_time).toLocaleDateString("vi-VN")}</p>
            )}
          </div>
        </header>
        {articleBody.map((html, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </article>
    </main>
  );
}
