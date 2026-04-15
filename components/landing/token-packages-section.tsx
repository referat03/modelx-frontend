'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
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
        <p className="text-sm text-muted-foreground">
          {pkg.tokens} токенов для использования в чате с AI-моделями
        </p>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
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
    <section className="relative py-20 sm:py-32">
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
          <h2 className="text-5xl font-bold tracking-tight">
            ИЛИ
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            ПОЛУЧИТЕ ТОКЕНЫ ОТДЕЛЬНО
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="mt-16 hidden gap-8 md:grid md:grid-cols-3">
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

        {/* Mobile Carousel */}
        <div className="mt-16 md:hidden">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {tokenPackages.map((pkg) => (
                <CarouselItem key={pkg.id} className="pl-4 basis-[85%]">
                  <TokenPackageCard pkg={pkg} onBuy={handleBuy} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-10 w-10 rounded-full border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext className="right-2 h-10 w-10 rounded-full border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </Carousel>
        </div>
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
