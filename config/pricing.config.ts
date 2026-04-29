// Конфигурация тарифных планов для ModelX
// TODO: Интегрировать с платежной системой (Stripe, ЮKassa и т.д.)
//
// SINGLE SOURCE OF TRUTH for tariffs.
// Every UI surface that renders tariff cards must consume `pricingPlans`
// from this file directly: landing pricing section, profile subscription
// settings, dashboard subscription panel, profile token-balance view,
// admin pricing editor, and any future surface. Do NOT copy these
// objects, do NOT hardcode plan names, prices, descriptions, features,
// or limits anywhere else. Editing this file must propagate everywhere.

export interface PricingPlan {
  id: string
  name: string
  price: number // в рублях за месяц
  currency: string
  description: string
  features: string[]
  limits: {
    requestsPerDay: number
    requestsPerMonth: number
    maxTokensPerRequest: number
    availableModels: string[] // ID моделей из models.config.ts
  }
  isPopular?: boolean
  isFree?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Бесплатный',
    price: 0,
    currency: 'RUB',
    description: 'Для знакомства с сервисом',
    features: [
      '50 запросов в день',
      'Доступ к GPT-3.5',
      'Базовая поддержка',
      'История чатов 7 дней',
    ],
    limits: {
      requestsPerDay: 50,
      requestsPerMonth: 1500,
      maxTokensPerRequest: 2048,
      availableModels: ['gpt-3.5-turbo'],
    },
    isFree: true,
  },
  {
    id: 'starter',
    name: 'Стартовый',
    price: 490,
    currency: 'RUB',
    description: 'Для личного использования',
    features: [
      '500 запросов в день',
      'GPT-4, Claude 3, Gemini',
      'DALL-E 3, Stable Diffusion',
      'Приоритетная поддержка',
      'История чатов 30 дней',
    ],
    limits: {
      requestsPerDay: 500,
      requestsPerMonth: 15000,
      maxTokensPerRequest: 4096,
      availableModels: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'gemini-pro', 'dall-e-3', 'stable-diffusion'],
    },
  },
  {
    id: 'pro',
    name: 'Профессиональный',
    price: 1490,
    currency: 'RUB',
    description: 'Для профессионалов и команд',
    features: [
      'Безлимитные запросы',
      'Все модели без ограничений',
      'Приоритетная очередь',
      'API доступ',
      'История чатов без ограничений',
      'Персональный менеджер',
    ],
    limits: {
      requestsPerDay: -1, // Безлимит
      requestsPerMonth: -1,
      maxTokensPerRequest: 32000,
      availableModels: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'gemini-pro', 'llama-2', 'dall-e-3', 'midjourney', 'stable-diffusion', 'whisper', 'elevenlabs', 'runway-gen2'],
    },
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Корпоративный',
    price: 4990,
    currency: 'RUB',
    description: 'Для крупного бизнеса',
    features: [
      'Всё из тарифа Pro',
      'Выделенные ресурсы',
      'SLA 99.9%',
      'Кастомные интеграции',
      'Обучение команды',
      'Белый лейбл',
    ],
    limits: {
      requestsPerDay: -1,
      requestsPerMonth: -1,
      maxTokensPerRequest: 100000,
      availableModels: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'gemini-pro', 'llama-2', 'dall-e-3', 'midjourney', 'stable-diffusion', 'whisper', 'elevenlabs', 'musicgen', 'runway-gen2', 'pika'],
    },
  },
]

export function getPlanById(id: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.id === id)
}

export function formatPrice(price: number, currency: string = 'RUB'): string {
  if (price === 0) return 'Бесплатно'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}
