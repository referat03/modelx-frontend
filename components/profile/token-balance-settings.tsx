'use client'

import Link from 'next/link'
import { Coins, ExternalLink, History, Calendar, Zap, CreditCard, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/auth-context'
import { formatTokensPrice } from '@/config/tokenPackages.config'
import { getPlanById, formatPrice } from '@/config/pricing.config'

// Моковая история покупок токенов
const mockPurchaseHistory = [
  {
    id: '1',
    date: new Date('2024-11-15'),
    packageName: '500 токенов',
    tokens: 500,
    price: 899,
    status: 'completed' as const,
  },
  {
    id: '2',
    date: new Date('2024-10-20'),
    packageName: '100 токенов',
    tokens: 100,
    price: 199,
    status: 'completed' as const,
  },
  {
    id: '3',
    date: new Date('2024-09-05'),
    packageName: '1000 токенов',
    tokens: 1000,
    price: 1490,
    status: 'completed' as const,
  },
]

export function TokenBalanceSettings() {
  const { user } = useAuth()

  const currentPlan = user?.subscription
    ? getPlanById(user.subscription.planId)
    : getPlanById('free')

  const daysUntilExpiry = user?.subscription?.expiresAt
    ? Math.ceil((new Date(user.subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  const usageStats = { requestsToday: 127 }
  const requestLimit = currentPlan?.limits.requestsPerDay || 50
  const usagePercentage = requestLimit === -1 ? 0 : Math.min((usageStats.requestsToday / requestLimit) * 100, 100)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Current Plan (from Subscription tab) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentPlan?.name}
            {currentPlan?.isPopular && <Badge>Популярный</Badge>}
          </CardTitle>
          <CardDescription>{currentPlan?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <p className="mt-1 text-xs text-amber-500">Осталось {daysUntilExpiry} дней</p>
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
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/#pricing">
              Сменить тариф
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      {/* Current Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Баланс токенов
          </CardTitle>
          <CardDescription>
            Ваш текущий баланс и история покупок
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Текущий баланс</p>
                <p className="text-4xl font-bold text-primary">
                  {(user?.tokenBalance ?? 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">токенов</p>
              </div>
              <Coins className="h-16 w-16 text-primary/20" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/buy-tokens">
              Купить токены
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            История покупок
          </CardTitle>
          <CardDescription>
            Все ваши покупки пакетов токенов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockPurchaseHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Пакет</TableHead>
                  <TableHead className="text-right">Токены</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPurchaseHistory.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(purchase.date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {purchase.packageName}
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      +{purchase.tokens}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatTokensPrice(purchase.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Оплачено
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Coins className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">История покупок пуста</p>
              <p className="text-sm text-muted-foreground">
                Приобретите пакет токенов, чтобы начать
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Как работают токены?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Токены используются для генерации ответов AI-моделей
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Разные модели потребляют разное количество токенов за запрос
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Неиспользованные токены не сгорают и сохраняются на вашем балансе
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              При наличии подписки токены расходуются из пакета подписки в первую очередь
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
