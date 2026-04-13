'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Smartphone, Monitor, LogOut, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Введите текущий пароль'),
  newPassword: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

// Mock sessions data
const mockSessions = [
  {
    id: '1',
    device: 'Chrome на Windows',
    icon: Monitor,
    location: 'Москва, Россия',
    lastActive: new Date(),
    isCurrent: true,
  },
  {
    id: '2',
    device: 'Safari на iPhone',
    icon: Smartphone,
    location: 'Москва, Россия',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isCurrent: false,
  },
  {
    id: '3',
    device: 'Firefox на MacOS',
    icon: Monitor,
    location: 'Санкт-Петербург, Россия',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
]

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Пароль успешно изменён')
    reset()
    setIsChangingPassword(false)
  }

  const handleTerminateSession = (sessionId: string) => {
    toast.success('Сессия завершена')
  }

  const handleTerminateAllSessions = () => {
    toast.success('Все сессии кроме текущей завершены')
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 5) return 'Сейчас'
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`
    if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)} ч. назад`
    return `${Math.floor(diffMinutes / (24 * 60))} д. назад`
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Смена пароля</CardTitle>
          <CardDescription>
            Используйте надёжный пароль длиной не менее 8 символов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('currentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? 'Сохранение...' : 'Сменить пароль'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Двухфакторная аутентификация
          </CardTitle>
          <CardDescription>
            Дополнительная защита вашего аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>2FA не включена</AlertTitle>
            <AlertDescription>
              Включите двухфакторную аутентификацию для дополнительной защиты аккаунта.
            </AlertDescription>
          </Alert>
          <Button
            className="mt-4"
            onClick={() => toast.info('2FA будет доступна после интеграции с бэкендом')}
          >
            Включить 2FA
          </Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Активные сессии</CardTitle>
              <CardDescription>
                Устройства, на которых вы авторизованы
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleTerminateAllSessions}>
              <LogOut className="mr-2 h-4 w-4" />
              Завершить все
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSessions.map((session) => {
              const SessionIcon = session.icon
              
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <SessionIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="flex items-center gap-2 font-medium">
                        {session.device}
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-xs">
                            Текущая
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {formatLastActive(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      Завершить
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Предупреждения безопасности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Подозрительная активность</AlertTitle>
            <AlertDescription>
              При обнаружении подозрительной активности (например, множественных аккаунтов) 
              вы получите уведомление на email.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
