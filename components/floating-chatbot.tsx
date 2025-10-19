"use client";

import { useAuth } from "@/context/auth-context";
import { fetchChatHistory, fetchReplyChatBot } from "@/lib/api/chatbot-api";
import { MessageCircle, Square, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { isLoggedIn, user } = useAuth();
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [typing, setTyping] = useState(false); // Trạng thái bot đang gõ
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const stopTypingRef = useRef(false); // Biến kiểm soát việc dừng typing

  // Tự cuộn xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, loadingMessage]);

  // Tải lịch sử chat khi có user
  useEffect(() => {
    if (!user) return;
    async function loadHistory() {
      try {
        const history = await fetchChatHistory(user.sub);
        setMessages(history);
      } catch (err) {
        console.error("Không thể tải lịch sử:", err);
      }
    }
    loadHistory();
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim() || loadingMessage || typing) return;

    const newMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoadingMessage(true);

    try {
      const botResponse = await fetchReplyChatBot(input);
      const replyText =
        typeof botResponse === "string"
          ? botResponse
          : botResponse || "⚠️ Không có phản hồi từ server.";

      setLoadingMessage(false);
      setTyping(true);
      stopTypingRef.current = false;

      // Hiệu ứng gõ từng ký tự
      let currentText = "";
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

      for (let i = 0; i < replyText.length; i++) {
        if (stopTypingRef.current) break; // Dừng nếu người dùng nhấn nút dừng
        currentText += replyText[i];
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentText;
          return newMessages;
        });
        await new Promise((r) => setTimeout(r, 0.0001)); // tốc độ gõ
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

  // Hàm dừng typing
  const stopTyping = () => {
    stopTypingRef.current = true;
    setTyping(false);
  };

  return (
    <>
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
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 font-semibold text-center">
            Trợ lý AI
          </div>

          {/* Nếu chưa đăng nhập → hiện nút đăng nhập */}
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
              {/* Nội dung chat */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 space-y-3"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg text-sm ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white text-right ml-auto"
                        : "bg-gray-100 text-black text-left mr-auto"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-base font-bold text-blue-700"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-sm font-semibold text-blue-600"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-bold text-blue-700"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-1 text-sm" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside ml-3 mb-1 text-sm"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ))}

                {(loadingMessage || typing) && (
                  <p className="text-gray-500 italic">Bot đang phản hồi...</p>
                )}
              </div>

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
