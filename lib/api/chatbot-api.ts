export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://127.0.0.1:8000/api";

export async function fetchReplyChatBot(text: string) {
  const res = await fetch(`${API_BACKEND_URL}/ai/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch chatbot reply: ${res.status}`);
  }
  console.log(res);

  const data = await res.json();
  return data.n8n_body?.message || "⚠️ Không có phản hồi từ server.";
}

export async function fetchChatHistory(sessionId: string) {
  const res = await fetch(
    `${API_BACKEND_URL}/ai/chat-history/${sessionId}?limit=100&offset=0`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Không thể tải lịch sử chat");

  const data = await res.json();

  const formattedMessages = data.items.map((item: any) => ({
    sender: item.message.type === "ai" ? "bot" : "user",
    text: item.message.content,
  }));

  return formattedMessages;
}
