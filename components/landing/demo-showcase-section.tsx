'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  ImageIcon,
  Volume2,
  Video,
  ChevronRight,
  ChevronLeft,
  Check,
  Mic,
  Music,
  Film,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { models, modelCategories, getModelsByCategory, type ModelCategory, type AIModel } from '@/config/models.config'

// ─── Demo meta-data for each model ───────────────────────────────────────────

interface ModelMeta {
  bestFor: string[]
  providerColor: string
}

const modelMeta: Record<string, ModelMeta> = {
  'gpt-4': {
    bestFor: ['Глубокий анализ и многоэтапный reasoning', 'Написание и рефакторинг кода', 'Стратегический и деловой текст'],
    providerColor: 'text-emerald-400',
  },
  'gpt-3.5-turbo': {
    bestFor: ['Чат-боты и автоматизация', 'Быстрые резюме и переводы', 'Массовая генерация контента'],
    providerColor: 'text-emerald-400',
  },
  'claude-3': {
    bestFor: ['Анализ объёмных документов (100K токенов)', 'Академическое и аналитическое письмо', 'Безопасная и взвешенная генерация'],
    providerColor: 'text-orange-400',
  },
  'gemini-pro': {
    bestFor: ['Мультимодальный анализ текста и данных', 'Работа с кодом и SQL', 'Задачи поиска и Q&A'],
    providerColor: 'text-blue-400',
  },
  'llama-2': {
    bestFor: ['Приватные корпоративные развёртывания', 'Fine-tuning под специфику задач', 'Исследования и прототипирование'],
    providerColor: 'text-blue-500',
  },
  'dall-e-3': {
    bestFor: ['Концепт-арт и фотореалистичные сцены', 'Маркетинговые и рекламные креативы', 'UI-мокапы и продуктовые визуалы'],
    providerColor: 'text-emerald-400',
  },
  'midjourney': {
    bestFor: ['Художественные и editorial-проекты', 'Брендинг и концепт-дизайн', 'Fashion и lifestyle-визуалы'],
    providerColor: 'text-purple-400',
  },
  'stable-diffusion': {
    bestFor: ['Inpainting и точечное редактирование', 'Кастомные fine-tuned стили', 'Продуктовые и технические визуалы'],
    providerColor: 'text-yellow-400',
  },
  'whisper': {
    bestFor: ['Транскрипция интервью и подкастов', 'Субтитры для видео', 'Мультиязычные голосовые команды'],
    providerColor: 'text-emerald-400',
  },
  'elevenlabs': {
    bestFor: ['Озвучка и дикторский текст', 'Голосовые ассистенты и IVR', 'Аудиокниги и обучающие курсы'],
    providerColor: 'text-sky-400',
  },
  'musicgen': {
    bestFor: ['Фоновая музыка для видео', 'Джинглы и рекламные треки', 'Эмбиент и саундтреки'],
    providerColor: 'text-blue-500',
  },
  'runway-gen2': {
    bestFor: ['Кинематографические text-to-video клипы', 'Рекламные и маркетинговые ролики', 'Социальные медиа-креативы'],
    providerColor: 'text-rose-400',
  },
  'pika': {
    bestFor: ['Редактирование существующего видео', 'Короткий контент для соцсетей', 'Animated-визуалы для брендов'],
    providerColor: 'text-violet-400',
  },
}

// ─── Image carousel data ──────────────────────────────────────────────────────

const imageCarouselItems = [
  { src: '/demo/img-preview-1.jpg', prompt: 'Cyberpunk city, neon lights', model: 'DALL-E 3' },
  { src: '/demo/img-preview-2.jpg', prompt: 'Ethereal cosmic nebula', model: 'Midjourney' },
  { src: '/demo/img-preview-3.jpg', prompt: 'Luxury product crystal', model: 'Stable Diffusion XL' },
  { src: '/demo/img-preview-4.jpg', prompt: 'Futuristic android portrait', model: 'DALL-E 3' },
  { src: '/demo/img-preview-5.jpg', prompt: 'Surreal floating architecture', model: 'Midjourney' },
]

// ─── Category icons map ───────────────────────────────────────────────────────

const categoryIcons: Record<ModelCategory, React.ElementType> = {
  text: MessageSquare,
  image: ImageIcon,
  audio: Volume2,
  video: Video,
}

const categoryLabels: Record<ModelCategory, string> = {
  text: 'Текст',
  image: 'Изображения',
  audio: 'Аудио',
  video: 'Видео',
}

// ─── Text preview ─────────────────────────────────────────────────────────────

function TextPreview({ model }: { model: AIModel }) {
  const responses: Record<string, { prompt: string; response: string; hasCode?: boolean }> = {
    'gpt-4': {
      prompt: 'Объясни концепцию async/await в TypeScript',
      response: 'Async/await — синтаксический сахар над Promise, делающий асинхронный код читаемым. Функция с async всегда возвращает Promise, а await приостанавливает выполнение до его разрешения.',
      hasCode: true,
    },
    'gpt-3.5-turbo': {
      prompt: 'Напиши краткое описание продукта для SaaS',
      response: 'ModelX — единая AI-платформа для команд. Получите доступ к GPT-4, Claude и Midjourney в одном интерфейсе без управления API-ключами.',
    },
    'claude-3': {
      prompt: 'Проанализируй этот бизнес-документ на 50 страниц',
      response: 'Документ охватывает три ключевые темы: масштабирование GTM-стратегии, оптимизацию unit-экономики и конкурентное позиционирование. Основные риски сосредоточены в разделах 3 и 7.',
    },
    'gemini-pro': {
      prompt: 'Найди ошибки в этом SQL-запросе',
      response: 'Обнаружено три проблемы: отсутствует индекс на user_id, N+1 запрос в подзапросе и потенциальная SQL-инъекция через неэкранированный параметр.',
      hasCode: true,
    },
    'llama-2': {
      prompt: 'Сгенерируй описание для REST API endpoint',
      response: 'POST /api/v1/generate — принимает JSON с полями model, prompt и max_tokens. Возвращает stream ответа в формате Server-Sent Events для real-time вывода.',
      hasCode: true,
    },
  }

  const data = responses[model.id] || responses['gpt-4']

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground">ModelX Chat — {model.name}</span>
      </div>

      {/* Prompt bubble */}
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/20 px-3.5 py-2.5 text-sm border border-primary/20">
          {data.prompt}
        </div>
      </div>

      {/* Model response */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-muted/50 px-3.5 py-2.5 text-sm leading-relaxed text-foreground/90">
            {data.response}
          </div>
          {data.hasCode && (
            <div className="rounded-lg border border-border/40 bg-zinc-950 px-3.5 py-2.5 font-mono text-xs text-emerald-400/90">
              <span className="text-muted-foreground">// Пример</span>{'\n'}
              <span className="text-blue-400">const</span>{' '}
              <span className="text-foreground/80">result</span>{' '}
              <span className="text-muted-foreground">=</span>{' '}
              <span className="text-yellow-400">await</span>{' '}
              <span className="text-emerald-400">modelx</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-blue-300">generate</span>
              <span className="text-foreground/60">{'({ model: \''}{model.id}{'\' })'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="mt-auto flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5">
        <span className="flex-1 text-sm text-muted-foreground/60">Введите запрос...</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/80">
          <ArrowRight className="h-3.5 w-3.5 text-white" />
        </div>
      </div>
    </div>
  )
}

// ─── Image preview carousel ───────────────────────────────────────────────────

function ImagePreview() {
  const [active, setActive] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % imageCarouselItems.length)
    }, 4000)
  }, [])

  useEffect(() => {
    startAutoplay()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startAutoplay])

  const go = (dir: number) => {
    setActive(prev => (prev + dir + imageCarouselItems.length) % imageCarouselItems.length)
    startAutoplay()
  }

  const goTo = (i: number) => {
    setActive(i)
    startAutoplay()
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Main image area */}
      <div className="relative overflow-hidden rounded-xl border border-border/40 bg-zinc-950" style={{ aspectRatio: '16/9' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={imageCarouselItems[active].src}
              alt={imageCarouselItems[active].prompt}
              fill
              className="object-cover"
              priority={active === 0}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Prev/Next */}
        <button
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-sm transition hover:bg-black/70 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-sm transition hover:bg-black/70 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Prompt label */}
        <div className="absolute bottom-3 left-3 right-12 flex items-center gap-2">
          <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-xs text-white/80 backdrop-blur-sm truncate">
            &ldquo;{imageCarouselItems[active].prompt}&rdquo;
          </span>
          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/20 px-2.5 py-1 text-xs text-primary backdrop-blur-sm">
            {imageCarouselItems[active].model}
          </span>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {imageCarouselItems.map((item, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'relative shrink-0 overflow-hidden rounded-lg border transition-all cursor-pointer',
              'h-14 w-20',
              i === active
                ? 'border-primary shadow-md shadow-primary/30 ring-1 ring-primary/40'
                : 'border-border/40 opacity-60 hover:opacity-90'
            )}
          >
            <Image src={item.src} alt={item.prompt} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {imageCarouselItems.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'rounded-full transition-all cursor-pointer',
              i === active ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground'
            )}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Video preview ────────────────────────────────────────────────────────────

const videoScenes = [
  { label: 'Сцена 01', duration: '0:04', desc: 'Cityscape aerial shot, purple twilight' },
  { label: 'Сцена 02', duration: '0:03', desc: 'Close-up product reveal, slow motion' },
  { label: 'Сцена 03', duration: '0:05', desc: 'Abstract particle transition' },
  { label: 'Сцена 04', duration: '0:04', desc: 'Character medium shot, neon glow' },
]

function VideoPreview({ model }: { model: AIModel }) {
  const [playing, setPlaying] = useState(false)
  const [activeScene, setActiveScene] = useState(0)

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Main viewport */}
      <div
        className="relative overflow-hidden rounded-xl border border-border/40 bg-zinc-950"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Cinematic bars */}
        <div className="absolute inset-x-0 top-0 h-6 bg-black/80 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-black/80 z-10" />

        {/* Scene content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-3 text-4xl font-bold text-white/10 select-none font-serif tracking-widest uppercase text-xs">
              {videoScenes[activeScene].desc}
            </div>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          </div>
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.015)_2px,rgba(255,255,255,0.015)_4px)]" />
        </div>

        {/* Play button */}
        <button
          onClick={() => setPlaying(p => !p)}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-sm transition hover:bg-white/20 cursor-pointer"
        >
          {playing
            ? <Pause className="h-5 w-5 text-white" />
            : <Play className="h-5 w-5 translate-x-0.5 text-white" />
          }
        </button>

        {/* Timecode */}
        <div className="absolute bottom-7 right-3 z-20 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs text-white/60">
          {videoScenes[activeScene].duration}
        </div>

        {/* Model badge */}
        <div className="absolute top-7 left-3 z-20 flex items-center gap-1.5 rounded-full border border-primary/30 bg-black/60 px-2.5 py-1 text-xs text-primary backdrop-blur-sm">
          <Film className="h-3 w-3" />
          {model.name}
        </div>
      </div>

      {/* Scene strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {videoScenes.map((scene, i) => (
          <button
            key={i}
            onClick={() => setActiveScene(i)}
            className={cn(
              'flex flex-col rounded-lg border p-2 text-left transition cursor-pointer',
              i === activeScene
                ? 'border-primary/40 bg-primary/10'
                : 'border-border/30 bg-card/40 hover:border-border/60'
            )}
          >
            <span className="text-xs font-medium text-foreground/80">{scene.label}</span>
            <span className="mt-0.5 text-xs text-muted-foreground truncate">{scene.duration}</span>
          </button>
        ))}
      </div>

      {/* Timeline bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Таймлайн</span>
          <span>0:16 / 0:16</span>
        </div>
        <div className="relative h-1.5 w-full rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${((activeScene + 1) / videoScenes.length) * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background shadow"
            style={{ left: `calc(${((activeScene + 1) / videoScenes.length) * 100}% - 6px)` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Audio preview ────────────────────────────────────────────────────────────

const audioTracks = [
  { name: 'Intro Voiceover', type: 'voice', duration: '0:28', active: true },
  { name: 'Background Score', type: 'music', duration: '2:14', active: false },
  { name: 'SFX — Transition', type: 'sfx', duration: '0:03', active: false },
]

function AudioPreview({ model }: { model: AIModel }) {
  const [playing, setPlaying] = useState(false)
  const bars = Array.from({ length: 48 })

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm">
      {/* Model badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
            {model.id === 'musicgen' ? <Music className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4 text-primary" />}
          </div>
          <div>
            <p className="text-sm font-medium">{model.name}</p>
            <p className="text-xs text-muted-foreground">{model.provider}</p>
          </div>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary">
          {model.id === 'musicgen' ? 'Генерация музыки' : model.id === 'whisper' ? 'Транскрипция' : 'Синтез речи'}
        </span>
      </div>

      {/* Waveform */}
      <div className="relative flex h-20 items-center justify-center gap-px overflow-hidden rounded-lg bg-zinc-950/80 px-4">
        {bars.map((_, i) => {
          const height = 20 + Math.sin(i * 0.4) * 12 + Math.cos(i * 0.7 + 1) * 10 + Math.sin(i * 1.1) * 8
          const isPlayed = i < (playing ? 24 : 18)
          return (
            <motion.div
              key={i}
              className={cn(
                'rounded-full w-1 shrink-0',
                isPlayed ? 'bg-primary' : 'bg-border/60'
              )}
              style={{ height: `${height}px` }}
              animate={playing ? { scaleY: [1, 1.2 + Math.random() * 0.4, 1] } : { scaleY: 1 }}
              transition={{ duration: 0.4 + Math.random() * 0.3, repeat: playing ? Infinity : 0, ease: 'easeInOut' }}
            />
          )
        })}
        {/* Progress overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-950/40" />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying(p => !p)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary transition hover:bg-primary/80 cursor-pointer"
        >
          {playing ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 translate-x-0.5 text-white" />}
        </button>
        <div className="flex-1 space-y-1">
          <div className="h-1 rounded-full bg-muted/60">
            <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:11</span>
            <span>0:28</span>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-1.5">
        {audioTracks.map((track, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-3 py-2 transition',
              track.active
                ? 'border-primary/30 bg-primary/10'
                : 'border-border/30 bg-muted/20'
            )}
          >
            <div className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
              track.type === 'music' ? 'bg-violet-500/20' : track.type === 'sfx' ? 'bg-amber-500/20' : 'bg-primary/20'
            )}>
              {track.type === 'music'
                ? <Music className="h-3 w-3 text-violet-400" />
                : track.type === 'sfx'
                  ? <Zap className="h-3 w-3 text-amber-400" />
                  : <Mic className="h-3 w-3 text-primary" />
              }
            </div>
            <span className="flex-1 text-xs font-medium">{track.name}</span>
            <span className="text-xs text-muted-foreground">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function DemoShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState<ModelCategory>('image')
  const [activeModelId, setActiveModelId] = useState('dall-e-3')

  const categoryModels = getModelsByCategory(activeCategory)
  const activeModel = models.find(m => m.id === activeModelId) ?? categoryModels[0]

  const handleCategoryChange = (cat: ModelCategory) => {
    setActiveCategory(cat)
    const first = getModelsByCategory(cat)[0]
    if (first) setActiveModelId(first.id)
  }

  const meta = modelMeta[activeModel?.id ?? ''] ?? {
    bestFor: activeModel?.supportedFeatures ?? [],
    providerColor: 'text-primary',
  }

  return (
    <section className="relative overflow-x-hidden py-16 sm:py-24">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Все топовые AI-модели{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              в одном интерфейсе
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Переключайтесь между моделями для текста, изображений, видео и аудио в одном удобном пространстве.
          </p>
        </motion.div>

        {/* Main showcase container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="rounded-2xl border border-border/50 bg-card/30 p-3 backdrop-blur-sm shadow-2xl shadow-black/30 sm:p-6 lg:p-8"
          style={{ boxShadow: '0 0 0 1px hsl(var(--border) / 0.5), 0 24px 80px -12px rgba(0,0,0,0.5), 0 0 60px -20px hsl(var(--primary) / 0.12)' }}
        >
          {/* Category tabs — primary navigation level */}
          <div className="mb-7 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max gap-1 rounded-xl border border-border/50 bg-muted/50 p-1.5 shadow-inner shadow-black/20">
              {modelCategories.map(cat => {
                const Icon = categoryIcons[cat.id]
                const isActive = cat.id === activeCategory
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={cn(
                      'flex items-center justify-center gap-2.5 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap',
                      isActive
                        ? 'bg-card text-foreground border border-primary/25 shadow-md shadow-primary/10 ring-1 ring-primary/10'
                        : 'text-muted-foreground/70 hover:text-foreground/80 hover:bg-card/40'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground/50')} />
                    <span>{categoryLabels[cat.id]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model pills — secondary selection level */}
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max gap-1.5 pb-0.5">
              {categoryModels.map(model => {
                const isActive = model.id === activeModelId
                return (
                  <button
                    key={model.id}
                    onClick={() => setActiveModelId(model.id)}
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap',
                      isActive
                        ? 'border-primary/40 bg-primary/10 text-primary/90'
                        : 'border-border/30 bg-transparent text-muted-foreground/60 hover:border-border/60 hover:text-muted-foreground',
                      !model.isAvailable && 'opacity-40'
                    )}
                  >
                    <span>{model.emoji}</span>
                    <span>{model.name}</span>
                    {!model.isAvailable && (
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">скоро</span>
                    )}
                    {isActive && <Check className="h-3 w-3" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Two-column panel: stacked on mobile, side-by-side on lg+ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModelId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1.6fr]"
            >
              {/* ── Left info panel ── */}
              <div className="flex flex-col gap-4 sm:gap-5">
                {/* Model name + provider */}
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{activeModel?.emoji}</span>
                    <h3 className="text-lg font-bold tracking-tight sm:text-xl">{activeModel?.name}</h3>
                    {activeModel && !activeModel.isAvailable && (
                      <span className="rounded-full border border-border/40 bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Скоро
                      </span>
                    )}
                  </div>
                  <p className={cn('text-sm font-medium', meta.providerColor)}>{activeModel?.provider}</p>
                </div>

                {/* Best for */}
                <div>
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                    Лучше всего для
                  </p>
                  <ul className="space-y-2">
                    {meta.bestFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20">
                          <Check className="h-2.5 w-2.5 text-primary" />
                        </div>
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="pt-1 lg:mt-auto lg:pt-2">
                  <Button className="group w-full sm:w-auto" asChild>
                    <Link href="/signup">
                      Попробовать {activeModel?.name}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <p className="mt-2.5 text-xs text-muted-foreground">
                    Бесплатный доступ при регистрации
                  </p>
                </div>
              </div>

              {/* ── Right preview panel ── */}
              <div className="w-full min-w-0 sm:min-h-[340px]">
                {activeCategory === 'image' && <ImagePreview />}
                {activeCategory === 'text' && activeModel && <TextPreview model={activeModel} />}
                {activeCategory === 'video' && activeModel && <VideoPreview model={activeModel} />}
                {activeCategory === 'audio' && activeModel && <AudioPreview model={activeModel} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
