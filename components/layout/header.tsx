'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/#pricing', label: 'Тарифы' },
    { href: '/about', label: 'О сервисе' },
    { href: '/faq', label: 'FAQ' },
  ]

  const authLinks = isAuthenticated
    ? [
        { href: '/dashboard', label: 'Дашборд' },
        { href: '/chat', label: 'Чат' },
      ]
    : []

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">ModelX</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {[...navLinks, ...authLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {(user?.tokenBalance ?? 0).toFixed(2)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Вход</Link>
              </Button>
              <Button size="sm" className="bg-primary" asChild>
                <Link href="/signup">Регистрация</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border/50 bg-background md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {[...navLinks, ...authLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-between px-3">
                      <span className="text-sm text-muted-foreground">
                        {user?.name}
                      </span>
                      <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1">
                        <Coins className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {(user?.tokenBalance ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                    >
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        Вход
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-primary" asChild>
                      <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                        Регистрация
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
