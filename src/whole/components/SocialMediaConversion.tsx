import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { platform: "Facebook", views: 1200, leads: 45 },
  { platform: "Instagram", views: 800, leads: 30 },
  { platform: "Twitter", views: 600, leads: 20 },
  { platform: "LinkedIn", views: 400, leads: 15 },
  { platform: "Pinterest", views: 200, leads: 8 },
]

export function SocialMediaConversion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Conversion</CardTitle>
        <CardDescription>Monitor which social platforms drive the most quality leads</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            views: {
              label: "Views",
              color: "hsl(var(--chart-1))",
            },
            leads: {
              label: "Leads",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="views" fill="var(--color-views)" name="Views" />
              <Bar yAxisId="right" dataKey="leads" fill="var(--color-leads)" name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

