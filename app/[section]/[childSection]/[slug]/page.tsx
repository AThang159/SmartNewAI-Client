import ArticleNews from "@/components/aritcle-news";
import { Header } from "@/components/header";

export default function NewsDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto">
        <ArticleNews />
      </div>
    </div>
  );
}
