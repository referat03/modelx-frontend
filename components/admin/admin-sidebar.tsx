"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CreditCard,
  Settings,
  Brain,
  BarChart3,
  Shield,
  LogOut,
  Tag,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  {
    title: "Обзор",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Пользователи",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Модели",
    href: "/admin/models",
    icon: Brain,
  },
  {
    title: "Чаты",
    href: "/admin/chats",
    icon: MessageSquare,
  },
  {
    title: "Платежи",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Тарифы",
    href: "/admin/pricing",
    icon: Tag,
  },
  {
    title: "Токены",
    href: "/admin/tokens",
    icon: Coins,
  },
  {
    title: "Аналитика",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Безопасность",
    href: "/admin/security",
    icon: Shield,
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Logo size={32} />
        <div>
          <span className="font-semibold text-foreground">ModelX</span>
          <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-2 w-full justify-start gap-2">
            <LayoutDashboard className="h-4 w-4" />
            К дашборду
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  )
}
