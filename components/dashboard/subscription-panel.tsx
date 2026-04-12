'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, CreditCard, Calendar, Zap, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/auth-context'
import { pricingPlans, getPlanById, formatPrice } from '@/config/pricing.config'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function SubscriptionPanel() {
  const { user } = useAuth()
  
  const currentPlan = user?.subscription
    ? getPlanById(user.subscription.planId)
    : getPlanById('free')

  const daysUntilExpiry = user?.subscription?.expiresAt
    ? Math.ceil((new Date(user.subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  // Mock usage stats
  const usageStats = {
    requestsToday: 127,
    requestsThisMonth: 3847,
    tokensUsed: 245000,
  }

  const requestLimit = currentPlan?.limits.requestsPerDay || 50
  const usagePercentage = Math.min((usageStats.requestsToday / requestLimit) * 100, 100)

  const handleCancelSubscription = () => {
    toast.info('Функция отмены подписки будет доступна после интеграции платёжной системы')
  }

  const handleRenewSubscription = () => {
    toast.info('Функция продления подписки будет доступна после интеграции платёжной системы')
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Текущий тариф: {currentPlan?.name}
                {currentPlan?.isPopular && (
                  <Badge className="ml-2">Популярный</Badge>
                )}
              </CardTitle>
              <CardDescription>{currentPlan?.description}</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatPrice(currentPlan?.price || 0)}
                {!currentPlan?.isFree && <span className="text-sm font-normal text-muted-foreground">/мес</span>}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Info */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Действует до</p>
                <p className="font-medium">
                  {user?.subscription?.expiresAt
                    ? new Intl.DateTimeFormat('ru-RU').format(new Date(user.subscription.expiresAt))
                    : 'Бессрочно'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <Zap className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Запросов сегодня</p>
                <p className="font-medium">
                  {usageStats.requestsToday} / {requestLimit === -1 ? '∞' : requestLimit}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Автопродление</p>
                <p className="font-medium">
                  {user?.subscription?.isAutoRenewal ? 'Включено' : 'Отключено'}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Progress */}
          {requestLimit !== -1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Использовано запросов сегодня</span>
                <span className="font-medium">{Math.round(usagePercentage)}%</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              {usagePercentage >= 80 && (
                <p className="flex items-center gap-1 text-sm text-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  Лимит почти исчерпан. Рассмотрите апгрейд тарифа.
                </p>
              )}
            </div>
          )}

          {/* Features */}
          <div>
            <h4 className="mb-3 font-medium">Включено в тариф:</h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {currentPlan?.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/#pricing">Сменить тариф</Link>
          </Button>
          {!currentPlan?.isFree && (
            <>
              <Button variant="outline" onClick={handleRenewSubscription}>
                Продлить
              </Button>
              <Button variant="ghost" className="text-destructive" onClick={handleCancelSubscription}>
                Отменить подписку
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Upgrade Options */}
      {currentPlan?.id !== 'enterprise' && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">Улучшить тариф</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pricingPlans
              .filter(plan => {
                const currentIndex = pricingPlans.findIndex(p => p.id === currentPlan?.id)
                const planIndex = pricingPlans.findIndex(p => p.id === plan.id)
                return planIndex > currentIndex
              })
              .map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={cn(
                    'h-full transition-all hover:shadow-lg',
                    plan.isPopular && 'border-primary shadow-primary/20'
                  )}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {plan.isPopular && <Badge>Рекомендуем</Badge>}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-2xl font-bold">
                        {formatPrice(plan.price)}
                        <span className="text-sm font-normal text-muted-foreground">/мес</span>
                      </p>
                      <ul className="space-y-2">
                        {plan.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'} asChild>
                        <Link href={`/signup?plan=${plan.id}`}>Выбрать</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
