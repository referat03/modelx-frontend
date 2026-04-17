'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section
      data-snap-section
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
    >
      {/* Soft gradient glows layered on top of the cosmic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-0 bg-[url('/stars.svg')] bg-repeat opacity-30" />
      </div>

      {/* Central content spotlight — unifies badge, headline, subheadline and buttons
          into one cinematic composition. Stronger on mobile where content is more compact. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[620px] w-[480px] sm:h-[800px] sm:w-[900px]"
          style={{
            background:
              'radial-gradient(closest-side, hsl(var(--primary) / 0.14), hsl(var(--primary) / 0.05) 45%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Новое поколение AI-платформ
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mt-5 text-balance text-4xl font-bold tracking-tight sm:mt-7 sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]"
        >
          Все лучшие нейросети{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            в одном месте
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
        >
          Переключайтесь между GPT-4, Claude, DALL·E, Midjourney, ElevenLabs и
          другими AI-моделями для текста, изображений, видео и аудио — без
          лишней путаницы и десятков отдельных сервисов.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-4"
        >
          <Button size="lg" className="group w-full sm:w-auto" asChild>
            <Link href="/signup">
              Начать бесплатно
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="#how-it-works">Узнать больше</Link>
          </Button>
        </motion.div>

        {/* Quiet bottom anchor — closes the composition without clutter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/55 sm:mt-10 sm:text-[11px]"
        >
          <span>Текст</span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
          <span>Изображения</span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
          <span>Видео</span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
          <span>Аудио</span>
        </motion.div>
      </div>
    </section>
  )
}
