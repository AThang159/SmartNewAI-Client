import type { Metadata } from "next"
import { GeistSans, GeistMono } from "@/lib/fonts"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import FloatingChatbot from "@/components/floating-chatbot"

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
        <AuthProvider>
          {children}
          <FloatingChatbot></FloatingChatbot>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
