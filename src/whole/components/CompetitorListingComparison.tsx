import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

const data = [
  { attribute: "Price", yourListing: 90, competitor1: 85, competitor2: 95 },
  { attribute: "Square Footage", yourListing: 85, competitor1: 80, competitor2: 90 },
  { attribute: "Bedrooms", yourListing: 100, competitor1: 100, competitor2: 100 },
  { attribute: "Bathrooms", yourListing: 95, competitor1: 90, competitor2: 95 },
  { attribute: "Location", yourListing: 90, competitor1: 95, competitor2: 85 },
  { attribute: "Condition", yourListing: 95, competitor1: 90, competitor2: 85 },
]

export function CompetitorListingComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Listing Comparison</CardTitle>
        <CardDescription>Compare your listing's performance against similar properties</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            yourListing: {
              label: "Your Listing",
              color: "hsl(var(--chart-1))",
            },
            competitor1: {
              label: "Competitor 1",
              color: "hsl(var(--chart-2))",
            },
            competitor2: {
              label: "Competitor 2",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="attribute" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar
                name="Your Listing"
                dataKey="yourListing"
                stroke="var(--color-yourListing)"
                fill="var(--color-yourListing)"
                fillOpacity={0.6}
              />
              <Radar
                name="Competitor 1"
                dataKey="competitor1"
                stroke="var(--color-competitor1)"
                fill="var(--color-competitor1)"
                fillOpacity={0.6}
              />
              <Radar
                name="Competitor 2"
                dataKey="competitor2"
                stroke="var(--color-competitor2)"
                fill="var(--color-competitor2)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

