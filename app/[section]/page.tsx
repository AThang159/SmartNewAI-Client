import type { Metadata } from "next";
import SectionPageClient from "./section-page";

type Props = {
  params: {
    section: string;
  };
};

function capitalizeWords(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sectionName = capitalizeWords(params.section);

  const title = `${sectionName} | Smart News AI`;
  const description = `Tin tức mới nhất về ${sectionName.toLowerCase()}, được tổng hợp và phân tích bởi Smart News AI.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Smart News AI",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
  };
}

export default function SectionPage({ params }: Props) {
  return <SectionPageClient params={params} />;
}
