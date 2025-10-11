import { News } from "@/types/news"

export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://127.0.0.1:8000/api"

export async function fetchAnalyzeNews(newsList : any) {
  // console.log(newsList)  
  const res = await fetch(`${API_BACKEND_URL}/ai/analyze-news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ news: newsList }),
    credentials: "include"
  })

  if (!res.ok) {
    throw new Error(`Failed to analyze news: ${res.status}`)
  }

  return await res.json()
}
