"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { fetchReplyChatBot } from "@/lib/api/chatbot-api"

type Message = {
  sender: "user" | "bot"
  text: string
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessage: Message = { sender: "user", text: input }
    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setLoading(true)

    try {
      // Gọi API thật thay vì dữ liệu giả lập
      // const botResponse = await fetchReplyChatBot(input)
      const botResponse = example_data

      // Nếu API trả về JSON hoặc text khác, bạn có thể xử lý ở đây:
      // const replyText = botResponse === ""
      //   ? botResponse
      //   : botResponse || "⚠️ Không có phản hồi từ server."

      const replyText = botResponse

      // Hiệu ứng gõ từng ký tự ra dần
      let currentText = ""
      setMessages((prev) => [...prev, { sender: "bot", text: "" }])

      for (let i = 0; i < replyText.length; i++) {
        currentText += replyText[i]
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].text = currentText
          return newMessages
        })
        await new Promise((r) => setTimeout(r, 10)) // tốc độ gõ
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Lỗi kết nối server!" },
      ])
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {/* Nút bật/tắt */}
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

          {/* Khung tin nhắn */}
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
                      <h1 className="text-base font-bold text-blue-700" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-sm font-semibold text-blue-600" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-blue-700" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-1 text-sm" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside ml-3 mb-1 text-sm" {...props} />
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

            {loading && <p className="text-gray-500 italic">Bot đang phản hồi...</p>}
          </div>

          {/* Ô nhập */}
          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập câu hỏi..."
              className="flex-1 p-2 text-sm outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 text-sm hover:bg-blue-700"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const example_data = 
`# Báo cáo Phân tích Thị trường

## 1. Tình hình chung
Trong **quý 3 năm 2025**, nền kinh tế Việt Nam **tăng trưởng ổn định** với GDP đạt mức **+6.4%**.  
Các ngành đóng góp chính:
- **Ngân hàng:** tăng trưởng lợi nhuận 8%
- **Công nghiệp:** duy trì sản xuất tốt, xuất khẩu tăng
- **Công nghệ:** thu hút nhiều vốn đầu tư nước ngoài

## 2. Diễn biến tâm lý thị trường
Kết quả phân tích cảm xúc từ 1.200 bài báo cho thấy:
- **Tích cực:** 62%
- **Trung lập:** 25%
- **Tiêu cực:** 13%

> *Nhận định:* Nhà đầu tư đang có xu hướng lạc quan trở lại, đặc biệt trong nhóm cổ phiếu ngân hàng và công nghệ. 
`
