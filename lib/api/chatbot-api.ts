export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

export async function fetchReplyChatBot(text: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/ai/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
        credentials: "include"
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch chatbot reply: ${res.status}`)
    }

    return await res.json().n8n_body.message
}
