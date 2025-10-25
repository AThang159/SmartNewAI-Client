import FloatingChatbot from "@/components/floating-chatbot";
import { ArticleProvider } from "@/context/article-content-context";
import { AuthProvider } from "@/context/auth-context";
import { GeistMono, GeistSans } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart News AI",
  description: "Next.js App with Tailwind & shadcn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <ArticleProvider>
            {children}
            <FloatingChatbot></FloatingChatbot>
          </ArticleProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
