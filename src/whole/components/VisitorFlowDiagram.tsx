import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export function VisitorFlowDiagram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-500 text-white p-2 rounded">Landing Page</div>
          <div className="text-2xl">↓</div>
          <div className="flex space-x-8">
            <div className="flex flex-col items-center">
              <div className="bg-green-500 text-white p-2 rounded">Contact Form</div>
              <div className="text-sm mt-1">40%</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500 text-white p-2 rounded">Gallery</div>
              <div className="text-sm mt-1">35%</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-500 text-white p-2 rounded">Exit</div>
              <div className="text-sm mt-1">25%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

