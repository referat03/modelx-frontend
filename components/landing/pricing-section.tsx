'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { pricingPlans, formatPrice } from '@/config/pricing.config'
import { cn } from '@/lib/utils'

export function PricingSection() {
  return (
    <section id="pricing" className="relative pt-20 pb-10 sm:pt-32 sm:pb-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Выберите подходящий тариф
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Прозрачные цены, без скрытых комиссий. Отмена в любое время.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'relative flex h-full flex-col transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer',
                  plan.isPopular && 'border-primary shadow-lg shadow-primary/20'
                )}
              >
                <CardHeader>
                  {plan.isPopular && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                        <Sparkles className="h-3 w-3" />
                        Популярный
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Price */}
                  <div className="mb-6 flex flex-wrap items-baseline gap-1">
                    <span className="text-2xl font-bold sm:text-4xl">
                      {formatPrice(plan.price)}
                    </span>
                    {!plan.isFree && (
                      <span className="text-muted-foreground">/мес</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.isPopular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={`/signup?plan=${plan.id}`}>
                      {plan.isFree ? 'Попробовать бесплатно' : 'Выбрать тариф'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}
