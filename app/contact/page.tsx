"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Mail, MessageSquare, Phone, MapPin, Send, Loader2 } from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Напишите нам на почту",
    value: "support@modelx.ru",
    href: "mailto:support@modelx.ru",
  },
  {
    icon: MessageSquare,
    title: "Telegram",
    description: "Быстрые ответы в чате",
    value: "@modelx_support",
    href: "https://t.me/modelx_support",
  },
  {
    icon: Phone,
    title: "Телефон",
    description: "Пн-Пт, 10:00-19:00 МСК",
    value: "+7 (495) 123-45-67",
    href: "tel:+74951234567",
  },
  {
    icon: MapPin,
    title: "Офис",
    description: "Приходите в гости",
    value: "Москва, ул. Примерная, д. 1",
    href: "https://maps.google.com",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success("Сообщение отправлено! Мы ответим в течение 24 часов.")
    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Свяжитесь с нами
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Есть вопросы? Мы всегда рады помочь. Выберите удобный способ связи 
              или заполните форму ниже.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full border-border bg-card transition-colors hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 transition-colors group-hover:bg-primary/30">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">
                      {method.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {method.description}
                    </p>
                    <p className="mt-2 text-sm text-primary">{method.value}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="mx-auto max-w-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Напишите нам</CardTitle>
              <CardDescription>
                Заполните форму и мы ответим в течение 24 часов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Тема</Label>
                  <Input
                    id="subject"
                    placeholder="О чем вы хотите поговорить?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea
                    id="message"
                    placeholder="Опишите ваш вопрос подробнее..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Отправить сообщение
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Link */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Ищете ответы на частые вопросы?{" "}
              <a href="/faq" className="text-primary hover:underline">
                Посетите раздел FAQ
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
