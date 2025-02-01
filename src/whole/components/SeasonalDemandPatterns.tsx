import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", demand: 65 },
  { month: "Feb", demand: 70 },
  { month: "Mar", demand: 80 },
  { month: "Apr", demand: 90 },
  { month: "May", demand: 95 },
  { month: "Jun", demand: 100 },
  { month: "Jul", demand: 98 },
  { month: "Aug", demand: 95 },
  { month: "Sep", demand: 90 },
  { month: "Oct", demand: 85 },
  { month: "Nov", demand: 75 },
  { month: "Dec", demand: 70 },
]

export function SeasonalDemandPatterns() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasonal Demand Patterns</CardTitle>
        <CardDescription>Visualize how property interest changes with seasons</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            demand: {
              label: "Demand",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="demand"
                stroke="var(--color-demand)"
                fill="var(--color-demand)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

