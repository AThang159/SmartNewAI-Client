import type { Metadata } from "next"
import { GeistSans, GeistMono } from "@/lib/fonts"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js App with Tailwind & shadcn",
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
