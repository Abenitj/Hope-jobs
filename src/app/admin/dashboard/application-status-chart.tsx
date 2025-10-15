"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface ApplicationStatusChartProps {
  pending: number
  reviewed: number
  accepted: number
  rejected: number
}

const COLORS = {
  pending: "#eab308",
  reviewed: "#3b82f6",
  accepted: "#10b981",
  rejected: "#ef4444",
}

export function ApplicationStatusChart({ pending, reviewed, accepted, rejected }: ApplicationStatusChartProps) {
  const data = [
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "Reviewed", value: reviewed, color: COLORS.reviewed },
    { name: "Accepted", value: accepted, color: COLORS.accepted },
    { name: "Rejected", value: rejected, color: COLORS.rejected },
  ].filter(item => item.value > 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value, entry: any) => (
            <span className="text-sm">
              {value}: <span className="font-semibold">{entry.payload.value}</span>
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}


