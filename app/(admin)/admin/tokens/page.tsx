"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Coins, Settings2 } from "lucide-react"
import { tokenPackages as defaultTokenPackages, formatTokensPrice, type TokenPackage } from "@/config/tokenPackages.config"

export default function AdminTokensPage() {
  const [packages, setPackages] = useState<TokenPackage[]>(defaultTokenPackages)
  const [editingPackage, setEditingPackage] = useState<TokenPackage | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)
  const [tokenRate, setTokenRate] = useState<number>(1)
  const [showRateDialog, setShowRateDialog] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    tokens: 100,
    price: 199,
    isPopular: false,
  })

  // Load token rate from localStorage on mount
  useEffect(() => {
    const savedRate = localStorage.getItem('modelx_token_rate')
    if (savedRate) {
      setTokenRate(parseFloat(savedRate))
    }
  }, [])

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      tokens: 100,
      price: 199,
      isPopular: false,
    })
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreating(true)
    setEditingPackage({} as TokenPackage)
  }

  const openEditDialog = (pkg: TokenPackage) => {
    setFormData({
      id: pkg.id,
      name: pkg.name,
      tokens: pkg.tokens,
      price: pkg.price,
      isPopular: pkg.isPopular || false,
    })
    setIsCreating(false)
    setEditingPackage(pkg)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.id.trim()) {
      toast.error("Заполните обязательные поля")
      return
    }

    const newPackage: TokenPackage = {
      id: formData.id,
      name: formData.name,
      tokens: formData.tokens,
      price: formData.price,
      isPopular: formData.isPopular,
    }

    if (isCreating) {
      if (packages.some(p => p.id === newPackage.id)) {
        toast.error("Пакет с таким ID уже существует")
        return
      }
      setPackages([...packages, newPackage])
      toast.success("Пакет токенов создан")
    } else {
      setPackages(packages.map(p => p.id === editingPackage?.id ? newPackage : p))
      toast.success("Пакет токенов обновлён")
    }

    setEditingPackage(null)
    resetForm()
  }

  const handleDelete = () => {
    if (packageToDelete) {
      setPackages(packages.filter(p => p.id !== packageToDelete))
      setPackageToDelete(null)
      toast.success("Пакет токенов удалён")
    }
  }

  const handleSaveRate = () => {
    localStorage.setItem('modelx_token_rate', tokenRate.toString())
    setShowRateDialog(false)
    toast.success("Курс токенов сохранён")
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Управление токенами</h1>
          <p className="mt-1 text-muted-foreground">
            Создание и редактирование пакетов токенов
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowRateDialog(true)}>
            <Settings2 className="mr-2 h-4 w-4" />
            Курс токенов
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить пакет
          </Button>
        </div>
      </div>

      {/* Token Rate Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Текущий курс токенов
          </CardTitle>
          <CardDescription>
            Соотношение рублей к токенам для расчёта стоимости
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="rounded-lg border bg-muted/50 px-4 py-3">
              <span className="text-2xl font-bold text-primary">{tokenRate}</span>
              <span className="ml-2 text-muted-foreground">₽ = 1 токен</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowRateDialog(true)}>
              Изменить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="border-border bg-card relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    {pkg.name}
                  </CardTitle>
                </div>
                {pkg.isPopular && <Badge>Популярный</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {formatTokensPrice(pkg.price)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Количество токенов:</span>
                  <span className="font-medium text-primary">{pkg.tokens}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Цена за токен:</span>
                  <span className="font-medium">{(pkg.price / pkg.tokens).toFixed(2)} ₽</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(pkg)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Изменить
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPackageToDelete(pkg.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Создать пакет токенов" : "Редактировать пакет токенов"}
            </DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Заполните информацию о новом пакете токенов"
                : "Измените параметры пакета токенов"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">ID пакета *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="medium"
                  disabled={!isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="500 токенов"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tokens">Количество токенов</Label>
                <Input
                  id="tokens"
                  type="number"
                  value={formData.tokens}
                  onChange={(e) => setFormData({ ...formData, tokens: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Цена (руб)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
              />
              <Label htmlFor="isPopular">Популярный</Label>
            </div>

            {formData.tokens > 0 && formData.price > 0 && (
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <span className="text-muted-foreground">Цена за токен: </span>
                <span className="font-medium text-primary">
                  {(formData.price / formData.tokens).toFixed(2)} ₽
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPackage(null)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              {isCreating ? "Создать" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Rate Dialog */}
      <Dialog open={showRateDialog} onOpenChange={setShowRateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Курс токенов</DialogTitle>
            <DialogDescription>
              Задайте соотношение рублей к токенам
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Стоимость 1 токена (в рублях)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  value={tokenRate}
                  onChange={(e) => setTokenRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="text-muted-foreground">
                  При курсе <span className="font-medium text-foreground">{tokenRate} ₽</span> за токен:
                </p>
                <ul className="mt-2 space-y-1">
                  <li>100 токенов = {(100 * tokenRate).toFixed(0)} ₽</li>
                  <li>500 токенов = {(500 * tokenRate).toFixed(0)} ₽</li>
                  <li>1000 токенов = {(1000 * tokenRate).toFixed(0)} ₽</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRateDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveRate}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!packageToDelete} onOpenChange={() => setPackageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить пакет токенов?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Пакет токенов будет удалён из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
