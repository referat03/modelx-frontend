'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { models, modelCategories, type ModelCategory } from '@/config/models.config'
import { cn } from '@/lib/utils'

// Helper to get Lucide icon by name
function getIcon(iconName: string) {
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
  return IconComponent || Icons.Sparkles
}

export function ModelsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'all'>('all')

  const filteredModels = selectedCategory === 'all'
    ? models
    : models.filter(model => model.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ModelCategory | 'all')}>
        <TabsList>
          <TabsTrigger value="all" className="cursor-pointer">Все</TabsTrigger>
          {modelCategories.map((category) => {
            const Icon = getIcon(category.icon)
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2 cursor-pointer">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Models Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredModels.map((model, index) => {
          const Icon = getIcon(model.icon)
          
          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={model.isAvailable ? `/chat?model=${model.id}` : '#'}>
                <Card
                  className={cn(
                    'group relative h-full transition-all hover:shadow-lg',
                    model.isAvailable
                      ? 'cursor-pointer hover:border-primary/50 hover:shadow-primary/10'
                      : 'cursor-not-allowed opacity-60'
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                        {model.emoji}
                      </div>
                      <Badge
                        variant={model.isAvailable ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {model.isAvailable ? 'Доступна' : 'Скоро'}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{model.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {model.description}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">{model.provider}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {model.supportedFeatures.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {model.supportedFeatures.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{model.supportedFeatures.length - 3}
                        </Badge>
                      )}
                    </div>
                    {model.maxTokens && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        До {model.maxTokens.toLocaleString()} токенов
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {filteredModels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.SearchX className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Модели не найдены</h3>
          <p className="mt-2 text-muted-foreground">
            В выбранной категории пока нет моделей
          </p>
        </div>
      )}
    </div>
  )
}
