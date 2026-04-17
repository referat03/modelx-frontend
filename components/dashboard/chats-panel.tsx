'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MessageSquare, Trash2, Edit2, Plus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Empty } from '@/components/ui/empty'
import { getChats, deleteChat, updateChat, type Chat } from '@/services/ai.service'
import { getModelById } from '@/config/models.config'
import { toast } from 'sonner'

export function ChatsPanel() {
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [chatToRename, setChatToRename] = useState<Chat | null>(null)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    // Загружаем чаты
    const loadedChats = getChats('current-user')
    setChats(loadedChats)
  }, [])

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteChat = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete)
      setChats(chats.filter(c => c.id !== chatToDelete))
      setChatToDelete(null)
      toast.success('Чат удалён')
    }
  }

  const handleRenameChat = () => {
    if (chatToRename && newTitle.trim()) {
      const updated = updateChat(chatToRename.id, { title: newTitle.trim() })
      if (updated) {
        setChats(chats.map(c => c.id === chatToRename.id ? updated : c))
        toast.success('Чат переименован')
      }
      setChatToRename(null)
      setNewTitle('')
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по чатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/chat">
            <Plus className="mr-2 h-4 w-4" />
            Новый чат
          </Link>
        </Button>
      </div>

      {/* Chats List */}
      {filteredChats.length > 0 ? (
        <div className="grid gap-3">
          <AnimatePresence>
            {filteredChats.map((chat, index) => {
              const model = getModelById(chat.modelId)
              
              return (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="group transition-all hover:border-primary/50 cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <Link href={`/chat?id=${chat.id}`} className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-medium">{chat.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {model?.name || chat.modelId} • {formatDate(chat.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setChatToRename(chat)
                              setNewTitle(chat.title)
                            }}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Переименовать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setChatToDelete(chat.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Empty
          icon={<MessageSquare className="h-12 w-12" />}
          title={searchQuery ? 'Чаты не найдены' : 'У вас пока нет чатов'}
          description={
            searchQuery
              ? 'Попробуйте изменить поисковый запрос'
              : 'Начните новый чат, выбрав модель из каталога'
          }
          action={
            !searchQuery && (
              <Button asChild>
                <Link href="/chat">
                  <Plus className="mr-2 h-4 w-4" />
                  Начать чат
                </Link>
              </Button>
            )
          }
        />
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!chatToDelete} onOpenChange={() => setChatToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить чат?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Чат и вся его история будут удалены навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={!!chatToRename} onOpenChange={() => setChatToRename(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Переименовать чат</DialogTitle>
            <DialogDescription>
              Введите новое название для чата
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Название чата"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChatToRename(null)}>
              Отмена
            </Button>
            <Button onClick={handleRenameChat} disabled={!newTitle.trim()}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
