"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Brain,
  Activity,
  DollarSign,
  UserPlus,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const stats = [
  {
    title: "Всего пользователей",
    value: "12,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Активных подписок",
    value: "8,234",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: CreditCard,
  },
  {
    title: "Сообщений сегодня",
    value: "45,892",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: MessageSquare,
  },
  {
    title: "Доход (мес)",
    value: "₽2.4M",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
]

const revenueData = [
  { month: "Янв", revenue: 1200000, users: 8500 },
  { month: "Фев", revenue: 1350000, users: 9200 },
  { month: "Мар", revenue: 1500000, users: 10100 },
  { month: "Апр", revenue: 1680000, users: 10800 },
  { month: "Май", revenue: 1900000, users: 11500 },
  { month: "Июн", revenue: 2100000, users: 12200 },
  { month: "Июл", revenue: 2400000, users: 12847 },
]

const modelUsageData = [
  { model: "GPT-4", requests: 125000 },
  { model: "Claude 3", requests: 98000 },
  { model: "DALL-E 3", requests: 45000 },
  { model: "Midjourney", requests: 38000 },
  { model: "Gemini", requests: 32000 },
]

const recentUsers = [
  { id: 1, name: "Александр И.", email: "alex@mail.ru", plan: "Pro", joined: "2 мин назад" },
  { id: 2, name: "Мария С.", email: "maria@gmail.com", plan: "Basic", joined: "15 мин назад" },
  { id: 3, name: "Дмитрий К.", email: "dmitry@yandex.ru", plan: "Business", joined: "32 мин назад" },
  { id: 4, name: "Елена П.", email: "elena@mail.ru", plan: "Pro", joined: "1 час назад" },
]

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Панель администратора</h1>
        <p className="mt-1 text-muted-foreground">
          Обзор ключевых метрик и активности платформы
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === "positive" ? "text-green-500" : "text-red-500"
              }`}>
                {stat.change} за последний месяц
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Динамика дохода
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `₽${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [`₽${value.toLocaleString()}`, "Доход"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5 text-primary" />
              Использование моделей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelUsageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000)}k`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="model"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [value.toLocaleString(), "Запросов"]}
                  />
                  <Bar 
                    dataKey="requests" 
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <UserPlus className="h-5 w-5 text-primary" />
              Новые пользователи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      user.plan === "Business" 
                        ? "bg-yellow-500/20 text-yellow-500"
                        : user.plan === "Pro"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {user.plan}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="h-5 w-5 text-primary" />
              Системный статус
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "API Gateway", status: "operational", latency: "45ms" },
                { name: "База данных", status: "operational", latency: "12ms" },
                { name: "OpenAI API", status: "operational", latency: "234ms" },
                { name: "Anthropic API", status: "operational", latency: "198ms" },
                { name: "Очередь задач", status: "operational", latency: "8ms" },
              ].map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      service.status === "operational" ? "bg-green-500" : "bg-red-500"
                    }`} />
                    <span className="text-foreground">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{service.latency}</span>
                    <span className="text-xs text-green-500">Работает</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
