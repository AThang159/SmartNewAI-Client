
import { fetchNewsDetail } from "@/lib/api/news-api";
import type { Metadata } from "next";
import NewsDetailPage from "./news-page";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await fetchNewsDetail(params.slug);
    const title = `${data.title} | Smart News AI`;
    const description =
      data.description ||
      "Tin tức chi tiết được tổng hợp bởi Smart News AI.";

    return {
      title,
      description,
      openGraph: {
        title,
        description
      },
      twitter: {
        card: "summary_large_image",
        title
      },
    };
  } catch {
    return {
      title: "Smart News AI",
      description: "Tin tức được tổng hợp và phân tích bởi Smart News AI.",
    };
  }
}

export default async function Page({ params }: Props) {
  return <NewsDetailPage params={params} />;
}
