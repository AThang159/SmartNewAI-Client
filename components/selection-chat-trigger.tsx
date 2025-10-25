"use client";

import { useEffect, useState } from "react";

type Props = {
  onAsk: (text: string) => void;
};

export default function SelectionChatTrigger({ onAsk }: Props) {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection();
      if (!selection) return;

      const text = selection.toString().trim();
      if (!text) {
        setSelectedText(null);
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(text);
        setPosition({
          x: rect.right + window.scrollX,
          y: rect.top + window.scrollY - 30,
        });
      } catch {
        // Không có range hợp lệ
        setSelectedText(null);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (!selectedText || !position) return null;

  return (
    <button
      onClick={() => {
        onAsk(selectedText);
        setSelectedText(null);
      }}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 9999,
      }}
      className="bg-blue-600 text-white px-2 py-1 text-xs rounded shadow hover:bg-blue-700"
    >
      💬 Hỏi AI
    </button>
  );
}
