"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { fetchAnalyzeNews } from "@/lib/api/analyze-news-api";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisBoxProps {
  news: any;
}

export default function AnalysisBox({ news }: AnalysisBoxProps) {
  const { isLoggedIn } = useAuth();

  const [analyzeNews, setAnalyzeNews] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  
  const handleAnalyze = async () => {
    if (!news) return;
    setAnalyzing(true);
    try {
      const analyze = await fetchAnalyzeNews(news);
      setAnalyzeNews(analyze);
    } catch (err) {
      console.error(err);
      setAnalyzeNews("Không thể phân tích (quota giới hạn).");
    } finally {
      setAnalyzing(false);
    }
  };

  // Hiệu ứng “gõ chữ” dần dần
  useEffect(() => {
    if (!analyzeNews) return;
    setDisplayedText("");
    setIsWriting(true);

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + analyzeNews[index]);
      index++;
      if (index >= analyzeNews.length) {
        clearInterval(interval);
        setIsWriting(false);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [analyzeNews]);

  return (
    <Card className="border-2 border-blue-400 shadow-md bg-white rounded-xl w-full">
      <CardContent className="p-5">
        <h1 className="text-lg font-bold text-blue-700 mb-3 text-center">
          Phân tích chung của AI
        </h1>

        {analyzing ? (
          <p className="text-muted-foreground italic animate-pulse text-center">
            Đang phân tích tin tức...
          </p>
        ) : analyzeNews ? (
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed max-h-[70vh] overflow-y-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-xl font-bold text-blue-700 mt-4 mb-2"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-lg font-semibold text-blue-600 mt-3 mb-1"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-base font-semibold text-blue-500 mt-2 mb-1"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-blue-700" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-1 text-sm text-justify" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside ml-3 mb-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1 text-sm" {...props} />
                ),
              }}
            >
              {displayedText}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-muted-foreground text-center">
              Chưa có dữ liệu để phân tích.
            </p>

            {isLoggedIn ? (
              <Button onClick={handleAnalyze} disabled={!news}>
                Phân tích AI
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = "/login")}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Đăng nhập để phân tích
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
