'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

// TODO: Заменить на реальную интеграцию с next-auth или другой системой аутентификации
// TODO: Подключить реальный бэкенд для хранения пользователей

export type UserRole = 'user' | 'moderator' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  isEmailVerified: boolean
  createdAt: Date
  tokenBalance: number
  subscription?: {
    planId: string
    expiresAt: Date
    isAutoRenewal: boolean
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>
  logout: () => Promise<void>
  verifyEmail: (otp: string) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (data: Partial<Pick<User, 'name' | 'email'>>) => Promise<{ success: boolean; error?: string }>
  updateTokenBalance: (newBalance: number) => void
  loginWithGoogle: () => Promise<void>
  loginWithTelegram: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Моковые данные пользователей для демо
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@modelx.ru',
    name: 'Администратор',
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    tokenBalance: 1500.0,
    subscription: {
      planId: 'pro',
      expiresAt: new Date('2025-12-31'),
      isAutoRenewal: true,
    },
  },
  {
    id: '2',
    email: 'user@modelx.ru',
    name: 'Пользователь',
    role: 'user',
    isEmailVerified: true,
    createdAt: new Date('2024-06-01'),
    tokenBalance: 370.5,
    subscription: {
      planId: 'starter',
      expiresAt: new Date('2025-06-01'),
      isAutoRenewal: true,
    },
  },
]

const DEMO_OTP = '123456' // Моковый OTP код для демо

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null)

  // Проверяем сохранённую сессию при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('modelx_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        // Преобразуем строки дат обратно в Date
        if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt)
        if (parsed.subscription?.expiresAt) {
          parsed.subscription.expiresAt = new Date(parsed.subscription.expiresAt)
        }
        setUser(parsed)
      } catch {
        localStorage.removeItem('modelx_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Моковая проверка (принимаем любой пароль для демо)
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (foundUser && password.length >= 6) {
      setUser(foundUser)
      localStorage.setItem('modelx_user', JSON.stringify(foundUser))
      setIsLoading(false)
      return { success: true }
    }
    
    setIsLoading(false)
    return { success: false, error: 'Неверный email или пароль' }
  }, [])

  const signup = useCallback(async (
    email: string, 
    password: string, 
    name: string
  ): Promise<{ success: boolean; error?: string; requiresVerification?: boolean }> => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Проверяем, не занят ли email
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false)
      return { success: false, error: 'Этот email уже зарегистрирован' }
    }
    
    // Сохраняем email для верификации
    setPendingVerificationEmail(email)
    localStorage.setItem('modelx_pending_email', email)
    localStorage.setItem('modelx_pending_name', name)
    
    setIsLoading(false)
    return { success: true, requiresVerification: true }
  }, [])

  const verifyEmail = useCallback(async (otp: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const email = pendingVerificationEmail || localStorage.getItem('modelx_pending_email')
    const name = localStorage.getItem('modelx_pending_name')
    
    if (otp === DEMO_OTP && email && name) {
      // Создаём нового пользователя
      const newUser: User = {
        id: String(Date.now()),
        email,
        name,
        role: 'user',
        isEmailVerified: true,
        createdAt: new Date(),
        tokenBalance: 0.0,
        subscription: {
          planId: 'free',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
          isAutoRenewal: false,
        },
      }
      
      mockUsers.push(newUser)
      setUser(newUser)
      localStorage.setItem('modelx_user', JSON.stringify(newUser))
      localStorage.removeItem('modelx_pending_email')
      localStorage.removeItem('modelx_pending_name')
      setPendingVerificationEmail(null)
      
      setIsLoading(false)
      return { success: true }
    }
    
    setIsLoading(false)
    return { success: false, error: 'Неверный код подтверждения' }
  }, [pendingVerificationEmail])

  const logout = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setUser(null)
    localStorage.removeItem('modelx_user')
    setIsLoading(false)
  }, [])

  const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // В реальном приложении здесь отправляется email
    console.log('[ModelX] Отправлена ссылка для сброса пароля на:', email)
    return { success: true }
  }, [])

  const resetPassword = useCallback(async (
    token: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Моковый сброс пароля
    console.log('[ModelX] Пароль сброшен для токена:', token)
    return { success: true }
  }, [])

  const updateProfile = useCallback(async (
    data: Partial<Pick<User, 'name' | 'email'>>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Не авторизован' }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem('modelx_user', JSON.stringify(updatedUser))
    
    return { success: true }
  }, [user])

  const loginWithGoogle = useCallback(async () => {
    // TODO: Интегрировать реальный Google OAuth
    console.log('[ModelX] Google OAuth - требуется интеграция')
    alert('Google OAuth будет доступен после интеграции. Используйте email: admin@modelx.ru')
  }, [])

  const loginWithTelegram = useCallback(async () => {
    // TODO: Интегрировать Telegram Login Widget
    console.log('[ModelX] Telegram Login - требуется интеграция')
    alert('Telegram Login будет доступен после интеграции. Используйте email: admin@modelx.ru')
  }, [])

  const updateTokenBalance = useCallback((newBalance: number) => {
    if (!user) return
    
    const updatedUser = { ...user, tokenBalance: newBalance }
    setUser(updatedUser)
    localStorage.setItem('modelx_user', JSON.stringify(updatedUser))
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        updateProfile,
        updateTokenBalance,
        loginWithGoogle,
        loginWithTelegram,
      }}
    >
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
