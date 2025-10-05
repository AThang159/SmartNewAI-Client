"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { fetchNews } from "@/lib/api/news-api"
import { fetchSentiments } from "@/lib/api/news-sentiment-api"
import { News } from "@/types/news"
import { useAuth } from "@/context/auth-context"
import Link  from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SentimentChart } from "@/components/sentiment-chart"
import { Sentiment } from "@/types/sentiment"
import { fetchCurrentUser } from "@/lib/api/auth-api"

export type NewsWithSentiment = News & Sentiment

const categories = ["All", "World", "Business", "Markets", "Technology", "Politics", "Sports"]
const timeFilters = [
  { label: "Tất cả", value: "all" },
  { label: "24h qua", value: "1d" },
  { label: "7 ngày qua", value: "7d" },
  { label: "30 ngày qua", value: "30d" },
]
const sortFilters = [
  { label: "Mới nhất", value: "DESC" },
  { label: "Cũ nhất", value: "ASC" },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTime, setSelectedTime] = useState("all")
  const [selectedSort, setSelectedSort] = useState("DESC")
  const [results, setResults] = useState<NewsWithSentiment[]>([])
  const [total, setTotal] = useState<number | undefined>(undefined)
  const [offset, setOffset] = useState(0)
  const { isLoggedIn, loading, user, refreshUser } = useAuth()
    const limit = 20

  const [showPagination, setShowPagination] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Ẩn/hiện pagination khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY + 10) {
        setShowPagination(false) // cuộn xuống -> ẩn
      } else if (currentScrollY < lastScrollY - 10) {
        setShowPagination(true) // cuộn lên -> hiện
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const getPublishedAfter = (filter: string) => {
    if (filter === "all") return undefined
    const now = new Date()
    if (filter === "1d") now.setDate(now.getDate() - 1)
    if (filter === "7d") now.setDate(now.getDate() - 7)
    if (filter === "30d") now.setDate(now.getDate() - 30)
    return now.toISOString()
  }

  const formatRelativeTime = (published: string) => {
    const publishedDate = new Date(published)
    const now = new Date()
    const diffMs = now.getTime() - publishedDate.getTime()

    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
  }

  const loadNews = async () => {
    try {
      const newsList: any = await fetchNews({
        q: searchQuery || undefined,
        sections: selectedCategory !== "All" ? [selectedCategory] : undefined,
        limit,
        offset,
        order_by: "published_time",
        order_dir: selectedSort,
        date_from: getPublishedAfter(selectedTime),
      })
      if (isLoggedIn) {
        const payload = newsList.items.map((n: any) => ({
          title: n.title,
          description: n.description,
          publish_date: n.published_time
        }))
        const sentiments = await fetchSentiments(payload)
        console.log(sentiments)
        const merged: NewsWithSentiment[] = newsList.items.map((n) => {
          const s = sentiments.find((x) => x.title === n.title)
          return s ? { ...n, ...s } : n
        })
        setResults(merged)
      } else {
        setResults(newsList.items)
      }
      setTotal(newsList.page.total)
    } catch (e) {
      console.error(e)
      setResults([])
    } finally {
    }
  }

  useEffect(() => {
    loadNews()
  }, [selectedCategory, selectedTime, selectedSort, offset, isLoggedIn])

  const handleSearch = () => {
    setOffset(0) // tìm kiếm mới -> reset offset
    loadNews()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto flex-2 px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          {/* Sidebar bộ lọc */}
          <aside className="space-y-8 sticky top-20 h-fit">
            <h1 className="text-3xl font-bold mb-6">Tìm kiếm tin tức</h1>

            {/* Ô search */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Tìm kiếm tin tức, chủ đề, tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Đang tải..." : "Tìm"}
              </Button>
            </div>

            {/* Category filter */}
            <div>
              <h2 className="font-semibold mb-2">Chuyên mục</h2>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn chuyên mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time filter */}
            <div>
              <h2 className="font-semibold mb-2">Thời gian</h2>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  {timeFilters.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort filter */}
            <div>
              <h2 className="font-semibold mb-2">Sắp xếp</h2>
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thứ tự" />
                </SelectTrigger>
                <SelectContent>
                  {sortFilters.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </aside>

          {/* Danh sách tin tức */}
          <section className="md:col-span-3 grid grid-cols-3 gap-3">
            <div className="col-span-2">
              {/* Pagination sticky */}
              {showPagination && (
                <div
                  className={`flex gap-10 ml-auto fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background flex justify-between items-center px-5 py-2 shadow-lg rounded-full transition-transform duration-300 ${showPagination ? "translate-y-0" : "translate-y-20"
                    }`}
                >
                  {/* Chữ kết quả */}
                  {total !== undefined && (
                    <p className="text-xl text-muted-foreground flex-1">
                      {offset + 1} - {Math.min(offset + limit, total)} của{" "}
                      <span className="font-semibold">{total}</span> kết quả
                    </p>
                  )}

                  {/* Nút điều hướng */}
                  <div className="flex gap-1 ml-6">
                    <Button
                      onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                      disabled={offset === 0 || loading}
                      variant="ghost"
                      className="w-16 h-16 flex items-center justify-center p-0"
                    >
                      <ArrowLeft className="w-8 h-8" />
                    </Button>
                    <Button
                      onClick={() => setOffset((prev) => prev + limit)}
                      disabled={offset + limit >= (total || 0) || loading}
                      variant="ghost"
                      className="w-16 h-16 flex items-center justify-center p-0"
                    >
                      <ArrowRight className="w-8 h-8" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Danh sách tin */}
              <div className="pr-2 space-y-3 mt-2">
                {results.length > 0 ? (
                  results.map((news) => (
                    <Card key={news.id}>
                      <CardContent className="px-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Cột 1: Ảnh */}
                          <div className="col-span-3">
                            {/* Thumbnail */}
                            {news.thumbnail && (
                              <Link
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={news.thumbnail}
                                  alt={news.title}
                                  className="w-full h-28 object-cover rounded cursor-pointer hover:opacity-90 transition"
                                />
                              </Link>
                            )}
                          </div>

                          {/* Cột 2: Thông tin */}
                          <div className="col-span-7 flex flex-col justify-between">
                            {/* Title */}
                            <Link
                              href={news.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-bold hover:underline cursor-pointer"
                            >
                              {news.title}
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span className="text-xs px-2 py-1 rounded bg-muted">
                                {news.section ?? "Unknown"}
                              </span>
                              <Clock className="h-3 w-3 text-xs" />
                              <span className="text-xs">
                                {news.published_time
                                  ? formatRelativeTime(news.published_time)
                                  : ""}
                              </span>
                            </div>
                            {news.description && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                                {news.description}
                              </p>
                            )}
                          </div>

                          {/* Cột 3: Sentiment */}
                          <div className="col-span-2 flex items-center justify-center">
                            {isLoggedIn ? (
                              <SentimentChart pos={news.pos} neg={news.neg} neu={news.neu} />
                            ) : (
                              <div className="w-16 h-16 flex items-center justify-center text-sm text-muted-foreground">
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">Không có kết quả</p>
                )}
              </div>
            </div>
            {/* Quảng cáo (chiếm 1/3) */}
            <aside className="col-span-1 space-y-4">
              <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded">
                <p>Quảng cáo 1</p>
              </div>
              <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded">
                <p>Quảng cáo 2</p>
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
