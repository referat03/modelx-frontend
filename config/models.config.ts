// Конфигурация AI моделей для ModelX
// TODO: Добавить реальные API endpoints и настройки для каждой модели

export type ModelCategory = 'text' | 'image' | 'audio' | 'video'

export interface AIModel {
  id: string
  name: string
  category: ModelCategory
  description: string
  icon: string // Lucide icon name
  isAvailable: boolean
  maxTokens?: number
  supportedFeatures: string[]
  // TODO: Добавить API endpoint когда будет готов бэкенд
  // apiEndpoint?: string
  // apiKey?: string
}

export const models: AIModel[] = [
  // Текстовые модели
  {
    id: 'gpt-4',
    name: 'GPT-4',
    category: 'text',
    description: 'Самая мощная модель OpenAI для сложных задач',
    icon: 'Brain',
    isAvailable: true,
    maxTokens: 8192,
    supportedFeatures: ['chat', 'code', 'analysis', 'writing'],
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    category: 'text',
    description: 'Быстрая и экономичная модель для большинства задач',
    icon: 'Zap',
    isAvailable: true,
    maxTokens: 4096,
    supportedFeatures: ['chat', 'code', 'writing'],
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    category: 'text',
    description: 'Модель Anthropic с улучшенным пониманием контекста',
    icon: 'Sparkles',
    isAvailable: true,
    maxTokens: 100000,
    supportedFeatures: ['chat', 'analysis', 'writing', 'code'],
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    category: 'text',
    description: 'Мультимодальная модель Google',
    icon: 'Stars',
    isAvailable: true,
    maxTokens: 32000,
    supportedFeatures: ['chat', 'code', 'analysis'],
  },
  {
    id: 'llama-2',
    name: 'LLaMA 2',
    category: 'text',
    description: 'Открытая модель от Meta для исследований',
    icon: 'Flame',
    isAvailable: true,
    maxTokens: 4096,
    supportedFeatures: ['chat', 'code'],
  },
  
  // Модели для изображений
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    category: 'image',
    description: 'Генерация изображений высокого качества',
    icon: 'Image',
    isAvailable: true,
    supportedFeatures: ['generation', 'editing'],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'image',
    description: 'Художественная генерация изображений',
    icon: 'Palette',
    isAvailable: true,
    supportedFeatures: ['generation'],
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion XL',
    category: 'image',
    description: 'Открытая модель для генерации изображений',
    icon: 'Layers',
    isAvailable: true,
    supportedFeatures: ['generation', 'editing', 'inpainting'],
  },
  
  // Аудио модели
  {
    id: 'whisper',
    name: 'Whisper',
    category: 'audio',
    description: 'Распознавание речи от OpenAI',
    icon: 'Mic',
    isAvailable: true,
    supportedFeatures: ['transcription', 'translation'],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'audio',
    description: 'Синтез речи с естественным звучанием',
    icon: 'Volume2',
    isAvailable: true,
    supportedFeatures: ['synthesis', 'voice-cloning'],
  },
  {
    id: 'musicgen',
    name: 'MusicGen',
    category: 'audio',
    description: 'Генерация музыки по текстовому описанию',
    icon: 'Music',
    isAvailable: false,
    supportedFeatures: ['generation'],
  },
  
  // Видео модели
  {
    id: 'runway-gen2',
    name: 'Runway Gen-2',
    category: 'video',
    description: 'Генерация видео из текста',
    icon: 'Video',
    isAvailable: true,
    supportedFeatures: ['generation', 'editing'],
  },
  {
    id: 'pika',
    name: 'Pika Labs',
    category: 'video',
    description: 'Создание и редактирование видео с AI',
    icon: 'Film',
    isAvailable: false,
    supportedFeatures: ['generation'],
  },
]

export const modelCategories: { id: ModelCategory; name: string; icon: string }[] = [
  { id: 'text', name: 'Текст', icon: 'MessageSquare' },
  { id: 'image', name: 'Изображения', icon: 'Image' },
  { id: 'audio', name: 'Аудио', icon: 'Volume2' },
  { id: 'video', name: 'Видео', icon: 'Video' },
]

export function getModelById(id: string): AIModel | undefined {
  return models.find(model => model.id === id)
}

export function getModelsByCategory(category: ModelCategory): AIModel[] {
  return models.filter(model => model.category === category)
}

export function getAvailableModels(): AIModel[] {
  return models.filter(model => model.isAvailable)
}
