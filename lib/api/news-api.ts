import { News } from "@/types/news";
import { Section } from "@/types/section";

export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://127.0.0.1:8000/api";

type FetchNewsParams = {
  fields?: string; // "id,title,section"
  sections?: string[]; // ["tech","sport"]
  date_from?: string; // ISO 8601
  date_to?: string;
  q?: string; // keyword
  limit?: number; // default 20
  offset?: number; // default 0
  order_by?: "published_time" | "title" | "section" | "id";
  order_dir?: "ASC" | "DESC";
};

export async function fetchNews(params?: FetchNewsParams): Promise<News[]> {
  try {
    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value === undefined) return acc;
            if (Array.isArray(value)) {
              // Trường hợp sections[]
              value.forEach((v) => acc.append(key, v));
            } else {
              acc.set(key, String(value));
            }
            return acc;
          }, new URLSearchParams())
        ).toString()
      : "";

    const res = await fetch(`${API_BACKEND_URL}/news/${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function fetchNewsDetail(slug: string): Promise<News | null> {
  try {
    const res = await fetch(`${API_BACKEND_URL}/news/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news detail: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }
}

export async function fetchSections(): Promise<Section[]> {
  try {
    const res = await fetch(`${API_BACKEND_URL}/news/sections`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch sections: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

/**
 * Cộng +1 lượt xem cho bài viết
 * @param newsId ID của bài viết
 */
export async function increaseNewsView(newsId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BACKEND_URL}/news/${newsId}/seen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`Failed to increase view count: ${res.status}`);
    }
  } catch (error) {
    console.error("Error increasing news view:", error);
  }
}
