import { Sentiment } from "@/types/sentiment"
import { News } from "@/types/news"

export async function fetchSentiments(newsList: News[]): Promise<Sentiment[]> {
  const res = await fetch("http://localhost:8000/api/v1/ai/classify_news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ news: newsList }),
  })

  console.log(res)
  if (!res.ok) throw new Error("Failed to fetch sentiments")
  const data = await res.json()
  return data.news
}
