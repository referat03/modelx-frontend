'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

// 5 preset avatars served from /public/avatars
const AVATAR_PRESETS = [
  { id: 'ginger-cat', src: '/avatars/ginger-cat.jpg', label: 'Рыжий кот' },
  { id: 'spaniel', src: '/avatars/spaniel.jpg', label: 'Спаниель' },
  { id: 'capybara', src: '/avatars/capybara.jpg', label: 'Капибара' },
  { id: 'chicken', src: '/avatars/chicken.jpg', label: 'Курица' },
  { id: 'samoyed', src: '/avatars/samoyed.jpg', label: 'Самоед' },
] as const

const NAME_MIN = 2
const NAME_MAX = 60

function getInitials(name: string | undefined | null) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  return (first + second).toUpperCase() || first.toUpperCase()
}

function formatRegistrationDate(date: Date | string | undefined) {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function ProfileSettings() {
  const { user, updateProfile } = useAuth()

  // ─── Avatar picker ─────────────────────────────────────────────────────────
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState<string | null>(null)

  const handleSelectAvatar = async (src: string) => {
    if (!user || src === user.avatarUrl || savingAvatar) return
    setSavingAvatar(src)
    const res = await updateProfile({ avatarUrl: src })
    setSavingAvatar(null)
    if (res.success) {
      toast.success('Аватар обновлён')
      setAvatarOpen(false)
    } else {
      toast.error(res.error ?? 'Не удалось обновить аватар')
    }
  }

  // ─── Inline name edit ──────────────────────────────────────────────────────
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(user?.name ?? '')
  const [savingName, setSavingName] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Keep the draft in sync if the underlying user changes externally
  useEffect(() => {
    if (!isEditingName) setNameDraft(user?.name ?? '')
  }, [user?.name, isEditingName])

  const startEditingName = () => {
    setNameDraft(user?.name ?? '')
    setIsEditingName(true)
    // Focus on next tick so the input is mounted
    requestAnimationFrame(() => {
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
    })
  }

  const cancelEditingName = () => {
    setIsEditingName(false)
    setNameDraft(user?.name ?? '')
  }

  const trimmedDraft = nameDraft.trim()
  const nameValidationError = useMemo(() => {
    if (trimmedDraft.length < NAME_MIN) return `Минимум ${NAME_MIN} символа`
    if (trimmedDraft.length > NAME_MAX) return `Максимум ${NAME_MAX} символов`
    return null
  }, [trimmedDraft])

  const submitName = async () => {
    if (!user || savingName) return
    if (nameValidationError) {
      toast.error(nameValidationError)
      return
    }
    if (trimmedDraft === user.name) {
      setIsEditingName(false)
      return
    }
    setSavingName(true)
    const res = await updateProfile({ name: trimmedDraft })
    setSavingName(false)
    if (res.success) {
      toast.success('Имя обновлено')
      setIsEditingName(false)
    } else {
      toast.error(res.error ?? 'Не удалось обновить имя')
    }
  }

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitName()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEditingName()
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Identity card — avatar + name */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl">Профиль</CardTitle>
          <CardDescription>Ваш аватар и имя видны в чатах и шапке</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          {/* Avatar with picker */}
          <Popover open={avatarOpen} onOpenChange={setAvatarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Выбрать аватар"
                className={cn(
                  'group relative shrink-0 cursor-pointer rounded-full outline-none ring-offset-background',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              >
                <Avatar className="h-24 w-24 border border-border/60 shadow-sm transition-transform duration-200 group-hover:scale-[1.02]">
                  <AvatarImage src={user.avatarUrl ?? ''} alt={user.name} />
                  <AvatarFallback className="bg-primary/15 text-xl font-semibold text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {/* Subtle edit overlay on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-background/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <Pencil className="h-5 w-5 text-foreground" />
                </span>
                {/* Always-visible edit badge in the corner */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-110"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </span>
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              sideOffset={12}
              className="w-auto max-w-[min(92vw,360px)] border-border/60 bg-popover/95 p-3 backdrop-blur-xl"
            >
              <div className="mb-3 px-1">
                <p className="text-sm font-medium text-foreground">Выберите аватар</p>
                <p className="text-xs text-muted-foreground">5 готовых вариантов</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_PRESETS.map((preset) => {
                  const isActive = user.avatarUrl === preset.src
                  const isSaving = savingAvatar === preset.src
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectAvatar(preset.src)}
                      disabled={!!savingAvatar}
                      aria-label={preset.label}
                      aria-pressed={isActive}
                      title={preset.label}
                      className={cn(
                        'group relative aspect-square shrink-0 cursor-pointer overflow-hidden rounded-full',
                        'outline-none ring-offset-background transition-all duration-200',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed',
                        isActive
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'ring-1 ring-border/60 hover:scale-[1.04] hover:ring-foreground/40'
                      )}
                    >
                      <Image
                        src={preset.src}
                        alt={preset.label}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                      {(isActive || isSaving) && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center bg-foreground/35 backdrop-blur-[1px]"
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin text-background" />
                          ) : (
                            <Check className="h-4 w-4 text-background" strokeWidth={3} />
                          )}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Name + email block */}
          <div className="flex w-full min-w-0 flex-col items-center gap-3 sm:items-start">
            {isEditingName ? (
              <div className="flex w-full max-w-sm flex-col gap-2">
                <Label htmlFor="profile-name-input" className="sr-only">
                  Имя
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="profile-name-input"
                    ref={nameInputRef}
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onKeyDown={handleNameKeyDown}
                    maxLength={NAME_MAX + 5}
                    disabled={savingName}
                    aria-invalid={!!nameValidationError}
                    aria-describedby={nameValidationError ? 'profile-name-error' : undefined}
                    className="h-10 text-lg font-semibold"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={submitName}
                    disabled={savingName || !!nameValidationError}
                    aria-label="Сохранить имя"
                    className="h-10 w-10 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {savingName ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={cancelEditingName}
                    disabled={savingName}
                    aria-label="Отменить"
                    className="h-10 w-10 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                {nameValidationError ? (
                  <p id="profile-name-error" className="text-xs text-destructive">
                    {nameValidationError}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Enter — сохранить, Esc — отменить
                  </p>
                )}
              </div>
            ) : (
              <div className="flex w-full items-center justify-center gap-2 sm:justify-start">
                <h2 className="truncate text-2xl font-semibold tracking-tight" title={user.name}>
                  {user.name}
                </h2>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={startEditingName}
                  aria-label="Изменить имя"
                  className="h-8 w-8 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            )}

            <p className="truncate text-sm text-muted-foreground" title={user.email}>
              {user.email}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account info card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl">Информация об аккаунте</CardTitle>
          <CardDescription>Базовые данные вашего аккаунта</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
              <dd className="break-all text-sm font-medium text-foreground">{user.email}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Дата регистрации</dt>
              <dd className="text-sm font-medium text-foreground">
                {formatRegistrationDate(user.createdAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
