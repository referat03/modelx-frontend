import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { CosmicBackground } from '@/components/cosmic-background'
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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background`}>
        <AuthProvider>
          <CosmicBackground />
          <div className="relative z-10">
            {children}
          </div>
          {/*
            Global Sonner Toaster.
            - duration: 4000 ensures every toast auto-dismisses on desktop AND
              mobile after ~4s, instead of waiting for a manual swipe.
            - The wrapper gets `pointer-events: none` so empty space inside the
              top-right notification region never blocks clicks on the page
              behind it. Each individual toast card re-enables pointer events
              via `toastOptions.style.pointerEvents = 'auto'` so it can still
              be hovered, swiped, or clicked when actually visible.
            - All non-blocking behavior is purely a layering/timing fix; the
              visual identity, position and styling of the toasts is unchanged.
          */}
          <Toaster
            theme="dark"
            position="top-right"
            duration={4000}
            style={{ pointerEvents: 'none' }}
            toastOptions={{
              style: {
                pointerEvents: 'auto',
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
