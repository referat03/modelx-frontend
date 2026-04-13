'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, MessageSquare, Search, Trash2, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getChats, deleteChat, renameChat, type Chat } from '@/services/ai.service'
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

  // Delete confirmation state
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null)

  // Rename state: chatId -> current edited title
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadedChats = getChats('current-user')
    setChats(loadedChats)
  }, [currentChatId])

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingChatId) {
      setTimeout(() => renameInputRef.current?.focus(), 50)
    }
  }, [renamingChatId])

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingChatId(chatId)
  }

  const handleDeleteConfirmed = () => {
    if (!deletingChatId) return
    deleteChat(deletingChatId)
    const updated = chats.filter(c => c.id !== deletingChatId)
    setChats(updated)
    toast.success('Чат удалён')

    if (deletingChatId === currentChatId) {
      onNewChat()
    }
    setDeletingChatId(null)
  }

  const startRename = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingChatId(chat.id)
    setRenameValue(chat.title)
  }

  const commitRename = (chatId: string) => {
    if (!renameValue.trim()) {
      setRenamingChatId(null)
      return
    }
    const updated = renameChat(chatId, renameValue)
    if (updated) {
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: renameValue.trim() } : c))
    }
    setRenamingChatId(null)
  }

  const cancelRename = () => {
    setRenamingChatId(null)
    setRenameValue('')
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

  const groupedChats = filteredChats.reduce((groups, chat) => {
    const dateKey = formatDate(chat.updatedAt)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(chat)
    return groups
  }, {} as Record<string, Chat[]>)

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-border p-4">
          <Button onClick={onNewChat} className="w-full cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Новый чат
          </Button>
        </div>

        {/* Search */}
        <div className="shrink-0 p-4">
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

        {/* Chats list */}
        <div className="flex-1 overflow-y-auto px-2">
          {Object.keys(groupedChats).length > 0 ? (
            Object.entries(groupedChats).map(([dateKey, dateChats]) => (
              <div key={dateKey} className="mb-4">
                <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                  {dateKey}
                </p>
                <div className="space-y-1">
                  {dateChats.map((chat) => {
                    const model = getModelById(chat.modelId)
                    const isRenaming = renamingChatId === chat.id

                    return (
                      <motion.div
                        key={chat.id}
                        onClick={() => !isRenaming && onSelectChat(chat.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (!isRenaming && e.key === 'Enter') onSelectChat(chat.id)
                        }}
                        className={cn(
                          'group flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors',
                          !isRenaming && 'cursor-pointer',
                          chat.id === currentChatId
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted'
                        )}
                        whileHover={!isRenaming ? { x: 2 } : undefined}
                        transition={{ duration: 0.1 }}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />

                        <div className="min-w-0 flex-1">
                          {isRenaming ? (
                            <Input
                              ref={renameInputRef}
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') { e.preventDefault(); commitRename(chat.id) }
                                if (e.key === 'Escape') cancelRename()
                              }}
                              onClick={e => e.stopPropagation()}
                              className="h-6 py-0 text-sm"
                            />
                          ) : (
                            <>
                              <p className="truncate text-sm font-medium">{chat.title}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {model?.name || chat.modelId}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div
                          className={cn(
                            'flex shrink-0 items-center gap-0.5',
                            isRenaming ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          )}
                          onClick={e => e.stopPropagation()}
                        >
                          {isRenaming ? (
                            <>
                              <button
                                onClick={() => commitRename(chat.id)}
                                className="rounded p-1 hover:bg-primary/10 hover:text-primary cursor-pointer"
                                title="Сохранить"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button
                                onClick={cancelRename}
                                className="rounded p-1 hover:bg-muted-foreground/10 cursor-pointer"
                                title="Отмена"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => startRename(chat, e)}
                                className="rounded p-1 hover:bg-muted-foreground/10 cursor-pointer"
                                title="Переименовать"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => confirmDeleteChat(chat.id, e)}
                                className="rounded p-1 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                title="Удалить"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
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
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deletingChatId !== null} onOpenChange={open => !open && setDeletingChatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить чат?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Чат и все сообщения будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingChatId(null)}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
