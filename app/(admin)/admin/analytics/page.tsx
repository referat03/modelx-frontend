"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BarChart3, Users, MessageSquare, TrendingUp } from "lucide-react"

const dailyUsageData = [
  { date: "01 Июл", messages: 42000, users: 3200 },
  { date: "02 Июл", messages: 45000, users: 3400 },
  { date: "03 Июл", messages: 38000, users: 3100 },
  { date: "04 Июл", messages: 52000, users: 3800 },
  { date: "05 Июл", messages: 48000, users: 3600 },
  { date: "06 Июл", messages: 55000, users: 4100 },
  { date: "07 Июл", messages: 61000, users: 4500 },
]

const planDistribution = [
  { name: "Free", value: 4500, color: "#6b7280" },
  { name: "Basic", value: 3200, color: "#3b82f6" },
  { name: "Pro", value: 4100, color: "#8b5cf6" },
  { name: "Business", value: 1047, color: "#f59e0b" },
]

const modelUsageData = [
  { hour: "00:00", gpt4: 1200, claude: 800, dalle: 300 },
  { hour: "04:00", gpt4: 800, claude: 500, dalle: 200 },
  { hour: "08:00", gpt4: 2500, claude: 1800, dalle: 600 },
  { hour: "12:00", gpt4: 4200, claude: 3100, dalle: 1200 },
  { hour: "16:00", gpt4: 3800, claude: 2900, dalle: 1100 },
  { hour: "20:00", gpt4: 3200, claude: 2400, dalle: 900 },
]

const retentionData = [
  { week: "Неделя 1", retention: 100 },
  { week: "Неделя 2", retention: 78 },
  { week: "Неделя 3", retention: 65 },
  { week: "Неделя 4", retention: 58 },
  { week: "Неделя 5", retention: 52 },
  { week: "Неделя 6", retention: 48 },
  { week: "Неделя 7", retention: 45 },
  { week: "Неделя 8", retention: 42 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Аналитика</h1>
        <p className="mt-1 text-muted-foreground">
          Детальная статистика использования платформы
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">4,521</span>
            </div>
            <p className="text-sm text-muted-foreground">Активных сегодня</p>
            <p className="mt-1 text-xs text-green-500">+12% от вчера</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">61,234</span>
            </div>
            <p className="text-sm text-muted-foreground">Сообщений сегодня</p>
            <p className="mt-1 text-xs text-green-500">+8% от вчера</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">42%</span>
            </div>
            <p className="text-sm text-muted-foreground">Конверсия Free→Paid</p>
            <p className="mt-1 text-xs text-green-500">+3% за месяц</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">13.5</span>
            </div>
            <p className="text-sm text-muted-foreground">Сообщ./пользователь</p>
            <p className="mt-1 text-xs text-muted-foreground">Среднее в день</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Активность по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    name="Сообщения"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Распределение по тарифам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Пользователей"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Использование моделей по часам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={modelUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="gpt4" stroke="#8b5cf6" name="GPT-4" strokeWidth={2} />
                  <Line type="monotone" dataKey="claude" stroke="#3b82f6" name="Claude" strokeWidth={2} />
                  <Line type="monotone" dataKey="dalle" stroke="#f59e0b" name="DALL-E" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Retention пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Retention"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="retention"
                    stroke="#10b981"
                    fill="rgba(16, 185, 129, 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
