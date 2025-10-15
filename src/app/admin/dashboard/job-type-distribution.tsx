"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface JobTypeDistributionProps {
  jobsByType: Array<{
    type: string
    _count: number
  }>
}

export function JobTypeDistribution({ jobsByType }: JobTypeDistributionProps) {
  const data = jobsByType.map(item => ({
    type: item.type.replace(/_/g, ' '),
    count: item._count,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="type"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}


