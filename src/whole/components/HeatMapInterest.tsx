import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export function HeatMapInterest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Interest Heat Map</CardTitle>
        <CardDescription>Visualize which parts of the property listing get the most attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
          <img src="/placeholder.svg" alt="Property Floor Plan" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-500/50 via-yellow-500/30 to-green-500/20"
            style={{ clipPath: "polygon(10% 20%, 60% 40%, 90% 60%, 40% 80%, 20% 50%)" }}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}

