"use client";

import { useArticle } from "@/context/article-content-context";
import { useAuth } from "@/context/auth-context";
import { fetchChatHistory, fetchReplyChatBot } from "@/lib/api/chatbot-api";
import { MessageCircle, Square, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SelectionChatTrigger from "./selection-chat-trigger";

type Message = {
  sender: "user" | "bot" | "context";
  text: string;
};

export default function FloatingChatbot() {
  const pathname = usePathname();
  const { content: articleContent } = useArticle();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { isLoggedIn, user } = useAuth();
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const isReadingNews = pathname.startsWith("/news/");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const stopTypingRef = useRef(false);

  // Tự cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loadingMessage]);

  // Tải lịch sử chat
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        let history = await fetchChatHistory(user.sub);
        history = history.flatMap((msg: Message) => {
          if (
            msg.sender === "user" &&
            msg.text.startsWith("Câu hỏi trích dẫn:")
          ) {
            const match = msg.text.match(/"([^"]+)"/); // lấy phần trong dấu ""
            const quote = match?.[1] || "";
            const rest = msg.text
              .replace(/Câu hỏi trích dẫn:\s*".*?"/, "")
              .trim(); // phần còn lại
            const result: Message[] = [];
            if (quote) result.push({ sender: "context", text: quote }); // trích dẫn
            if (rest) result.push({ sender: "user", text: rest }); // phần hỏi còn lại
            return result;
          }
          return msg;
        });

        setMessages(history);
      } catch (err) {
        console.error("Không thể tải lịch sử:", err);
      }
    })();
  }, [user]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!input.trim() || loadingMessage || typing) return;

    const contextMessage = selectedContext
      ? { sender: "context" as const, text: selectedContext }
      : null;

    const newUserMsg: Message = { sender: "user", text: input };

    setMessages((prev) =>
      contextMessage
        ? [...prev, contextMessage, newUserMsg]
        : [...prev, newUserMsg]
    );

    const plainTextArticle =
      articleContent
        ?.map((item) => item.replace(/<[^>]*>/g, "").replace(/['"]/g, "")) // loại bỏ tất cả thẻ HTML
        .join(" ") || "";

    const payload = {
      selected: selectedContext || "",
      question: input,
      article: plainTextArticle || "",
    };

    setSelectedContext(null);
    setInput("");
    setLoadingMessage(true);

    try {
      const botResponse = await fetchReplyChatBot(payload);
      const replyText =
        typeof botResponse === "string"
          ? botResponse
          : botResponse || "⚠️ Không có phản hồi từ server.";

      setLoadingMessage(false);
      setTyping(true);
      stopTypingRef.current = false;

      let currentText = "";
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

      for (let i = 0; i < replyText.length; i++) {
        if (stopTypingRef.current) break;
        currentText += replyText[i];
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentText;
          return newMessages;
        });
        await new Promise((r) => setTimeout(r, 5));
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Lỗi kết nối server!" },
      ]);
    } finally {
      setLoadingMessage(false);
      setTyping(false);
    }
  };

  // Dừng typing
  const stopTyping = () => {
    stopTypingRef.current = true;
    setTyping(false);
  };

  return (
    <>
      {/* Component bôi đen hỏi AI */}
      {isReadingNews && (
        <SelectionChatTrigger
          onAsk={(text) => {
            setIsOpen(true);
            setSelectedContext(text);
            setInput("");
          }}
        />
      )}

      {/* Nút mở chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      {/* Hộp chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-[500px] bg-white border shadow-xl rounded-xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white p-3 font-semibold text-center">
            Trợ lý AI
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-col justify-center items-center flex-1 p-6 text-center">
              <p className="text-gray-700 text-sm mb-4">
                🔒 Vui lòng đăng nhập để trò chuyện với trợ lý AI.
              </p>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
              >
                Đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 space-y-3"
              >
                {messages.map((msg, i) => {
                  const isContext =
                    msg.sender === "context" || (msg as any).selectedContext;
                  const displayText = isContext
                    ? (msg as any).selectedContext || msg.text
                    : msg.text;

                  return (
                    <div
                      key={i}
                      className={`p-2 rounded-lg text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white text-right ml-auto"
                          : isContext
                          ? "bg-gray-100 border-l-4 border-blue-500 text-gray-700 italic text-left"
                          : "bg-gray-100 text-black text-left mr-auto"
                      }`}
                    >
                      {isContext ? (
                        <p>📄 "{displayText}"</p>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="mb-1 text-sm" {...props} />
                            ),
                          }}
                        >
                          {displayText}
                        </ReactMarkdown>
                      )}
                    </div>
                  );
                })}

                {(loadingMessage || typing) && (
                  <p className="text-gray-500 italic">Bot đang phản hồi...</p>
                )}
              </div>

              {/* Nếu có đoạn trích đang chọn */}
              {selectedContext && (
                <div className="border-t border-gray-200 bg-gray-50 p-2 text-xs text-gray-600">
                  <p className="font-semibold text-blue-600 mb-1">
                    📄 Đoạn được trích:
                  </p>
                  <p className="italic">"{selectedContext}"</p>
                  <button
                    onClick={() => setSelectedContext(null)}
                    className="text-red-500 text-[11px] hover:underline mt-1"
                  >
                    ✖ Bỏ đoạn trích
                  </button>
                </div>
              )}

              {/* Ô nhập */}
              <div className="flex border-t">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !loadingMessage &&
                    !typing &&
                    sendMessage()
                  }
                  placeholder="Nhập câu hỏi..."
                  className="flex-1 p-2 text-sm outline-none"
                  disabled={loadingMessage || typing}
                />
                {typing ? (
                  <button
                    onClick={stopTyping}
                    className="bg-red-500 text-white px-3 text-sm hover:bg-red-600 flex items-center"
                  >
                    <Square className="w-4 h-4 mr-1" /> Dừng
                  </button>
                ) : (
                  <button
                    onClick={sendMessage}
                    disabled={loadingMessage}
                    className={`px-3 text-sm text-white ${
                      loadingMessage
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Gửi
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
