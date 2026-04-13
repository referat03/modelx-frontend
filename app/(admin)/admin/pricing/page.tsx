"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit2, Trash2, CreditCard, Check } from "lucide-react"
import { pricingPlans, formatPrice, type PricingPlan } from "@/config/pricing.config"

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>(pricingPlans)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: 0,
    description: "",
    features: "",
    requestsPerDay: 100,
    requestsPerMonth: 3000,
    maxTokensPerRequest: 4096,
    isPopular: false,
    isFree: false,
  })

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      price: 0,
      description: "",
      features: "",
      requestsPerDay: 100,
      requestsPerMonth: 3000,
      maxTokensPerRequest: 4096,
      isPopular: false,
      isFree: false,
    })
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreating(true)
    setEditingPlan({} as PricingPlan)
  }

  const openEditDialog = (plan: PricingPlan) => {
    setFormData({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: plan.features.join("\n"),
      requestsPerDay: plan.limits.requestsPerDay,
      requestsPerMonth: plan.limits.requestsPerMonth,
      maxTokensPerRequest: plan.limits.maxTokensPerRequest,
      isPopular: plan.isPopular || false,
      isFree: plan.isFree || false,
    })
    setIsCreating(false)
    setEditingPlan(plan)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.id.trim()) {
      toast.error("Заполните обязательные поля")
      return
    }

    const newPlan: PricingPlan = {
      id: formData.id,
      name: formData.name,
      price: formData.price,
      currency: "RUB",
      description: formData.description,
      features: formData.features.split("\n").filter(f => f.trim()),
      limits: {
        requestsPerDay: formData.requestsPerDay,
        requestsPerMonth: formData.requestsPerMonth,
        maxTokensPerRequest: formData.maxTokensPerRequest,
        availableModels: [],
      },
      isPopular: formData.isPopular,
      isFree: formData.isFree,
    }

    if (isCreating) {
      if (plans.some(p => p.id === newPlan.id)) {
        toast.error("Тариф с таким ID уже существует")
        return
      }
      setPlans([...plans, newPlan])
      toast.success("Тариф создан")
    } else {
      setPlans(plans.map(p => p.id === editingPlan?.id ? newPlan : p))
      toast.success("Тариф обновлён")
    }

    setEditingPlan(null)
    resetForm()
  }

  const handleDelete = () => {
    if (planToDelete) {
      setPlans(plans.filter(p => p.id !== planToDelete))
      setPlanToDelete(null)
      toast.success("Тариф удалён")
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Управление тарифами</h1>
          <p className="mt-1 text-muted-foreground">
            Создание и редактирование тарифных планов
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить тариф
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-border bg-card relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  {plan.isPopular && <Badge>Популярный</Badge>}
                  {plan.isFree && <Badge variant="secondary">Бесплатный</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {formatPrice(plan.price)}
                  {!plan.isFree && <span className="text-sm font-normal text-muted-foreground">/мес</span>}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Лимиты:</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" />
                    {plan.limits.requestsPerDay === -1 ? "Безлимит" : plan.limits.requestsPerDay} запросов/день
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" />
                    {plan.limits.maxTokensPerRequest.toLocaleString()} токенов
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Функции:</p>
                <ul className="space-y-1 text-sm">
                  {plan.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-muted-foreground">+{plan.features.length - 3} ещё</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(plan)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Изменить
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPlanToDelete(plan.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Создать тариф" : "Редактировать тариф"}
            </DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Заполните информацию о новом тарифном плане"
                : "Измените параметры тарифного плана"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">ID тарифа *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="pro"
                  disabled={!isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Профессиональный"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Цена (руб/мес)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Для профессионалов"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Функции (по одной на строку)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Безлимитные запросы&#10;Все модели&#10;API доступ"
                rows={5}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="requestsPerDay">Запросов в день</Label>
                <Input
                  id="requestsPerDay"
                  type="number"
                  value={formData.requestsPerDay}
                  onChange={(e) => setFormData({ ...formData, requestsPerDay: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">-1 для безлимита</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestsPerMonth">Запросов в месяц</Label>
                <Input
                  id="requestsPerMonth"
                  type="number"
                  value={formData.requestsPerMonth}
                  onChange={(e) => setFormData({ ...formData, requestsPerMonth: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Макс. токенов</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={formData.maxTokensPerRequest}
                  onChange={(e) => setFormData({ ...formData, maxTokensPerRequest: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                />
                <Label htmlFor="isPopular">Популярный</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isFree"
                  checked={formData.isFree}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                />
                <Label htmlFor="isFree">Бесплатный</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              {isCreating ? "Создать" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить тариф?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Тариф будет удалён из системы.
              Пользователи с этим тарифом будут переведены на бесплатный план.
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
