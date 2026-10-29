
import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, type User } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "doctor" | "patient" | "aasha_worker" | "lab" | "pathology" | "screening_van")[]
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate()

  // ✅ Read localStorage synchronously — no useState(isLoading), no spinner flash.
  // getCurrentUser() reads from localStorage which is synchronous on the client.
  // On SSR this returns null (typeof window === "undefined" guard is inside getCurrentUser).
  const user: User | null = typeof window !== "undefined" ? getCurrentUser() : null

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [user, navigate])

  // If no user: return null immediately (redirect happens in useEffect).
  // No spinner — the redirect is nearly instant since localStorage is synchronous.
  if (!user) return null

  return <>{children}</>
}

