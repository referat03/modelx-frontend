'use client'

import { Download, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Empty } from '@/components/ui/empty'
import { formatPrice } from '@/config/pricing.config'
import { toast } from 'sonner'

// Mock payment data
const mockPayments = [
  {
    id: 'pay_001',
    date: new Date('2024-03-01'),
    amount: 1490,
    status: 'success' as const,
    description: 'Подписка Pro - Март 2024',
    method: 'Visa •••• 4242',
  },
  {
    id: 'pay_002',
    date: new Date('2024-02-01'),
    amount: 1490,
    status: 'success' as const,
    description: 'Подписка Pro - Февраль 2024',
    method: 'Visa •••• 4242',
  },
  {
    id: 'pay_003',
    date: new Date('2024-01-01'),
    amount: 490,
    status: 'success' as const,
    description: 'Подписка Starter - Январь 2024',
    method: 'Visa •••• 4242',
  },
  {
    id: 'pay_004',
    date: new Date('2023-12-15'),
    amount: 490,
    status: 'failed' as const,
    description: 'Подписка Starter - Декабрь 2023',
    method: 'Visa •••• 1234',
  },
]

const statusConfig = {
  success: {
    label: 'Оплачено',
    icon: CheckCircle,
    variant: 'default' as const,
  },
  failed: {
    label: 'Ошибка',
    icon: XCircle,
    variant: 'destructive' as const,
  },
  pending: {
    label: 'В обработке',
    icon: Clock,
    variant: 'secondary' as const,
  },
}

export function PaymentHistory() {
  const handleDownloadReceipt = (paymentId: string) => {
    toast.info('Загрузка квитанций будет доступна после интеграции платёжной системы')
  }

  const handleManagePaymentMethods = () => {
    toast.info('Управление способами оплаты будет доступно после интеграции платёжной системы')
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Способы оплаты</CardTitle>
          <CardDescription>
            Управление сохранёнными картами и способами оплаты
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Visa •••• 4242</p>
                <p className="text-sm text-muted-foreground">Истекает 12/25</p>
              </div>
            </div>
            <Badge variant="outline">Основная</Badge>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleManagePaymentMethods}
          >
            Управление картами
          </Button>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>История платежей</CardTitle>
          <CardDescription>
            Все ваши транзакции и квитанции
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockPayments.length > 0 ? (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Способ оплаты</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => {
                    const status = statusConfig[payment.status]
                    const StatusIcon = status.icon

                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Intl.DateTimeFormat('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }).format(payment.date)}
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.method}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={status.variant}
                            className="flex w-fit items-center gap-1"
                          >
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.status === 'success' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadReceipt(payment.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty
              icon={<CreditCard className="h-12 w-12" />}
              title="Нет платежей"
              description="История платежей появится после первой оплаты"
            />
          )}
        </CardContent>
      </Card>

      {/* Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Платёжная информация</CardTitle>
          <CardDescription>
            Данные для выставления счетов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Настройка платёжной информации будет доступна после интеграции платёжной системы.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => toast.info('Настройка платёжной информации скоро будет доступна')}
          >
            Настроить
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
