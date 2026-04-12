'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModelsGrid } from '@/components/dashboard/models-grid'
import { ChatsPanel } from '@/components/dashboard/chats-panel'
import { ProfilePanel } from '@/components/dashboard/profile-panel'
import { SubscriptionPanel } from '@/components/dashboard/subscription-panel'
import { Brain, MessageSquare, User, CreditCard } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('models')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Добро пожаловать, {user?.name}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Выберите модель для начала работы или продолжите предыдущие чаты
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Модели</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Чаты</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Подписка</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-6">
          <ModelsGrid />
        </TabsContent>

        <TabsContent value="chats" className="mt-6">
          <ChatsPanel />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <ProfilePanel />
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <SubscriptionPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
