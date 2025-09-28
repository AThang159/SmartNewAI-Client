"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Section } from "../types/section"
import { ChildSection } from "../types/child-section"

interface SectionNavProps {
  sections: Section[],
  gridCols?: 2 | 3
}

export function SectionNav({ sections, gridCols = 2 }: SectionNavProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (index: number) => {
    if (timeoutId) clearTimeout(timeoutId)
    setOpenIndex(index)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => setOpenIndex(null), 200) // delay 200ms
    setTimeoutId(id)
  }

  return (
    <nav className="flex gap-6 bg-white shadow px-6 py-3 rounded-xl">
      {sections.map((section, index) => (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={section.href || "#"}
            className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-600 transition"
          >
            {section.label}
            {section.childSection && <ChevronDown size={16} />}
          </Link>

          {section.childSection && (
            <div
              className={`absolute left-0 top-full mt-2 min-w-[500px] rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 ${
                openIndex === index
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div
                className={`grid gap-2 p-2 ${
                  gridCols === 3 ? "grid-cols-3" : "grid-cols-2"
                }`}
              >
                {section.childSection.map((child, cIndex) => (
                  <Link
                    key={cIndex}
                    href={child.href || "#"}
                    className="block px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}