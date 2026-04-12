'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Square, 
  RefreshCw, 
  Paperclip, 
  X, 
  Trash2,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Sparkles
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { CosmicBackground } from '@/components/cosmic-background'
import { useAuth } from '@/contexts/auth-context'
import { 
  streamChatResponse, 
  createChat, 
  getChat, 
  addMessage,
  type Message,
  type Chat as ChatType,
  type Attachment 
} from '@/services/ai.service'
import { models, getModelById, getAvailableModels } from '@/config/models.config'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function ChatContent() {
  const searchParams = useSearchParams()
  const modelParam = searchParams.get('model')
  const chatIdParam = searchParams.get('id')
  
  const { user } = useAuth()
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedModel, setSelectedModel] = useState(modelParam || 'gpt-4')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const availableModels = getAvailableModels()
  const currentModel = getModelById(selectedModel)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat or create new one
  useEffect(() => {
    if (chatIdParam) {
      const chat = getChat(chatIdParam)
      if (chat) {
        setCurrentChat(chat)
        setMessages(chat.messages)
        setSelectedModel(chat.modelId)
      }
    } else if (modelParam) {
      // Create new chat with selected model
      const newChat = createChat(modelParam)
      setCurrentChat(newChat)
      setMessages([])
    }
  }, [chatIdParam, modelParam])

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() && attachments.length === 0) return
    if (isGenerating) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    // Create chat if not exists
    let chat = currentChat
    if (!chat) {
      chat = createChat(selectedModel)
      setCurrentChat(chat)
    }

    // Add user message
    addMessage(chat.id, userMessage)
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setAttachments([])
    setIsGenerating(true)

    // Create placeholder for AI response
    const aiMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      modelId: selectedModel,
      isGenerating: true,
    }
    setMessages(prev => [...prev, aiMessage])

    // Stream AI response
    try {
      abortControllerRef.current = new AbortController()
      let fullContent = ''

      for await (const chunk of streamChatResponse(
        selectedModel,
        [...messages, userMessage],
        abortControllerRef.current.signal
      )) {
        fullContent += chunk
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: fullContent }
              : msg
          )
        )
      }

      // Finalize message
      const finalMessage = { ...aiMessage, content: fullContent, isGenerating: false }
      addMessage(chat.id, finalMessage)
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessage.id ? finalMessage : msg
        )
      )
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessage.id
              ? { ...msg, content: msg.content + '\n\n*[Генерация остановлена]*', isGenerating: false }
              : msg
          )
        )
      } else {
        toast.error('Ошибка генерации ответа')
        setMessages(prev => prev.filter(msg => msg.id !== aiMessage.id))
      }
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }, [inputValue, attachments, isGenerating, currentChat, selectedModel, messages])

  const handleStopGeneration = () => {
    abortControllerRef.current?.abort()
  }

  const handleRegenerate = async (messageId: string) => {
    // Find the message to regenerate and all messages before it
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    // Remove the message and all after it
    const previousMessages = messages.slice(0, messageIndex)
    const lastUserMessage = [...previousMessages].reverse().find(m => m.role === 'user')
    
    if (!lastUserMessage) return

    setMessages(previousMessages)
    setInputValue(lastUserMessage.content)
  }

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const maxSize = 10 * 1024 * 1024 // 10 MB

    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        toast.error(`Файл ${file.name} слишком большой (максимум 10 МБ)`)
        continue
      }

      const attachment: Attachment = {
        id: `att_${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }

      setAttachments(prev => [...prev, attachment])
    }

    event.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearContext = () => {
    setMessages([])
    if (currentChat) {
      const newChat = createChat(selectedModel)
      setCurrentChat(newChat)
    }
    toast.success('Контекст очищен')
  }

  const handleNewChat = () => {
    const newChat = createChat(selectedModel)
    setCurrentChat(newChat)
    setMessages([])
    window.history.pushState({}, '', `/chat?model=${selectedModel}`)
  }

  return (
    <div className="relative flex h-screen flex-col">
      <CosmicBackground />
      
      {/* Minimal Logo Header */}
      <div className="relative z-10 shrink-0 border-b border-border/30 bg-background/30 backdrop-blur-sm px-3 py-3">
        <Link href="/dashboard" className="flex w-fit items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight">ModelX</span>
        </Link>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 hidden h-full shrink-0 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm md:flex"
            >
              <ChatSidebar 
                currentChatId={currentChat?.id}
                onSelectChat={(chatId) => {
                  window.history.pushState({}, '', `/chat?id=${chatId}`)
                  const chat = getChat(chatId)
                  if (chat) {
                    setCurrentChat(chat)
                    setMessages(chat.messages)
                    setSelectedModel(chat.modelId)
                  }
                }}
                onNewChat={handleNewChat}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </Button>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Выберите модель">
                  {currentModel && (
                    <span className="flex items-center gap-2">
                      <span>{currentModel.emoji}</span>
                      <span>{currentModel.name}</span>
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    <span className="flex items-center gap-2">
                      <span>{model.emoji}</span>
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground">({model.provider})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentModel && (
              <span className="hidden text-sm text-muted-foreground lg:inline">
                {currentModel.description}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClearContext}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Очистить</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewChat}>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Новый чат</span>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Начните диалог</h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Выберите модель и напишите ваш первый запрос. ModelX ответит мгновенно.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {message.attachments.map(att => (
                          <div key={att.id} className="overflow-hidden rounded-lg border">
                            {att.previewUrl ? (
                              <img src={att.previewUrl} alt={att.name} className="h-20 w-20 object-cover" />
                            ) : (
                              <div className="flex h-10 items-center gap-2 px-3 text-xs">
                                <Paperclip className="h-3 w-3" />
                                {att.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                          {message.content || ''}
                        </ReactMarkdown>
                        {message.isGenerating && (
                          <span className="inline-flex items-center gap-1 text-primary">
                            <Spinner className="h-3 w-3" />
                            Генерация...
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}

                    {/* Regenerate button */}
                    {message.role === 'assistant' && !message.isGenerating && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => handleRegenerate(message.id)}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Регенерировать
                      </Button>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-border/50 bg-card/50 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map(att => (
                  <div key={att.id} className="relative overflow-hidden rounded-lg border bg-muted">
                    {att.previewUrl ? (
                      <img src={att.previewUrl} alt={att.name} className="h-16 w-16 object-cover" />
                    ) : (
                      <div className="flex h-10 items-center gap-2 px-3 text-sm">
                        <Paperclip className="h-4 w-4" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileAttach}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите сообщение..."
                className="min-h-[44px] max-h-[200px] resize-none"
                rows={1}
                disabled={isGenerating}
              />

              {isGenerating ? (
                <Button variant="destructive" size="icon" onClick={handleStopGeneration}>
                  <Square className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && attachments.length === 0}
                >
                  <Send className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
