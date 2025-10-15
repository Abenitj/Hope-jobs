"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", users: 45, jobs: 12 },
  { month: "Feb", users: 52, jobs: 18 },
  { month: "Mar", users: 61, jobs: 24 },
  { month: "Apr", users: 75, jobs: 31 },
  { month: "May", users: 89, jobs: 42 },
  { month: "Jun", users: 108, jobs: 56 },
]

export function UserGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
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
        <Area
          type="monotone"
          dataKey="users"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorUsers)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="jobs"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorJobs)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}


