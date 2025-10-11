export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://127.0.0.1:8000/api"

export async function fetchReplyChatBot(text: string) {
    const res = await fetch(`${API_BACKEND_URL}/ai/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
        credentials: "include"
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch chatbot reply: ${res.status}`)
    }

    return await res.json().msg
}
