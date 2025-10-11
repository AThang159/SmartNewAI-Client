// auth-api.ts
export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://127.0.0.1:8000/api"

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BACKEND_URL}/users/sign_in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Đăng nhập thất bại")
  }

  return res.json()
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BACKEND_URL}/auth/sign_up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Đăng ký thất bại")
  }

  return res.json()
}

export async function signOut() {
  const res = await fetch(`${API_BACKEND_URL}/auth/sign_out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Đăng xuất thất bại")
  }

  return res.json()
}


// Hàm fetch user hiện tại
export async function fetchCurrentUser() {
  const res = await fetch(`${API_BACKEND_URL}/auth/current_user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },  
    credentials: "include",
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.log(err.detail)
    throw new Error(err.detail || "Không thể lấy thông tin người dùng")
  }

  return res.json()
}
