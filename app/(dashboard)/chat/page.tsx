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
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Sparkles,
  Menu,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  FileText,
  Copy,
  Check,
  Coins,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

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

// Card-style code block: header strip (language + copy) + syntax-highlighted body
interface CodeBlockProps {
  language: string
  code: string
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Скопировано!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  const displayLang = language || 'plaintext'

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-zinc-700/60 not-prose">
      {/* Header strip */}
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2">
        <span className="text-xs font-medium text-zinc-400 select-none">{displayLang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
          aria-label="Скопировать код"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5" /> Скопировано</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> Скопировать</>
          )}
        </button>
      </div>
      {/* Code body */}
      <SyntaxHighlighter
        language={displayLang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: '#09090b', // zinc-950
          padding: '1rem',
          fontSize: '0.875rem',
          overflowX: 'auto',
          tabSize: 4,
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

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
  // Desktop sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  // Mobile drawer open state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
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
      // New chat — do NOT create eagerly; create on first message send
      setCurrentChat(null)
      setMessages([])
      setSelectedModel(modelParam)
    }
  }, [chatIdParam, modelParam])

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    if (!isMobileSidebarOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-mobile-sidebar]') && !target.closest('[data-burger]')) {
        setIsMobileSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isMobileSidebarOpen])

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

    // Create chat on first message if not exists
    let chat = currentChat
    if (!chat) {
      chat = createChat(selectedModel)
      setCurrentChat(chat)
      window.history.replaceState({}, '', `/chat?id=${chat.id}`)
    }

    addMessage(chat.id, userMessage)
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setAttachments([])
    setIsGenerating(true)

    const aiMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      modelId: selectedModel,
      isGenerating: true,
      versions: [],
      versionIndex: 0,
    }
    setMessages(prev => [...prev, aiMessage])

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

      const finalMessage: Message = {
        ...aiMessage,
        content: fullContent,
        isGenerating: false,
        versions: [fullContent],
        versionIndex: 0,
      }
      addMessage(chat.id, finalMessage)
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessage.id ? finalMessage : msg
        )
      )
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
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

  const handleRegenerate = useCallback(async (messageId: string) => {
    if (isGenerating) return

    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    // Keep everything before this AI message
    const previousMessages = messages.slice(0, messageIndex)
    const lastUserMessage = [...previousMessages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) return

    const existingMessage = messages[messageIndex]
    const existingVersions = existingMessage.versions ?? [existingMessage.content]

    setIsGenerating(true)

    // Update the existing message to show as generating (keep versions list)
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: '', isGenerating: true }
          : msg
      )
    )

    try {
      abortControllerRef.current = new AbortController()
      let fullContent = ''

      for await (const chunk of streamChatResponse(
        selectedModel,
        previousMessages,
        abortControllerRef.current.signal
      )) {
        fullContent += chunk
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, content: fullContent } : msg
          )
        )
      }

      const newVersions = [...existingVersions, fullContent]
      const newVersionIndex = newVersions.length - 1

      const finalMessage: Message = {
        ...existingMessage,
        content: fullContent,
        isGenerating: false,
        versions: newVersions,
        versionIndex: newVersionIndex,
      }

      if (currentChat) addMessage(currentChat.id, finalMessage)
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? finalMessage : msg))
      )
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: msg.content + '\n\n*[Генерация остановлена]*', isGenerating: false }
              : msg
          )
        )
      } else {
        toast.error('Ошибка регенерации ответа')
        // Restore previous content on error
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...existingMessage, isGenerating: false }
              : msg
          )
        )
      }
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }, [isGenerating, messages, selectedModel, currentChat])

  const handleVersionChange = useCallback((messageId: string, direction: 'prev' | 'next') => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id !== messageId || !msg.versions) return msg
        const total = msg.versions.length
        const current = msg.versionIndex ?? 0
        const newIndex = direction === 'prev'
          ? Math.max(0, current - 1)
          : Math.min(total - 1, current + 1)
        return { ...msg, versionIndex: newIndex, content: msg.versions[newIndex] }
      })
    )
  }, [])

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

  const handleNewChat = () => {
    setCurrentChat(null)
    setMessages([])
    window.history.pushState({}, '', `/chat?model=${selectedModel}`)
    setIsMobileSidebarOpen(false)
  }

  const handleSelectChat = (chatId: string) => {
    window.history.pushState({}, '', `/chat?id=${chatId}`)
    const chat = getChat(chatId)
    if (chat) {
      setCurrentChat(chat)
      setMessages(chat.messages)
      setSelectedModel(chat.modelId)
    }
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden overscroll-none">
      <CosmicBackground />
      
      {/* Fixed top bar */}
      <div className="relative z-20 flex shrink-0 items-center gap-3 border-b border-border/30 bg-background/60 px-3 py-2 backdrop-blur-md">
        {/* Burger (mobile only) */}
        <Button
          variant="ghost"
          size="icon"
          data-burger
          onClick={() => setIsMobileSidebarOpen(prev => !prev)}
          className="shrink-0 md:hidden cursor-pointer"
          aria-label="Открыть список чатов"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2 pr-2 cursor-pointer">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight">ModelX</span>
        </Link>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden shrink-0 md:flex cursor-pointer"
        >
          {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </Button>

        {/* Model select — only emoji on mobile, full name on sm+ */}
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[120px] cursor-pointer bg-primary/20 border-primary/30 text-xs sm:w-[200px] sm:text-sm">
            <SelectValue placeholder="Выберите модель">
              {currentModel && (
                <span className="flex items-center gap-1.5 truncate">
                  <span className="shrink-0">{currentModel.emoji}</span>
                  <span className="truncate">{currentModel.name}</span>
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

        <div className="flex-1" />

        {/* Token balance */}
        <Link
          href="/buy-tokens"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 transition-colors hover:bg-primary/20 cursor-pointer"
        >
          <Coins className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {(user?.tokenBalance ?? 0).toFixed(2)}
          </span>
        </Link>

        {/* New chat button */}
        <Button variant="outline" size="sm" onClick={handleNewChat} className="shrink-0 cursor-pointer">
          <Plus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Новый чат</span>
        </Button>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-30 bg-black/50 md:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                data-mobile-sidebar
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed left-0 top-0 z-40 flex h-full w-[280px] flex-col border-r border-border/30 bg-card/95 backdrop-blur-md md:hidden"
              >
                <ChatSidebar
                  currentChatId={currentChat?.id}
                  onSelectChat={handleSelectChat}
                  onNewChat={handleNewChat}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 hidden h-full shrink-0 flex-col border-r border-border/30 bg-card/50 backdrop-blur-sm md:flex"
            >
              <ChatSidebar 
                currentChatId={currentChat?.id}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Messages area */}
          <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain p-4">
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
                messages.map((message) => {
                  const msgModel = message.modelId ? getModelById(message.modelId) : currentModel
                  const versions = message.versions
                  const versionIndex = message.versionIndex ?? 0
                  const hasVersions = versions && versions.length > 1

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-base">
                            {msgModel?.emoji || 'AI'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={cn(
                          'max-w-[80%] min-w-0 overflow-x-hidden rounded-2xl px-4 py-3',
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
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={att.name}
                                    className="block cursor-pointer"
                                  >
                                    <img
                                      src={att.previewUrl}
                                      alt={att.name}
                                      className="h-20 w-20 object-cover transition-opacity hover:opacity-80"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={att.name}
                                    className="flex h-10 items-center gap-2 px-3 text-xs hover:bg-muted/50"
                                  >
                                    <FileText className="h-3 w-3 shrink-0" />
                                    <span className="max-w-[100px] truncate">{att.name}</span>
                                    <Download className="h-3 w-3 shrink-0 opacity-60" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Content — break-words prevents overflow on mobile */}
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none break-words [&_p]:overflow-wrap-anywhere">
                            <ReactMarkdown
                              components={{
                                // Block code: render as card
                                code({ className, children }) {
                                  const match = /language-(\w+)/.exec(className || '')
                                  const language = match ? match[1] : ''
                                  const isBlock = Boolean(match)

                                  if (isBlock) {
                                    const code = String(children).replace(/\n$/, '')
                                    return <CodeBlock language={language} code={code} />
                                  }

                                  // Inline code
                                  return (
                                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                                      {children}
                                    </code>
                                  )
                                },
                                // Suppress the default pre wrapper — CodeBlock renders its own container
                                pre({ children }) {
                                  return <>{children}</>
                                },
                              }}
                            >
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
                          <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{message.content}</p>
                        )}

                        {/* Bottom bar: version navigation + regenerate */}
                        {message.role === 'assistant' && !message.isGenerating && (
                          <div className="mt-4 flex items-center gap-1">
                            {hasVersions && (
                              <div className="flex items-center gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleVersionChange(message.id, 'prev')}
                                  disabled={versionIndex === 0}
                                  aria-label="Предыдущая версия"
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </Button>
                                <span className="min-w-[2.5rem] text-center text-xs text-muted-foreground">
                                  {versionIndex + 1}/{versions!.length}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleVersionChange(message.id, 'next')}
                                  disabled={versionIndex === versions!.length - 1}
                                  aria-label="Следующая версия"
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => handleRegenerate(message.id)}
                              disabled={isGenerating}
                            >
                              <RefreshCw className="mr-1 h-3 w-3" />
                              Регенерировать
                            </Button>
                          </div>
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
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t border-border/30 bg-card/50 p-3 sm:p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
              {/* Attachments preview */}
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map(att => (
                    <div key={att.id} className="relative rounded-lg border bg-muted" style={{ overflow: 'visible' }}>
                      {att.previewUrl ? (
                        <img src={att.previewUrl} alt={att.name} className="h-16 w-16 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 items-center gap-2 px-3 text-sm">
                          <Paperclip className="h-4 w-4" />
                          <span className="max-w-[100px] truncate">{att.name}</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
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
                  className="cursor-pointer"
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
                    className="cursor-pointer"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                )}
              </div>
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
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
