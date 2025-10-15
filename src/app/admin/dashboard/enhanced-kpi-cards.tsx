"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Briefcase, FileText, UserCheck } from "lucide-react"

const iconMap = {
  users: Users,
  briefcase: Briefcase,
  fileText: FileText,
  userCheck: UserCheck,
}

interface KPICardProps {
  title: string
  value: number | string
  iconName: keyof typeof iconMap
  description: string
  trend: string
  trendUp: boolean
  gradient: string
  iconColor: string
}

export function EnhancedKPICard({
  title,
  value,
  iconName,
  description,
  trend,
  trendUp,
  gradient,
  iconColor,
}: KPICardProps) {
  const Icon = iconMap[iconName]
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${gradient}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
            trendUp 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}>
            {trendUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">{trend}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-bold">
            {value}
          </p>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
    </Card>
  )
}

interface KPIGridProps {
  cards: Array<{
    title: string
    value: number | string
    iconName: keyof typeof iconMap
    description: string
    trend: string
    trendUp: boolean
    gradient: string
    iconColor: string
  }>
}

export function EnhancedKPIGrid({ cards }: KPIGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <EnhancedKPICard key={index} {...card} />
      ))}
    </div>
  )
}

