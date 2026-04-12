'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, MessageSquare, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getChats, deleteChat, type Chat } from '@/services/ai.service'
import { getModelById } from '@/config/models.config'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ChatSidebarProps {
  currentChatId?: string
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
}

export function ChatSidebar({ currentChatId, onSelectChat, onNewChat }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadedChats = getChats('current-user')
    setChats(loadedChats)
  }, [currentChatId]) // Reload when current chat changes

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChat(chatId)
    setChats(chats.filter(c => c.id !== chatId))
    toast.success('Чат удалён')
    
    if (chatId === currentChatId) {
      onNewChat()
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
    }).format(date)
  }

  // Group chats by date
  const groupedChats = filteredChats.reduce((groups, chat) => {
    const dateKey = formatDate(chat.updatedAt)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(chat)
    return groups
  }, {} as Record<string, Chat[]>)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <Button onClick={onNewChat} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Новый чат
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chats List */}
      <ScrollArea className="flex-1 px-2">
        {Object.keys(groupedChats).length > 0 ? (
          Object.entries(groupedChats).map(([dateKey, dateChats]) => (
            <div key={dateKey} className="mb-4">
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                {dateKey}
              </p>
              <div className="space-y-1">
                {dateChats.map((chat) => {
                  const model = getModelById(chat.modelId)
                  
                  return (
                    <motion.button
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors cursor-pointer',
                        chat.id === currentChatId
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      )}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{chat.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {model?.name || chat.modelId}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Чаты не найдены' : 'Нет чатов'}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
