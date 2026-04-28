// Конфигурация AI моделей для ModelX
// TODO: Добавить реальные API endpoints и настройки для каждой модели

export type ModelCategory = 'text' | 'image' | 'audio' | 'video'

export interface AIModel {
  id: string
  name: string
  category: ModelCategory
  description: string
  /**
   * Short paragraph (2–3 sentences) describing what the model is best at and
   * when to choose it. Used in the chat empty-state when this model is the
   * currently selected model. Must exist for every selectable model.
   */
  useCase: string
  icon: string // Lucide icon name
  emoji: string // Emoji icon for display
  provider: string // Provider name (OpenAI, Anthropic, etc.)
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
    useCase:
      'GPT-4 лучше всего подходит для глубоких рассуждений, развёрнутого анализа и сложных многоступенчатых задач. Выбирайте её, когда важны точность, аккуратные формулировки и качественный код или текст по сложной теме.',
    icon: 'Brain',
    emoji: '🧠',
    provider: 'OpenAI',
    isAvailable: true,
    maxTokens: 8192,
    supportedFeatures: ['chat', 'code', 'analysis', 'writing'],
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    category: 'text',
    description: 'Быстрая и экономичная модель для большинства задач',
    useCase:
      'GPT-3.5 Turbo — это быстрая и экономичная модель для повседневных задач: коротких ответов, переписки, черновиков и базового кода. Выбирайте её, когда нужен мгновенный отклик и не требуется максимальная глубина рассуждений.',
    icon: 'Zap',
    emoji: '⚡',
    provider: 'OpenAI',
    isAvailable: true,
    maxTokens: 4096,
    supportedFeatures: ['chat', 'code', 'writing'],
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    category: 'text',
    description: 'Модель Anthropic с улучшенным пониманием контекста',
    useCase:
      'Claude 3 хорошо удерживает длинный контекст и тонко работает со смыслом текста. Выбирайте её для анализа больших документов, аккуратной редактуры, аналитических резюме и продуманных длинных ответов.',
    icon: 'Sparkles',
    emoji: '✨',
    provider: 'Anthropic',
    isAvailable: true,
    maxTokens: 100000,
    supportedFeatures: ['chat', 'analysis', 'writing', 'code'],
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    category: 'text',
    description: 'Мультимодальная модель Google',
    useCase:
      'Gemini Pro — мультимодальная модель Google, которая уверенно совмещает работу с текстом, кодом и аналитикой. Выбирайте её, когда задача требует сочетания разных типов входных данных и быстрых, структурированных ответов.',
    icon: 'Stars',
    emoji: '🌟',
    provider: 'Google',
    isAvailable: true,
    maxTokens: 32000,
    supportedFeatures: ['chat', 'code', 'analysis'],
  },
  {
    id: 'llama-2',
    name: 'LLaMA 2',
    category: 'text',
    description: 'Открытая модель от Meta для исследований',
    useCase:
      'LLaMA 2 — открытая модель Meta, удобная для экспериментов, исследовательских задач и работы с кодом. Выбирайте её, когда хочется прозрачной open-source модели для прототипов и нестандартных запросов.',
    icon: 'Flame',
    emoji: '🦙',
    provider: 'Meta',
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
    useCase:
      'DALL-E 3 создаёт детализированные и точные изображения по текстовому описанию, аккуратно следуя инструкциям. Выбирайте её для иллюстраций, концептов, обложек и любых случаев, когда важно, чтобы картинка соответствовала промпту.',
    icon: 'Image',
    emoji: '🎨',
    provider: 'OpenAI',
    isAvailable: true,
    supportedFeatures: ['generation', 'editing'],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'image',
    description: 'Художественная генерация изображений',
    useCase:
      'Midjourney сильна в художественной, стилизованной и атмосферной графике с богатой композицией. Выбирайте её для арт-постеров, муд-бордов, концепт-арта и всего, где важна выразительная визуальная подача.',
    icon: 'Palette',
    emoji: '🖼️',
    provider: 'Midjourney',
    isAvailable: true,
    supportedFeatures: ['generation'],
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion XL',
    category: 'image',
    description: 'Открытая модель для генерации изображений',
    useCase:
      'Stable Diffusion XL — гибкая open-source модель для генерации, доработки и инпейнтинга изображений. Выбирайте её, когда нужны контроль над стилем, итеративная правка картинки и свобода в подборе референсов.',
    icon: 'Layers',
    emoji: '🎭',
    provider: 'Stability AI',
    isAvailable: true,
    supportedFeatures: ['generation', 'editing', 'inpainting'],
  },
  
  // Аудио модели
  {
    id: 'whisper',
    name: 'Whisper',
    category: 'audio',
    description: 'Распознавание речи от OpenAI',
    useCase:
      'Whisper точно распознаёт речь и переводит её между языками, уверенно работая даже с фоновым шумом. Выбирайте её для расшифровки встреч, интервью, голосовых заметок и быстрой подготовки текста из аудио.',
    icon: 'Mic',
    emoji: '🎙️',
    provider: 'OpenAI',
    isAvailable: true,
    supportedFeatures: ['transcription', 'translation'],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'audio',
    description: 'Синтез речи с естественным звучанием',
    useCase:
      'ElevenLabs синтезирует естественную, выразительную речь и позволяет работать с собственными голосами. Выбирайте её для озвучки видео, подкастов, обучающих материалов и интерфейсов, где важна живая интонация.',
    icon: 'Volume2',
    emoji: '🔊',
    provider: 'ElevenLabs',
    isAvailable: true,
    supportedFeatures: ['synthesis', 'voice-cloning'],
  },
  {
    id: 'musicgen',
    name: 'MusicGen',
    category: 'audio',
    description: 'Генерация музыки по текстовому описанию',
    useCase:
      'MusicGen генерирует музыкальные фрагменты по короткому текстовому описанию настроения, стиля или инструментов. Выбирайте её для черновиков саундтреков, фоновой музыки и быстрых аудио-идей под видео и презентации.',
    icon: 'Music',
    emoji: '🎵',
    provider: 'Meta',
    isAvailable: false,
    supportedFeatures: ['generation'],
  },
  
  // Видео модели
  {
    id: 'runway-gen2',
    name: 'Runway Gen-2',
    category: 'video',
    description: 'Генерация видео из текста',
    useCase:
      'Runway Gen-2 превращает текст и опорные кадры в короткие видеоролики с плавной динамикой. Выбирайте её для тизеров, движущихся обложек, концепт-видео и быстрых визуальных прототипов.',
    icon: 'Video',
    emoji: '🎬',
    provider: 'Runway',
    isAvailable: true,
    supportedFeatures: ['generation', 'editing'],
  },
  {
    id: 'pika',
    name: 'Pika Labs',
    category: 'video',
    description: 'Создание и редактирование видео с AI',
    useCase:
      'Pika Labs создаёт и аккуратно дорабатывает короткие AI-видео, помогая быстро итерировать по визуальным идеям. Выбирайте её, когда нужны эксперименты с движением, стилизация и лёгкая правка существующих клипов.',
    icon: 'Film',
    emoji: '🎞️',
    provider: 'Pika Labs',
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
