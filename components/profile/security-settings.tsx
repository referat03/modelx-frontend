'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, Smartphone, Monitor, LogOut, Shield, AlertTriangle } from 'lucide-react'
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
  // Tracks whether the password-change confirmation email has been "sent".
  // When true, the form is replaced with a confirmation Alert. The actual
  // password is NOT changed here — change happens only after the user clicks
  // the link in the confirmation email (real flow handled by backend).
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false)
  // Frontend-only cooldown for the "Отправить ещё раз" button. Seconds
  // remaining until the user can request another confirmation email.
  // This is purely a UX safeguard against accidental spam-clicking — it is
  // NOT secure backend rate limiting. Real throttling will be added on the
  // backend later.
  const RESEND_COOLDOWN_SECONDS = 60
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Drive the countdown. The interval is cleared as soon as the timer reaches
  // 0 OR the component unmounts, so we never leak timers between mounts of
  // the security tab.
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
        cooldownIntervalRef.current = null
      }
      return
    }
    if (cooldownIntervalRef.current) return
    cooldownIntervalRef.current = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
        cooldownIntervalRef.current = null
      }
    }
  }, [resendCooldown])

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

    // Mock: simulate sending a confirmation email instead of changing
    // the password directly. The actual password update will happen when
    // the user follows the link in the email (handled by backend later).
    await new Promise(resolve => setTimeout(resolve, 800))

    setIsChangingPassword(false)
    setEmailConfirmationSent(true)
    // Start cooldown immediately on the first send so the user cannot
    // spam-resend right after submitting.
    setResendCooldown(RESEND_COOLDOWN_SECONDS)
    reset()
    toast.success('Письмо для подтверждения отправлено')
  }

  const handleResendConfirmation = async () => {
    // Guard: do nothing if we're still inside the cooldown window. The button
    // is also visually disabled, but this guards against keyboard activation
    // edge cases.
    if (resendCooldown > 0 || isChangingPassword) return
    setIsChangingPassword(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    setIsChangingPassword(false)
    setResendCooldown(RESEND_COOLDOWN_SECONDS)
    toast.success('Письмо отправлено повторно')
  }

  const handleStartOver = () => {
    // Returning to the form does NOT reset the cooldown, so users cannot
    // bypass it by toggling back and forth. The cooldown will simply expire
    // in the background.
    setEmailConfirmationSent(false)
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
            Для смены пароля потребуется подтверждение по email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailConfirmationSent ? (
            <div className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertTitle>Письмо отправлено</AlertTitle>
                <AlertDescription>
                  Для смены пароля мы отправили письмо с подтверждением на вашу почту.
                  Перейдите по ссылке в письме, чтобы подтвердить смену пароля.
                </AlertDescription>
              </Alert>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleResendConfirmation}
                  disabled={isChangingPassword || resendCooldown > 0}
                  aria-busy={isChangingPassword}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  {isChangingPassword
                    ? 'Отправка...'
                    : resendCooldown > 0
                      ? `Отправить повторно через ${resendCooldown} сек`
                      : 'Отправить ещё раз'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleStartOver}
                  disabled={isChangingPassword}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  Изменить пароль ещё раз
                </Button>
              </div>
            </div>
          ) : (
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              aria-busy={isChangingPassword}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {isChangingPassword ? 'Отправка...' : 'Сменить пароль'}
            </Button>
          </form>
          )}
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
            <AlertTitle>2FA временно отключена</AlertTitle>
          </Alert>
          <Button
            className="mt-4 cursor-pointer disabled:cursor-not-allowed"
            onClick={() => toast.info('2FA временно отключена')}
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
            <Button variant="outline" size="sm" onClick={handleTerminateAllSessions} className="cursor-pointer disabled:cursor-not-allowed">
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
                      className="cursor-pointer disabled:cursor-not-allowed"
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
