import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { day: "1", price: 500000, views: 50, leads: 2 },
  { day: "2", price: 500000, views: 45, leads: 1 },
  { day: "3", price: 485000, views: 80, leads: 4 },
  { day: "4", price: 485000, views: 100, leads: 6 },
  { day: "5", price: 485000, views: 90, leads: 5 },
]

export function PriceDropImpact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Drop Impact</CardTitle>
        <CardDescription>Measure how price changes affect listing views and leads</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            price: {
              label: "Price ($)",
              color: "hsl(var(--chart-1))",
            },
            views: {
              label: "Views",
              color: "hsl(var(--chart-2))",
            },
            leads: {
              label: "Leads",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="leads" stroke="var(--color-leads)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

