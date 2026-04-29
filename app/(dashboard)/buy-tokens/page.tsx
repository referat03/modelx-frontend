'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { tokenPackages, formatTokensPrice, type TokenPackage } from '@/config/tokenPackages.config'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TokenPackageCardProps {
  pkg: TokenPackage
  onBuy: (pkg: TokenPackage) => void
}

// Names, prices, token amounts and descriptions all come straight from the
// shared `tokenPackages` config (single source of truth). This card no
// longer keeps any per-page overrides.
function TokenPackageCard({ pkg, onBuy }: TokenPackageCardProps) {
  return (
    // Wrapper reserves a consistent top "badge slot" on EVERY card (not only
    // the popular one) so all three card bodies start at the same vertical
    // position and the row reads as one clean grid. The chip is absolutely
    // positioned inside that reserved slot so it always sits fully above the
    // card with a small clean gap — never overlapping the card border, never
    // pushing internal content down.
    <div className="relative h-full pt-7">
      {pkg.isPopular && (
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm shadow-primary/30 ring-1 ring-primary/40">
            <Sparkles className="h-3 w-3" />
            Популярный
          </span>
        </div>
      )}

      <Card
        className={cn(
          'relative flex h-full flex-col transition-all hover:shadow-lg hover:shadow-primary/10',
          pkg.isPopular && 'border-primary shadow-lg shadow-primary/20'
        )}
      >
        <CardHeader>
          <CardTitle className="text-xl">{pkg.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="mb-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold">{formatTokensPrice(pkg.price)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {pkg.description}
          </p>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full cursor-pointer disabled:cursor-not-allowed"
            variant={pkg.isPopular ? 'default' : 'outline'}
            onClick={() => onBuy(pkg)}
          >
            Купить
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function BuyTokensPage() {
  const { user } = useAuth()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null)

  const handleBuy = (pkg: TokenPackage) => {
    setSelectedPackage(pkg)
    setShowConfirmDialog(true)
  }

  const handleConfirmPurchase = () => {
    setShowConfirmDialog(false)
    toast.info('Оплата будет доступна позже')
    setSelectedPackage(null)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Coins className="h-8 w-8 text-primary" />
            Покупка токенов
          </h1>
          <p className="mt-2 text-muted-foreground">
            Текущий баланс: <span className="font-semibold text-foreground">{(user?.tokenBalance ?? 0).toFixed(2)} токенов</span>
          </p>
        </div>

        {/* Token Packages Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tokenPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <TokenPackageCard pkg={pkg} onBuy={handleBuy} />
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-lg border bg-muted/50 p-6">
          <h3 className="font-semibold mb-2">Как использовать токены?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>- Токены используются для генерации ответов AI-моделей</li>
            <li>- Разные модели потребляют разное количество токенов</li>
            <li>- Неиспользованные токены не сгорают</li>
          </ul>
        </div>
      </motion.div>

      {/* Confirmation Dialog. The Tailwind selector below targets the
          auto-rendered DialogClose ("X") so it gets a pointer cursor without
          editing the shared dialog primitive. */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="[&_[data-slot=dialog-close]]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Подтверждение покупки</DialogTitle>
            <DialogDescription>
              Вы собираетесь приобрести пакет &quot;{selectedPackage?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Пакет:</span>
                <span className="font-medium">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Количество токенов:</span>
                <span className="font-medium text-primary">{selectedPackage?.tokens}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-muted-foreground">Стоимость:</span>
                <span className="font-bold">{formatTokensPrice(selectedPackage?.price || 0)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer disabled:cursor-not-allowed"
              onClick={() => setShowConfirmDialog(false)}
            >
              Отмена
            </Button>
            <Button
              className="cursor-pointer disabled:cursor-not-allowed"
              onClick={handleConfirmPurchase}
            >
              Подтвердить покупку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
