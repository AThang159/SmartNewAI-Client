import type { Section } from "@/types/section"

export const mockSections: Section[] = [
  {
    label: "World",
    href: "/world",
    childSection: [
      { label: "Africa", href: "/world/africa" },
      { label: "Americas", href: "/world/americas" },
      { label: "Asia Pacific", href: "/world/asia-pacific" },
      { label: "China", href: "/world/china" },
      { label: "Europe", href: "/world/europe" },
      { label: "India", href: "/world/india" },
      { label: "Israel and Hamas at War", href: "/world/israel-hamas" },
      { label: "Japan", href: "/world/japan" },
      { label: "Middle East", href: "/world/middle-east" },
      { label: "Ukraine and Russia at War", href: "/world/ukraine-russia" },
      { label: "United Kingdom", href: "/world/uk" },
      { label: "United States", href: "/world/us" },
      { label: "Reuters NEXT", href: "/world/reuters-next" },
    ],
  },
  {
    label: "Business",
    href: "/business",
    childSection: [
      { label: "Markets", href: "/business/markets" },
      { label: "Finance", href: "/business/finance" },
      { label: "Sustainability", href: "/business/sustainability" },
    ],
  },
  {
    label: "Markets",
    href: "/markets",
  },
  {
    label: "Technology",
    href: "/technology",
  },
  {
    label: "Politics",
    href: "/politics",
  },
  {
    label: "Sports",
    href: "/sports",
  },
]
