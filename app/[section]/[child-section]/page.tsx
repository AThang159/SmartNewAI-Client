"use client"

import { Header } from "@/components/header"
import { NewsGrid } from "@/components/news-grid"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { CategorySections } from "@/components/category-sections"
import { Footer } from "@/components/footer"

export default function SectionPage({ params }: { params: { section: string, "child-section": string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <NewsGrid section={params.section} subSection={params["child-section"]} />
          </div>
          <div className="lg:col-span-1">
            <TrendingSidebar />
          </div>
        </div>
      </div>

      <NewsletterSignup />
      <CategorySections />
      <Footer />
    </div>
  )
}
