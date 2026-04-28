import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const footerLinks = {
  product: [
    { href: '/#pricing', label: 'Тарифы' },
    { href: '/about', label: 'О сервисе' },
    { href: '/faq', label: 'FAQ' },
    { href: '/referral', label: 'Реферальная программа' },
  ],
  legal: [
    { href: '/terms', label: 'Условия использования' },
    { href: '/privacy', label: 'Политика конфиденциальности' },
  ],
  support: [
    { href: '/contacts', label: 'Контакты' },
    { href: 'mailto:support@modelx.ru', label: 'support@modelx.ru' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">ModelX</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Единая платформа для доступа к лучшим AI-моделям. GPT-4, Claude, DALL-E и многое другое в одной подписке.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Продукт</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Правовая информация</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Поддержка</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} ModelX. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
