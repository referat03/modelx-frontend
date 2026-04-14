'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Calendar, Zap, CreditCard, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { pricingPlans, getPlanById, formatPrice, type PricingPlan } from '@/config/pricing.config'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function SubscriptionSettings() {
  const { user } = useAuth()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  
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
  }

  const requestLimit = currentPlan?.limits.requestsPerDay || 50
  const usagePercentage = requestLimit === -1 ? 0 : Math.min((usageStats.requestsToday / requestLimit) * 100, 100)

  const handleToggleAutoRenewal = () => {
    toast.info('Управление автопродлением будет доступно после интеграции платёжной системы')
  }

  const handleCancelSubscription = () => {
    setShowCancelDialog(false)
    toast.success('Подписка отменена. Она будет активна до конца оплаченного периода.')
  }

  const handleChangePlan = () => {
    if (selectedPlan) {
      setShowChangePlanDialog(false)
      toast.success(`Тариф изменён на "${selectedPlan.name}"`)
      setSelectedPlan(null)
    }
  }

  const openChangePlanDialog = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setShowChangePlanDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentPlan?.name}
            {currentPlan?.isPopular && <Badge>Популярный</Badge>}
          </CardTitle>
          <CardDescription>{currentPlan?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Действует до</span>
              </div>
              <p className="mt-1 font-semibold">
                {user?.subscription?.expiresAt
                  ? new Intl.DateTimeFormat('ru-RU').format(new Date(user.subscription.expiresAt))
                  : 'Бессрочно'}
              </p>
              {daysUntilExpiry > 0 && daysUntilExpiry <= 7 && (
                <p className="mt-1 text-xs text-amber-500">
                  Осталось {daysUntilExpiry} дней
                </p>
              )}
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Запросов сегодня</span>
              </div>
              <p className="mt-1 font-semibold">
                {usageStats.requestsToday} / {requestLimit === -1 ? '∞' : requestLimit}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Следующий платёж</span>
              </div>
              <p className="mt-1 font-semibold">
                {currentPlan?.isFree ? 'Не требуется' : formatPrice(currentPlan?.price || 0)}
              </p>
            </div>
          </div>

          {/* Usage Progress */}
          {requestLimit !== -1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Использование лимита</span>
                <span className="font-medium">{Math.round(usagePercentage)}%</span>
              </div>
              <Progress value={usagePercentage} />
              {usagePercentage >= 80 && (
                <p className="flex items-center gap-1 text-sm text-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  Лимит почти исчерпан
                </p>
              )}
            </div>
          )}

          {/* Features */}
          <div>
            <h4 className="mb-3 font-medium">Включено:</h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {currentPlan?.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Auto-renewal toggle */}
          {!currentPlan?.isFree && (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="auto-renewal" className="font-medium">
                  Автопродление
                </Label>
                <p className="text-sm text-muted-foreground">
                  Автоматически продлевать подписку
                </p>
              </div>
              <Switch
                id="auto-renewal"
                checked={user?.subscription?.isAutoRenewal}
                onCheckedChange={handleToggleAutoRenewal}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/#pricing">
              Сменить тариф
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {!currentPlan?.isFree && (
            <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
              Отменить подписку
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Доступные тарифы</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'transition-all cursor-pointer',
                plan.id === currentPlan?.id && 'border-primary',
                plan.isPopular && 'shadow-lg shadow-primary/10'
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex gap-2">
                    {plan.id === currentPlan?.id && (
                      <Badge variant="outline">Текущий</Badge>
                    )}
                    {plan.isPopular && <Badge>Популярный</Badge>}
                  </div>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-2xl font-bold">
                  {formatPrice(plan.price)}
                  {!plan.isFree && <span className="text-sm font-normal text-muted-foreground">/мес</span>}
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
                {plan.id === currentPlan?.id ? (
                  <Button disabled className="w-full">
                    Текущий тариф
                  </Button>
                ) : (
                  <Button
                    variant={plan.isPopular ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => openChangePlanDialog(plan)}
                  >
                    {plan.price > (currentPlan?.price || 0) ? 'Улучшить' : 'Выбрать'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить подписку?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить подписку? Вы потеряете доступ к премиум-функциям 
              после окончания текущего оплаченного периода. Это действие можно отменить, 
              оформив подписку заново.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Остаться</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Отменить подписку
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Plan Dialog */}
      <Dialog open={showChangePlanDialog} onOpenChange={setShowChangePlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сменить тариф</DialogTitle>
            <DialogDescription>
              Вы собираетесь перейти на тариф &quot;{selectedPlan?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Текущий тариф:</span>
                <span className="font-medium">{currentPlan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Новый тариф:</span>
                <span className="font-medium text-primary">{selectedPlan?.name}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-muted-foreground">Стоимость:</span>
                <span className="font-bold">{formatPrice(selectedPlan?.price || 0)}/мес</span>
              </div>
            </div>
            {selectedPlan && selectedPlan.price > (currentPlan?.price || 0) && (
              <p className="mt-3 text-sm text-muted-foreground">
                Разница в стоимости будет списана пропорционально оставшимся дням текущего периода.
              </p>
            )}
            {selectedPlan && selectedPlan.price < (currentPlan?.price || 0) && (
              <p className="mt-3 text-sm text-muted-foreground">
                Новый тариф вступит в силу со следующего расчётного периода.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePlanDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleChangePlan}>
              Подтвердить смену тарифа
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
