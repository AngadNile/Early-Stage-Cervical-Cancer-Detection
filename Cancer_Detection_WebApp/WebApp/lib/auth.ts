// MongoDB / REST API Authentication utility
export interface User {
  email: string
  password?: string
  role: "admin" | "aasha_worker" | "doctor" | "patient" | "lab" | "pathology" | "screening_van"
  name: string
  id: string
}

const API_BASE = "http://localhost:5000/api"

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (data.success && data.user) {
      if (data.token) {
        localStorage.setItem("authToken", data.token)
      }
      return {
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        id: data.user.id,
      }
    } else {
      throw new Error(data.error || "Login failed")
    }
  } catch (error) {
    console.error("[Auth] Login error:", error)
    throw error instanceof Error ? error : new Error("Login failed")
  }
}

export const registerNewUser = async (
  email: string,
  password: string,
  userType: "doctor" | "ashaWorker" | "patient" | "lab" | "pathology" | "screening_van",
  userData: any,
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const roleMapping: Record<string, User["role"]> = {
      doctor: "doctor",
      patient: "patient",
      ashaWorker: "aasha_worker",
      lab: "lab",
      pathology: "pathology",
      screening_van: "screening_van",
    }

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role: roleMapping[userType] || userType || "patient",
        ...userData,
      }),
    })

    const data = await res.json()

    if (data.success && data.user) {
      return {
        success: true,
        user: {
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
          id: data.user.id,
        },
      }
    } else {
      return { success: false, error: data.error || "Registration failed" }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Registration failed" }
  }
}

export const createAdmin = async (adminData: {
  name: string
  email: string
  phone: string
  password: string
  region: string
}): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
        role: "admin",
        phone: adminData.phone,
        region: adminData.region,
      }),
    })
    const data = await res.json()
    if (data.success && data.user) {
      return {
        success: true,
        user: { email: data.user.email, role: data.user.role, name: data.user.name, id: data.user.id },
      }
    }
    return { success: false, error: data.error || "Registration failed" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Registration failed" }
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  try {
    const userData = localStorage.getItem("currentUser")
    return userData && userData !== "undefined" ? JSON.parse(userData) : null
  } catch (error) {
    console.error("[Auth] Error parsing currentUser:", error)
    return null
  }
}

export const setCurrentUser = (user: User): void => {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export const logout = (): void => {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("authToken")
}

export const getDashboardPathForRole = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard"
    case "doctor":
      return "/doctor/dashboard"
    case "aasha_worker":
      return "/aasha-worker/dashboard"
    case "lab":
    case "pathology":
    case "screening_van":
      return "/screening/dashboard"
    case "patient":
    default:
      return "/patient/dashboard"
  }
}
