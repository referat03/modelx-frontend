"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Edit,
  Brain,
  MessageSquare,
  Image,
  Music,
  Video,
} from "lucide-react"

interface AIModel {
  id: string
  name: string
  provider: string
  type: "text" | "image" | "audio" | "video"
  status: "active" | "maintenance" | "disabled"
  requestsToday: number
  avgLatency: string
  costPer1k: number
  isEnabled: boolean
}

const mockModels: AIModel[] = [
  {
    id: "1",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    type: "text",
    status: "active",
    requestsToday: 45230,
    avgLatency: "1.2s",
    costPer1k: 0.03,
    isEnabled: true,
  },
  {
    id: "2",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    type: "text",
    status: "active",
    requestsToday: 32100,
    avgLatency: "1.5s",
    costPer1k: 0.015,
    isEnabled: true,
  },
  {
    id: "3",
    name: "DALL-E 3",
    provider: "OpenAI",
    type: "image",
    status: "active",
    requestsToday: 12450,
    avgLatency: "8.3s",
    costPer1k: 0.04,
    isEnabled: true,
  },
  {
    id: "4",
    name: "Midjourney v6",
    provider: "Midjourney",
    type: "image",
    status: "active",
    requestsToday: 8920,
    avgLatency: "25s",
    costPer1k: 0.05,
    isEnabled: true,
  },
  {
    id: "5",
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    type: "image",
    status: "maintenance",
    requestsToday: 0,
    avgLatency: "-",
    costPer1k: 0.02,
    isEnabled: false,
  },
  {
    id: "6",
    name: "Whisper",
    provider: "OpenAI",
    type: "audio",
    status: "active",
    requestsToday: 5680,
    avgLatency: "3.2s",
    costPer1k: 0.006,
    isEnabled: true,
  },
  {
    id: "7",
    name: "Sora",
    provider: "OpenAI",
    type: "video",
    status: "disabled",
    requestsToday: 0,
    avgLatency: "-",
    costPer1k: 0.1,
    isEnabled: false,
  },
]

export default function AdminModelsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [models, setModels] = useState(mockModels)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<AIModel | null>(null)

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeIcon = (type: AIModel["type"]) => {
    const icons = {
      text: MessageSquare,
      image: Image,
      audio: Music,
      video: Video,
    }
    const Icon = icons[type]
    return <Icon className="h-4 w-4" />
  }

  const getStatusBadge = (status: AIModel["status"]) => {
    const variants = {
      active: "bg-green-500/20 text-green-500",
      maintenance: "bg-yellow-500/20 text-yellow-500",
      disabled: "bg-red-500/20 text-red-500",
    }
    const labels = {
      active: "Активна",
      maintenance: "Обслуживание",
      disabled: "Отключена",
    }
    return <Badge className={variants[status]}>{labels[status]}</Badge>
  }

  const toggleModel = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, isEnabled: !model.isEnabled } : model
      )
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Модели</h1>
          <p className="mt-1 text-muted-foreground">
            Управление доступными моделями и их настройками
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Добавить модель
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {models.filter((m) => m.isEnabled).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Активных моделей</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">104,380</div>
            <p className="text-sm text-muted-foreground">Запросов сегодня</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">2.1s</div>
            <p className="text-sm text-muted-foreground">Средняя задержка</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">99.8%</div>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или провайдеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Список моделей</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Модель</TableHead>
                <TableHead className="text-muted-foreground">Тип</TableHead>
                <TableHead className="text-muted-foreground">Статус</TableHead>
                <TableHead className="text-muted-foreground">Запросов</TableHead>
                <TableHead className="text-muted-foreground">Задержка</TableHead>
                <TableHead className="text-muted-foreground">Стоимость/1k</TableHead>
                <TableHead className="text-muted-foreground">Включена</TableHead>
                <TableHead className="text-right text-muted-foreground">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        {getTypeIcon(model.type)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{model.name}</p>
                        <p className="text-sm text-muted-foreground">{model.provider}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {getTypeIcon(model.type)}
                      {model.type === "text" && "Текст"}
                      {model.type === "image" && "Изображения"}
                      {model.type === "audio" && "Аудио"}
                      {model.type === "video" && "Видео"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(model.status)}</TableCell>
                  <TableCell className="text-foreground">
                    {model.requestsToday.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-foreground">{model.avgLatency}</TableCell>
                  <TableCell className="text-foreground">${model.costPer1k}</TableCell>
                  <TableCell>
                    <Switch
                      checked={model.isEnabled}
                      onCheckedChange={() => toggleModel(model.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingModel(model)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Model Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingModel}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingModel(null)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingModel ? "Редактировать модель" : "Добавить модель"}
            </DialogTitle>
            <DialogDescription>
              {editingModel
                ? "Измените настройки модели"
                : "Добавьте новую AI модель на платформу"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                defaultValue={editingModel?.name}
                placeholder="GPT-4 Turbo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="provider">Провайдер</Label>
              <Input
                id="provider"
                defaultValue={editingModel?.provider}
                placeholder="OpenAI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Стоимость за 1000 токенов ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.001"
                defaultValue={editingModel?.costPer1k}
                placeholder="0.03"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Описание возможностей модели..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setEditingModel(null)
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                setIsAddDialogOpen(false)
                setEditingModel(null)
              }}
            >
              {editingModel ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
