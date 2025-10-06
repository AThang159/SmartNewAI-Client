import { Sentiment } from "@/types/sentiment"
import { News } from "@/types/news"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

export async function fetchSentiments(newsList: News[]): Promise<Sentiment[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/ai/classify_news`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ news: newsList }),
  })
  if (!res.ok) throw new Error("Failed to fetch sentiments")
  const data = await res.json()
  return data.news
}
