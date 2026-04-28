'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Sparkles, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

const forgotPasswordSchema = z.object({
  email: z.string().email('Некорректный email'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const RESEND_COOLDOWN_SECONDS = 60

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  // Frontend-only resend cooldown timer.
  // NOTE: This is purely a UX safeguard against accidental spam clicks.
  // It is NOT secure rate limiting — backend throttling should be added separately.
  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await forgotPassword(data.email)

    if (result.success) {
      setEmail(data.email)
      setIsSubmitted(true)
      startCooldown()
      toast.success('Инструкции отправлены на вашу почту')
    } else {
      toast.error(result.error || 'Ошибка отправки')
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || isResending || !email) return
    setIsResending(true)
    try {
      const result = await forgotPassword(email)
      if (result.success) {
        startCooldown()
        toast.success('Инструкции отправлены повторно')
      } else {
        toast.error(result.error || 'Ошибка отправки')
      }
    } finally {
      setIsResending(false)
    }
  }

  const resendDisabled = cooldown > 0 || isResending

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ModelX</span>
          </Link>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          {!isSubmitted ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Восстановление пароля</CardTitle>
                <CardDescription>
                  Введите email, указанный при регистрации
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full cursor-pointer disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Отправка...' : 'Отправить инструкции'}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="justify-center">
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Вернуться к входу
                </Link>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Проверьте почту</CardTitle>
                <CardDescription>
                  Мы отправили инструкции по восстановлению пароля на{' '}
                  <span className="font-medium text-foreground break-all">{email}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Не получили письмо? Проверьте папку «Спам» или{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendDisabled}
                    aria-disabled={resendDisabled}
                    className="text-primary hover:underline disabled:no-underline disabled:opacity-60 disabled:hover:no-underline cursor-pointer disabled:cursor-not-allowed"
                  >
                    {cooldown > 0
                      ? `отправить повторно через ${cooldown} сек`
                      : isResending
                      ? 'отправляем...'
                      : 'отправьте повторно'}
                  </button>
                </p>
              </CardContent>

              <CardFooter className="justify-center">
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Вернуться к входу
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
