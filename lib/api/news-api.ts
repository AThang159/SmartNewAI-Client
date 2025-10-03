import { News } from "@/types/news"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

type FetchNewsParams = {
  fields?: string                // "id,title,section"
  sections?: string[]            // ["tech","sport"]
  date_from?: string             // ISO 8601
  date_to?: string
  q?: string                     // keyword
  limit?: number                 // default 20
  offset?: number                // default 0
  order_by?: "published_time" | "title" | "section" | "id"
  order_dir?: "ASC" | "DESC"
}

export async function fetchNews(params?: FetchNewsParams): Promise<News[]> {
  try {
    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value === undefined) return acc
            if (Array.isArray(value)) {
              // Trường hợp sections[]
              value.forEach(v => acc.append(key, v))
            } else {
              acc.set(key, String(value))
            }
            return acc
          }, new URLSearchParams())
        ).toString()
      : ""

    const res = await fetch(`${API_BASE_URL}/api/v1/news${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}
