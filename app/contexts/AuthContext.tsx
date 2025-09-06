'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'MENTOR' | 'MENTEE'
  isAdmin: boolean
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  claimAdmin: (email: string, code: string) => Promise<{ success: boolean; message: string }>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  type: 'mentor' | 'mentee'
  bio?: string
  expertise?: string[]
  goals?: string[]
  interests?: string[]
  location?: string
  education?: string
  experience?: string
  languages?: string[]
  availability?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true, message: 'Login successful' }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      return { success: false, message: 'Network error' }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      let result: any = {}
      try { result = await response.json() } catch { /* ignore */ }

      if (response.ok) {
        return { success: true, message: 'Registration successful' }
      } else {
        const serverMessage = result?.message || `Request failed (${response.status})`
        return { success: false, message: serverMessage }
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return { success: false, message: 'Request timed out. Please try again.' }
      }
      return { success: false, message: error?.message || 'Network error' }
    }
  }

  const claimAdmin = async (email: string, code: string) => {
    try {
      const response = await fetch('/api/auth/claim-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true, message: 'Admin access granted' }
      } else {
        return { success: false, message: data.message || 'Admin claim failed' }
      }
    } catch (error) {
      return { success: false, message: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, claimAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
