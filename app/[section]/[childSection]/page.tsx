import type { Metadata } from "next";
import SectionPageClient from "./child-section-page";

type Props = {
  params: {
    section: string;
    childSection: string;
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
  const childSectionName = capitalizeWords(params.childSection);

  const title = `${childSectionName} - ${sectionName} | Smart News AI`;
  const description = `Tin tức mới nhất về ${childSectionName.toLowerCase()} trong chuyên mục ${sectionName.toLowerCase()}, được tổng hợp và phân tích bởi Smart News AI.`;

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

export default function ChildSectionPage({ params }: Props) {
  return <SectionPageClient params={params} />;
}
