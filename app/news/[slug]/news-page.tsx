"use client";

import AnalysisBox from "@/components/analysis-box";
import ArticleNews from "@/components/aritcle-news";
import { Header } from "@/components/header";
import SentimentPieChart from "@/components/sentiment-pie-chart";
import { useAuth } from "@/context/auth-context";
import { fetchNewsDetail } from "@/lib/api/news-api";
import { fetchSentiments } from "@/lib/api/news-sentiment-api";
import type { News } from "@/types/news";
import type { Sentiment } from "@/types/sentiment";
import { useEffect, useState } from "react";

type Props = {
  params: { slug: string };
};

export type NewsWithSentiment = News & Partial<Sentiment>;

export default function NewsDetailPage({ params }: Props) {
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [news, setNews] = useState<News | null>(null);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [newsWithSentiment, setNewsWithSentiment] = useState<
    NewsWithSentiment[]
  >([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !params.slug) return;

    const loadNews = async () => {
      setLoadingNews(true);
      setError(null);

      try {
        const data = await fetchNewsDetail(params.slug);
        if (!data) {
          setError("Không tìm thấy bài viết.");
          setNews(null);
          return;
        }
        setNews(data);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
        setError("Không thể tải dữ liệu bài viết.");
      } finally {
        setLoadingNews(false);
      }
    };

    loadNews();
  }, [params.slug, authLoading]);

  useEffect(() => {
    if (!isLoggedIn || !news) return;

    const loadSentiment = async () => {
      setLoadingSentiment(true);
      try {
        const payload = [
          {
            title: news.title,
            description: news.description,
            publish_date: news.published_time,
          },
        ];
        const data = await fetchSentiments(payload);
        setSentiment(data?.[0] ?? null);
      } catch (err) {
        console.error("Lỗi khi phân tích cảm xúc:", err);
        setSentiment(null);
      } finally {
        setLoadingSentiment(false);
      }
    };

    loadSentiment();
  }, [isLoggedIn, news]);

  useEffect(() => {
    if (!news) return;

    const mergedArray: NewsWithSentiment[] = [
      {
        ...news,
        pos: sentiment?.pos,
        neg: sentiment?.neg,
        neu: sentiment?.neu,
      },
    ];

    setNewsWithSentiment(mergedArray);
  }, [news, sentiment]);

  if (loadingNews)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Đang tải bài viết...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );

  if (!news)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-lg">
        Không có dữ liệu bài viết.
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Biểu đồ sentiment */}
        <aside className="lg:col-span-3">
          {isLoggedIn && sentiment ? (
            <SentimentPieChart
              pos={sentiment.pos}
              neg={sentiment.neg}
              neu={sentiment.neu}
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center text-sm text-muted-foreground"></div>
          )}
        </aside>

        {/* Cột giữa: Nội dung bài báo */}
        <main className="lg:col-span-6 bg-white rounded-xl shadow-sm">
          <ArticleNews news={news} />
        </main>

        {/* Cột phải: Phân tích AI */}
        <aside className="lg:col-span-3 space-y-4">
          <AnalysisBox news={newsWithSentiment} />
        </aside>
      </div>
    </div>
  );
}
