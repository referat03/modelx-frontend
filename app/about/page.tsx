import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Zap, Users, Globe, Heart } from "lucide-react"

export const metadata = {
  title: "О нас",
  description: "Узнайте больше о ModelX - платформе для доступа к лучшим AI-моделям",
}

const values = [
  {
    icon: Brain,
    title: "Инновации",
    description: "Мы постоянно интегрируем новейшие AI-модели и технологии",
  },
  {
    icon: Shield,
    title: "Безопасность",
    description: "Ваши данные защищены по высшим стандартам безопасности",
  },
  {
    icon: Zap,
    title: "Скорость",
    description: "Мгновенный доступ к AI без сложных настроек и интеграций",
  },
  {
    icon: Users,
    title: "Сообщество",
    description: "Более 12,000 пользователей доверяют нам каждый день",
  },
  {
    icon: Globe,
    title: "Доступность",
    description: "Работаем по всему миру, поддержка на русском языке",
  },
  {
    icon: Heart,
    title: "Забота",
    description: "Техподдержка 24/7 и постоянное улучшение сервиса",
  },
]

const team = [
  {
    name: "Игорь Масловский",
    role: "CEO & Основатель",
    bio: "Создатель ModelX, визионер в области AI",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Делаем AI доступным для каждого
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              ModelX — это единая платформа, объединяющая лучшие нейросети мира. 
              Мы верим, что передовые технологии искусственного интеллекта должны быть 
              доступны каждому, без сложных настроек и множества подписок.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card/50 px-4 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
            {[
              { value: "12,847", label: "Пользователей" },
              { value: "5M+", label: "Сообщений обработано" },
              { value: "15+", label: "AI-моделей" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-foreground">
              Наши ценности
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Принципы, которыми мы руководствуемся при создании продукта
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <Card key={value.title} className="border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-border bg-card/50 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-foreground">
              Наша команда
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Люди, которые делают ModelX возможным
            </p>
            <div className="mt-12 flex justify-center">
              {team.map((member) => (
                <Card key={member.name} className="border-border bg-card text-center max-w-sm">
                  <CardContent className="pt-6">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-2 text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
