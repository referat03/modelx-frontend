"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Download,
  Filter,
  CreditCard,
  TrendingUp,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

interface Payment {
  id: string
  user: string
  email: string
  amount: number
  currency: string
  plan: string
  status: "completed" | "pending" | "failed" | "refunded"
  method: string
  date: string
}

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    user: "Александр Иванов",
    email: "alex@mail.ru",
    amount: 1990,
    currency: "RUB",
    plan: "Pro",
    status: "completed",
    method: "Visa *4242",
    date: "2024-07-15 14:32",
  },
  {
    id: "PAY-002",
    user: "Мария Смирнова",
    email: "maria@gmail.com",
    amount: 4990,
    currency: "RUB",
    plan: "Business",
    status: "completed",
    method: "Mastercard *5555",
    date: "2024-07-15 13:45",
  },
  {
    id: "PAY-003",
    user: "Дмитрий Козлов",
    email: "dmitry@yandex.ru",
    amount: 990,
    currency: "RUB",
    plan: "Basic",
    status: "pending",
    method: "SberPay",
    date: "2024-07-15 12:20",
  },
  {
    id: "PAY-004",
    user: "Елена Петрова",
    email: "elena@mail.ru",
    amount: 1990,
    currency: "RUB",
    plan: "Pro",
    status: "failed",
    method: "Visa *1234",
    date: "2024-07-15 11:15",
  },
  {
    id: "PAY-005",
    user: "Сергей Волков",
    email: "sergey@outlook.com",
    amount: 1990,
    currency: "RUB",
    plan: "Pro",
    status: "refunded",
    method: "Mir *7777",
    date: "2024-07-14 18:30",
  },
]

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayments = mockPayments.filter(
    (payment) =>
      payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: Payment["status"]) => {
    const config = {
      completed: { icon: CheckCircle, class: "bg-green-500/20 text-green-500", label: "Успешно" },
      pending: { icon: Clock, class: "bg-yellow-500/20 text-yellow-500", label: "Ожидание" },
      failed: { icon: XCircle, class: "bg-red-500/20 text-red-500", label: "Ошибка" },
      refunded: { icon: RefreshCcw, class: "bg-blue-500/20 text-blue-500", label: "Возврат" },
    }
    const { icon: Icon, class: className, label } = config[status]
    return (
      <Badge className={`gap-1 ${className}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const totalRevenue = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Платежи</h1>
          <p className="mt-1 text-muted-foreground">
            История транзакций и управление платежами
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-foreground">
                {totalRevenue.toLocaleString()} ₽
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Доход сегодня</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              {mockPayments.filter((p) => p.status === "completed").length}
            </div>
            <p className="text-sm text-muted-foreground">Успешных платежей</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">
              {mockPayments.filter((p) => p.status === "pending").length}
            </div>
            <p className="text-sm text-muted-foreground">Ожидают обработки</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">
              {mockPayments.filter((p) => p.status === "failed").length}
            </div>
            <p className="text-sm text-muted-foreground">Неудачных</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по ID, имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Фильтры
          </Button>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">История платежей</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Пользователь</TableHead>
                <TableHead className="text-muted-foreground">Сумма</TableHead>
                <TableHead className="text-muted-foreground">Тариф</TableHead>
                <TableHead className="text-muted-foreground">Статус</TableHead>
                <TableHead className="text-muted-foreground">Способ</TableHead>
                <TableHead className="text-muted-foreground">Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="border-border">
                  <TableCell className="font-mono text-sm text-foreground">
                    {payment.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{payment.user}</p>
                      <p className="text-sm text-muted-foreground">{payment.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {payment.amount.toLocaleString()} {payment.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.plan}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {payment.method}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
