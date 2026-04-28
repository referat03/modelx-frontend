'use client'

import { motion } from 'framer-motion'
import { Check, Crown, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccessCard {
  id: 'subscription' | 'tokens'
  icon: typeof Crown
  title: string
  description: string
  bullets: string[]
  accent: string
  iconBg: string
  iconColor: string
}

const accessCards: AccessCard[] = [
  {
    id: 'subscription',
    icon: Crown,
    title: 'Подписка',
    description:
      'Подходит для тех, кто пользуется AI-моделями регулярно. Вы получаете постоянный доступ к возможностям платформы в рамках выбранного тарифа.',
    bullets: [
      'Для ежедневного использования',
      'Подходит для работы и постоянных задач',
      'Удобный фиксированный формат доступа',
    ],
    accent: 'from-primary/25 via-primary/5 to-transparent',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
  },
  {
    id: 'tokens',
    icon: Coins,
    title: 'Токены',
    description:
      'Подходят для разовых запросов и гибкого использования без постоянной подписки. Удобно, если AI нужен время от времени.',
    bullets: [
      'Для нерегулярного использования',
      'Оплата только по необходимости',
      'Удобно для разовых задач',
    ],
    accent: 'from-accent/25 via-accent/5 to-transparent',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      data-snap-section
      className="relative scroll-mt-16 py-20 sm:py-28"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Как устроен ModelX
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            В ModelX вы можете выбрать удобный формат доступа: подписку для
            регулярного использования или токены для разовых задач.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-2"
        >
          {accessCards.map(card => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 sm:p-8',
                  'hover:border-primary/40 hover:bg-card/60 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5'
                )}
              >
                {/* Accent gradient layer */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100',
                    card.accent
                  )}
                />

                <div className="relative">
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ring-border/40 transition-transform duration-300 group-hover:scale-105',
                      card.iconBg
                    )}
                  >
                    <Icon className={cn('h-6 w-6', card.iconColor)} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-2xl font-bold tracking-tight">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {card.description}
                  </p>

                  {/* Bullets */}
                  <ul className="mt-6 space-y-3">
                    {card.bullets.map(bullet => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm sm:text-base"
                      >
                        <div
                          className={cn(
                            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                            card.iconBg
                          )}
                        >
                          <Check className={cn('h-3 w-3', card.iconColor)} />
                        </div>
                        <span className="text-foreground/85">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Helper note */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground sm:text-base"
        >
          Вы можете выбрать то, что подходит именно вам: подписку для постоянной
          работы или токены для гибкого доступа.
        </motion.p>
      </div>
    </section>
  )
}
