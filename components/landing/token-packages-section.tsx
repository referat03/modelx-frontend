'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { tokenPackages, formatTokensPrice, type TokenPackage } from '@/config/tokenPackages.config'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

interface TokenPackageCardProps {
  pkg: TokenPackage
  onBuy: (pkg: TokenPackage) => void
}

function TokenPackageCard({ pkg, onBuy }: TokenPackageCardProps) {
  return (
    <Card
      className={cn(
        'relative flex h-full flex-col transition-all hover:shadow-lg hover:shadow-primary/10',
        pkg.isPopular && 'border-primary shadow-lg shadow-primary/20'
      )}
    >
      <CardHeader>
        {pkg.isPopular && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              <Sparkles className="h-3 w-3" />
              Популярный
            </span>
          </div>
        )}
        <CardTitle className="text-xl">{pkg.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{formatTokensPrice(pkg.price)}</span>
        </div>
        {/* Description comes from the shared `tokenPackages` config so this
            card stays in sync with /buy-tokens and the purchase modal. */}
        <p className="text-sm text-muted-foreground">
          {pkg.description}
        </p>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          variant={pkg.isPopular ? 'default' : 'outline'}
          onClick={() => onBuy(pkg)}
        >
          Купить
        </Button>
      </CardFooter>
    </Card>
  )
}

export function TokenPackagesSection() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null)

  const handleBuy = (pkg: TokenPackage) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/buy-tokens')
      return
    }
    
    setSelectedPackage(pkg)
    setShowConfirmDialog(true)
  }

  const handleConfirmPurchase = () => {
    setShowConfirmDialog(false)
    toast.info('Оплата будет доступна позже')
    setSelectedPackage(null)
  }

  return (
    <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-space font-bold tracking-tight">
            или
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Получите токены отдельно
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="mt-10 hidden gap-8 md:grid md:grid-cols-3">
          {tokenPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TokenPackageCard pkg={pkg} onBuy={handleBuy} />
            </motion.div>
          ))}
        </div>

        {/* Mobile Snap Slider */}
        <div className="mt-10 md:hidden">
          <div
            className="flex snap-x snap-mandatory overflow-x-auto gap-4 pb-4 px-[7.5%]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tokenPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex-none w-[85%] snap-center"
              >
                <TokenPackageCard pkg={pkg} onBuy={handleBuy} />
              </div>
            ))}
          </div>
        </div>
        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 text-center"
        >
          <p className="text-muted-foreground">
            Есть вопросы?{' '}
            <Link href="/faq" className="text-primary underline-offset-4 hover:underline">
              Посмотрите FAQ
            </Link>{' '}
            или{' '}
            <Link href="/contacts" className="text-primary underline-offset-4 hover:underline">
              свяжитесь с нами
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
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
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleConfirmPurchase}>
              Подтвердить покупку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
