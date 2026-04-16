"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Settings,
  Globe,
  Mail,
  CreditCard,
  Shield,
  Bell,
  Database,
  Key,
} from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "ModelX",
    siteDescription: "Все лучшие нейросети в одной подписке",
    supportEmail: "support@modelx.ru",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    freeTrialDays: 7,
    maxFreeMessages: 50,
    stripePublicKey: "pk_live_xxx",
    stripeSecretKey: "sk_live_xxx",
    openaiApiKey: "sk-xxx",
    anthropicApiKey: "sk-ant-xxx",
  })

  const handleSave = () => {
    toast.success("Настройки сохранены")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Настройки</h1>
        <p className="mt-1 text-muted-foreground">
          Конфигурация платформы и интеграций
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            Общие
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Платежи
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Key className="h-4 w-4" />
            Интеграции
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Globe className="h-5 w-5 text-primary" />
                Основные настройки
              </CardTitle>
              <CardDescription>
                Базовая информация о платформе
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Название сайта</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteDescription">Описание</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Email поддержки</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5 text-primary" />
                Безопасность и регистрация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Режим обслуживания</p>
                  <p className="text-sm text-muted-foreground">
                    Закрыть доступ для пользователей
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Регистрация</p>
                  <p className="text-sm text-muted-foreground">
                    Разрешить новые регистрации
                  </p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, registrationEnabled: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Подтверждение email</p>
                  <p className="text-sm text-muted-foreground">
                    Требовать подтверждение email при регистрации
                  </p>
                </div>
                <Switch
                  checked={settings.emailVerificationRequired}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailVerificationRequired: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5 text-primary" />
                Лимиты и пробный период
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="freeTrialDays">Дней пробного периода</Label>
                <Input
                  id="freeTrialDays"
                  type="number"
                  value={settings.freeTrialDays}
                  onChange={(e) =>
                    setSettings({ ...settings, freeTrialDays: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxFreeMessages">Лимит бесплатных сообщений</Label>
                <Input
                  id="maxFreeMessages"
                  type="number"
                  value={settings.maxFreeMessages}
                  onChange={(e) =>
                    setSettings({ ...settings, maxFreeMessages: parseInt(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Stripe
              </CardTitle>
              <CardDescription>
                Настройки платежной системы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="stripePublicKey">Публичный ключ</Label>
                <Input
                  id="stripePublicKey"
                  value={settings.stripePublicKey}
                  onChange={(e) =>
                    setSettings({ ...settings, stripePublicKey: e.target.value })
                  }
                  type="password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stripeSecretKey">Секретный ключ</Label>
                <Input
                  id="stripeSecretKey"
                  value={settings.stripeSecretKey}
                  onChange={(e) =>
                    setSettings({ ...settings, stripeSecretKey: e.target.value })
                  }
                  type="password"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Key className="h-5 w-5 text-primary" />
                API Ключи
              </CardTitle>
              <CardDescription>
                Ключи для интеграции с AI провайдерами
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  value={settings.openaiApiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, openaiApiKey: e.target.value })
                  }
                  type="password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="anthropicApiKey">Anthropic API Key</Label>
                <Input
                  id="anthropicApiKey"
                  value={settings.anthropicApiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, anthropicApiKey: e.target.value })
                  }
                  type="password"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Mail className="h-5 w-5 text-primary" />
                Email уведомления
              </CardTitle>
              <CardDescription>
                Настройки отправки email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Приветственные письма</p>
                  <p className="text-sm text-muted-foreground">
                    Отправлять при регистрации
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Уведомления о платежах</p>
                  <p className="text-sm text-muted-foreground">
                    Отправлять чеки и напоминания
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Маркетинговые рассылки</p>
                  <p className="text-sm text-muted-foreground">
                    Новости и обновления
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>Сохранить настройки</Button>
      </div>
    </div>
  )
}
