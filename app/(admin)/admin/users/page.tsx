"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Download,
  Filter,
  Mail,
  Ban,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  plan: "Free" | "Basic" | "Pro" | "Business"
  status: "active" | "inactive" | "banned"
  messagesCount: number
  createdAt: string
  lastActive: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Александр Иванов",
    email: "alex@mail.ru",
    plan: "Pro",
    status: "active",
    messagesCount: 1245,
    createdAt: "2024-01-15",
    lastActive: "5 мин назад",
  },
  {
    id: "2",
    name: "Мария Смирнова",
    email: "maria@gmail.com",
    plan: "Business",
    status: "active",
    messagesCount: 3421,
    createdAt: "2023-11-20",
    lastActive: "1 час назад",
  },
  {
    id: "3",
    name: "Дмитрий Козлов",
    email: "dmitry@yandex.ru",
    plan: "Basic",
    status: "active",
    messagesCount: 567,
    createdAt: "2024-02-08",
    lastActive: "3 часа назад",
  },
  {
    id: "4",
    name: "Елена Петрова",
    email: "elena@mail.ru",
    plan: "Free",
    status: "inactive",
    messagesCount: 89,
    createdAt: "2024-03-01",
    lastActive: "2 дня назад",
  },
  {
    id: "5",
    name: "Сергей Волков",
    email: "sergey@outlook.com",
    plan: "Pro",
    status: "banned",
    messagesCount: 234,
    createdAt: "2023-12-10",
    lastActive: "1 неделю назад",
  },
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPlanBadge = (plan: User["plan"]) => {
    const variants = {
      Free: "bg-muted text-muted-foreground",
      Basic: "bg-blue-500/20 text-blue-500",
      Pro: "bg-primary/20 text-primary",
      Business: "bg-yellow-500/20 text-yellow-500",
    }
    return <Badge className={variants[plan]}>{plan}</Badge>
  }

  const getStatusBadge = (status: User["status"]) => {
    const variants = {
      active: "bg-green-500/20 text-green-500",
      inactive: "bg-muted text-muted-foreground",
      banned: "bg-red-500/20 text-red-500",
    }
    const labels = {
      active: "Активен",
      inactive: "Неактивен",
      banned: "Заблокирован",
    }
    return <Badge className={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Пользователи</h1>
          <p className="mt-1 text-muted-foreground">
            Управление пользователями платформы
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">12,847</div>
            <p className="text-sm text-muted-foreground">Всего пользователей</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">10,234</div>
            <p className="text-sm text-muted-foreground">Активных</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">2,456</div>
            <p className="text-sm text-muted-foreground">Неактивных</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">157</div>
            <p className="text-sm text-muted-foreground">Заблокированных</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Фильтры
          </Button>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Пользователь</TableHead>
                <TableHead className="text-muted-foreground">Тариф</TableHead>
                <TableHead className="text-muted-foreground">Статус</TableHead>
                <TableHead className="text-muted-foreground">Сообщений</TableHead>
                <TableHead className="text-muted-foreground">Последняя активность</TableHead>
                <TableHead className="text-right text-muted-foreground">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(user.plan)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-foreground">
                    {user.messagesCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastActive}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          Просмотреть
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit className="h-4 w-4" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Mail className="h-4 w-4" />
                          Написать
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Ban className="h-4 w-4" />
                          Заблокировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить пользователя</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить пользователя {selectedUser?.name}? 
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
