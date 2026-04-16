'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Brain, Image, Volume2, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: Brain, label: 'GPT-4 & Claude' },
  { icon: Image, label: 'DALL-E & Midjourney' },
  { icon: Volume2, label: 'Whisper & ElevenLabs' },
  { icon: Video, label: 'Runway & Pika' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        
        {/* Stars pattern */}
        <div className="absolute inset-0 bg-[url('/stars.svg')] bg-repeat opacity-30" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Новое поколение AI-платформ
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Все лучшие нейросети{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            в одной подписке
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
        >
          Получите доступ к GPT-4, Claude, DALL-E, Midjourney и другим ведущим AI-моделям без сложных настроек и отдельных подписок
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button size="lg" className="group" asChild>
            <Link href="/signup">
              Начать бесплатно
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#pricing">Узнать больше</Link>
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center sm:gap-16"
        >
          <div>
            <p className="text-3xl font-bold text-primary sm:text-4xl">15+</p>
            <p className="mt-1 text-sm text-muted-foreground">AI моделей</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary sm:text-4xl">50K+</p>
            <p className="mt-1 text-sm text-muted-foreground">Пользователей</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary sm:text-4xl">1M+</p>
            <p className="mt-1 text-sm text-muted-foreground">Запросов в день</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
