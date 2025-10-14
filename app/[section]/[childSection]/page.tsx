"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { NewsGrid } from "@/components/news-grid";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { TrendingSidebar } from "@/components/trending-sidebar";

export default function SectionPage({
  params,
}: {
  params: { section: string; childSection: string };
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <NewsGrid
              section={params.section}
              subSection={params.childSection}
            />
          </div>
          <div className="lg:col-span-1">
            <TrendingSidebar />
          </div>
        </div>
      </div>

      <NewsletterSignup />
      <Footer />
    </div>
  );
}
