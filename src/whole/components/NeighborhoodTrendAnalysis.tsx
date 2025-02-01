import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", downtown: 85, suburban: 65, rural: 40 },
  { month: "Feb", downtown: 88, suburban: 68, rural: 42 },
  { month: "Mar", downtown: 95, suburban: 75, rural: 48 },
  { month: "Apr", downtown: 92, suburban: 80, rural: 52 },
  { month: "May", downtown: 90, suburban: 85, rural: 58 },
]

export function NeighborhoodTrendAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhood Trend Analysis</CardTitle>
        <CardDescription>Track interest in different neighborhoods over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            downtown: {
              label: "Downtown",
              color: "hsl(var(--chart-1))",
            },
            suburban: {
              label: "Suburban",
              color: "hsl(var(--chart-2))",
            },
            rural: {
              label: "Rural",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="downtown" stroke="var(--color-downtown)" strokeWidth={2} />
              <Line type="monotone" dataKey="suburban" stroke="var(--color-suburban)" strokeWidth={2} />
              <Line type="monotone" dataKey="rural" stroke="var(--color-rural)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

