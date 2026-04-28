'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
  email: z.string().email('Некорректный email'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfilePanel() {
  const { user, updateProfile, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    const result = await updateProfile(data)
    
    if (result.success) {
      toast.success('Профиль обновлён')
      setIsEditing(false)
    } else {
      toast.error(result.error || 'Ошибка обновления')
    }
  }

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
          <CardDescription>
            Управление информацией вашего аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Аккаунт создан: {user?.createdAt ? new Intl.DateTimeFormat('ru-RU').format(user.createdAt) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Ваше имя"
                  className="pl-10"
                  disabled={!isEditing}
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

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
                  disabled={!isEditing}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Отмена
                  </Button>
                </>
              ) : (
                <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>
              )}
            </div>
          </form>

          {/* Role Badge */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Роль</p>
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'admin' ? 'Администратор' : user?.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                </p>
              </div>
              {user?.role === 'admin' && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Admin
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
