"use client";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    { name: "Basic", price: "$9.99/month", features: ["5 Landing Pages", "Basic Analytics", "Email Support"] },
    {
      name: "Pro",
      price: "$29.99/month",
      features: ["Unlimited Landing Pages", "Advanced Analytics", "Priority Support"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom Solutions", "Dedicated Account Manager", "24/7 Support"],
    },
  ];

  const invoices = [
    { id: "INV-001", date: "2023-05-01", amount: "$29.99", status: "Paid" },
    { id: "INV-002", date: "2023-04-01", amount: "$29.99", status: "Paid" },
    { id: "INV-003", date: "2023-03-01", amount: "$29.99", status: "Paid" },
  ];

  const usageData = [
    { name: "Jan", landingPages: 4, leads: 20 },
    { name: "Feb", landingPages: 6, leads: 32 },
    { name: "Mar", landingPages: 8, leads: 45 },
    { name: "Apr", landingPages: 10, leads: 60 },
    { name: "May", landingPages: 12, leads: 75 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with UserNav */}
        <header className="bg-white shadow-md z-10 h-16 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Billing</h1>
        </header>

        {/* Billing Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto space-y-8">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription and billing details.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Pro Plan</p>
                      <p className="text-sm text-gray-500">$29.99/month</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next billing date: June 1, 2023</p>
                  </div>
                  <div className="pt-4">
                    <h3 className="font-semibold mb-2">Plan Features:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {plans[1].features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>View your current usage and trends.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="landingPages" fill="#3182CE" name="Landing Pages" />
                      <Bar dataKey="leads" fill="#E53E3E" name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Update your payment information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-sm font-semibold">VISA</span>
                  </div>
                  <div>
                    <p className="font-semibold">Visa ending in 1234</p>
                    <p className="text-sm text-gray-500">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline">Update Payment Method</Button>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past invoices and payments.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0">
                            Download PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
