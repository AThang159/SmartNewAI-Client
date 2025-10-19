"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisBoxProps {
  text: string;
  onWritingChange?: (isWriting: boolean) => void;
}

export default function AnalysisBox({
  text,
  onWritingChange,
}: AnalysisBoxProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    setDisplayedText("");
    onWritingChange?.(true);

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;

      if (index >= text.length) {
        clearInterval(interval);
        onWritingChange?.(false);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <Card className="border-2 border-blue-400 shadow-md bg-white rounded-xl w-full">
      <CardContent className="p-5 max-h-[80vh] overflow-y-auto">
        <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-xl font-bold text-blue-700 mt-4 mb-2"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-lg font-semibold text-blue-600 mt-3 mb-1"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-base font-semibold text-blue-500 mt-2 mb-1"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-blue-700" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-1 text-sm text-justify" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside ml-3 mb-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="mb-1 text-sm" {...props} />
              ),
            }}
          >
            {displayedText}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
