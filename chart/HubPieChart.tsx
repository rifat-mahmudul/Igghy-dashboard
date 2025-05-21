"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState } from "react"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HubPieChart() {
  const data = [
    { name: "Hub 1", value: 30 },
    { name: "Hub 2", value: 35 },
    { name: "Hub 3", value: 45 },
  ]
  const [monthFilter, setMonthFilter] = useState("March")

  const chartConfig = {
    "Hub 1": {
      label: "Hub 1",
      color: "#4dabf7", // Light blue
    },
    "Hub 2": {
      label: "Hub 2",
      color: "#ffd43b", // Yellow
    },
    "Hub 3": {
      label: "Hub 3",
      color: "#ae3ec9", // Purple
    },
  }


  

  return (
    <div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Top Receiver Hub</CardTitle>
        <Select defaultValue="March" onValueChange={setMonthFilter}>
          <SelectTrigger className="w-[120px] h-8 text-xs bg-inherit border-none">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="January">January</SelectItem>
            <SelectItem value="February">February</SelectItem>
            <SelectItem value="March">March</SelectItem>
            <SelectItem value="April">April</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <div>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name }) => `${name}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.name as keyof typeof chartConfig].color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <h2 className="-mt-3 pb-3 text-center">Total delivered product: 3000</h2>
    </div>
  )
}
