'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, CreditCard, Receipt, Shield, Coins } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { ProfileSettings } from '@/components/profile/profile-settings'
import { SubscriptionSettings } from '@/components/profile/subscription-settings'
import { PaymentHistory } from '@/components/profile/payment-history'
import { SecuritySettings } from '@/components/profile/security-settings'
import { TokenBalanceSettings } from '@/components/profile/token-balance-settings'

function ProfileContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'profile'
  const [activeTab, setActiveTab] = useState(defaultTab)

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'subscription', label: 'Подписка', icon: CreditCard },
    { id: 'tokens', label: 'Баланс и токены', icon: Coins },
    { id: 'payments', label: 'Платежи', icon: Receipt },
    { id: 'security', label: 'Безопасность', icon: Shield },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Настройки</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionSettings />
          </TabsContent>

          <TabsContent value="tokens">
            <TokenBalanceSettings />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentHistory />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
