import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: {
    default: 'ModelX - Все лучшие нейросети в одной подписке',
    template: '%s | ModelX',
  },
  description: 'Получите доступ к GPT-4, Claude, DALL-E, Midjourney и другим ведущим AI-моделям без сложных настроек и отдельных подписок',
  keywords: ['AI', 'нейросети', 'GPT-4', 'Claude', 'DALL-E', 'Midjourney', 'искусственный интеллект'],
  authors: [{ name: 'ModelX' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ModelX',
    title: 'ModelX - Все лучшие нейросети в одной подписке',
    description: 'Единая платформа для доступа к лучшим AI-моделям',
  },
}

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster 
            theme="dark" 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
