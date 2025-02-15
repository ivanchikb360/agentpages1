import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { name: "Living Room", views: 120, avgTime: 45 },
  { name: "Kitchen", views: 98, avgTime: 30 },
  { name: "Master Bedroom", views: 86, avgTime: 25 },
  { name: "Bathroom", views: 65, avgTime: 15 },
  { name: "Backyard", views: 55, avgTime: 20 },
]

export function VirtualTourEngagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Tour Engagement</CardTitle>
        <CardDescription>Track how users interact with the virtual property tour</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            views: {
              label: "Views",
              color: "hsl(var(--chart-1))",
            },
            avgTime: {
              label: "Avg. Time (s)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="views" fill="var(--color-views)" name="Views" />
              <Bar yAxisId="right" dataKey="avgTime" fill="var(--color-avgTime)" name="Avg. Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

