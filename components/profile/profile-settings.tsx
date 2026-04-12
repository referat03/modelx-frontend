'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Camera, Save, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
  email: z.string().email('Некорректный email'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileSettings() {
  const { user, updateProfile, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Фото профиля</CardTitle>
          <CardDescription>
            Ваше фото будет отображаться в чатах и профиле
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-3xl text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => toast.info('Загрузка аватара будет доступна после интеграции хранилища')}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => toast.info('Загрузка аватара будет доступна после интеграции хранилища')}
              >
                Загрузить фото
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Личная информация</CardTitle>
          <CardDescription>
            Обновите свои личные данные
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {user?.isEmailVerified && (
                <p className="flex items-center gap-1 text-xs text-green-500">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Email подтверждён
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button type="submit" disabled={isLoading || !isDirty}>
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
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Информация об аккаунте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
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

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Дата регистрации</p>
              <p className="text-sm text-muted-foreground">
                {user?.createdAt ? new Intl.DateTimeFormat('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(user.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Опасная зона</CardTitle>
          <CardDescription>
            Необратимые действия с аккаунтом
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Удаление аккаунта</AlertTitle>
            <AlertDescription>
              После удаления аккаунта все ваши данные будут безвозвратно утеряны.
            </AlertDescription>
          </Alert>
          <Button
            variant="destructive"
            className="mt-4"
            onClick={() => toast.info('Удаление аккаунта будет доступно после интеграции с бэкендом')}
          >
            Удалить аккаунт
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
