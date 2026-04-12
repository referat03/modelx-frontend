'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { ModelsGrid } from '@/components/dashboard/models-grid'
import { CosmicBackground } from '@/components/cosmic-background'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <CosmicBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

        <ModelsGrid />
      </div>
    </div>
  )
}
