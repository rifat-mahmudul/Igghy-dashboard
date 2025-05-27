"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState } from "react"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

// Type definitions for our data
interface HubData {
  hubId: string
  hubName: string
  deliveredCount: number
}

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: HubData[]
}

export default function HubPieChart() {
  const [monthFilter, setMonthFilter] = useState("05-2025")

  const session = useSession();
  const token = session?.data?.accessToken

  // API URL fallback in case environment variable is not set
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com"

  // Function to generate a color based on string input
  const generateColor = (str: string) => {
    // Simple hash function to generate a number from a string
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Convert to hex color
    let color = "#"
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += ("00" + value.toString(16)).substr(-2)
    }
    return color
  }

  // Fetch data using TanStack Query
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hubData", monthFilter],
    queryFn: async () => {
      try {
        const response = await fetch(`${apiUrl}/admin/top-receiver-hub-count?month=${monthFilter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        return response.json() as Promise<ApiResponse>
      } catch (err) {
        console.error("Error fetching hub data:", err)
        throw err
      }
    },
  })

  // Process data for chart
  const chartData =
    apiResponse?.data?.map((hub) => ({
      name: hub.hubName,
      value: hub.deliveredCount,
    })) || []

  // Calculate total delivered
  const totalDelivered = apiResponse?.data?.reduce((sum, hub) => sum + hub.deliveredCount, 0) || 0

  // Generate chart config with colors
  const chartConfig: Record<string, { label: string; color: string }> = {}
  apiResponse?.data?.forEach((hub) => {
    chartConfig[hub.hubName] = {
      label: hub.hubName,
      color: generateColor(hub.hubId),
    }
  })

  // Mock data for testing when API fails
  const mockData = [
    { name: "Hub A", value: 400 },
    { name: "Hub B", value: 300 },
    { name: "Hub C", value: 200 },
    { name: "Hub D", value: 100 },
  ]

  // Mock config for testing
  const mockConfig = {
    "Hub A": { label: "Hub A", color: "#FF5733" },
    "Hub B": { label: "Hub B", color: "#33FF57" },
    "Hub C": { label: "Hub C", color: "#3357FF" },
    "Hub D": { label: "Hub D", color: "#F033FF" },
  }

  // Use mock data if no real data is available (for testing purposes)
  const finalChartData = chartData.length > 0 ? chartData : mockData
  const finalChartConfig = Object.keys(chartConfig).length > 0 ? chartConfig : mockConfig

  // Handle month change
  const handleMonthChange = (value: string) => {
    setMonthFilter(value)
  }

  return (
    <div className="h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Top Receiver Hub</CardTitle>
        <Select value={monthFilter} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[120px] h-8 text-xs bg-inherit border-none">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="01-2025">January</SelectItem>
            <SelectItem value="02-2025">February</SelectItem>
            <SelectItem value="03-2025">March</SelectItem>
            <SelectItem value="04-2025">April</SelectItem>
            <SelectItem value="05-2025">May</SelectItem>
            <SelectItem value="06-2025">June</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <div className="h-[300px] w-full flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading hub data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            <p>Error loading data</p>
            <p className="text-sm">{"Unknown error"}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No hub data available for this month</p>
            <p className="text-sm mt-2">Using mock data for demonstration</p>
          </div>
        ) : (
          <ChartContainer config={finalChartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name }) => `${name}`}
                >
                  {finalChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={finalChartConfig[entry.name as keyof typeof finalChartConfig]?.color || "#cccccc"} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
      {!isLoading && !error && chartData.length > 0  && (
        <h2 className={`${totalDelivered > 0 ? "pb-3 text-center" : "hidden"}`}>
          Total delivered product:{" "}
          {chartData.length > 0 ? totalDelivered : 0}
        </h2>
      )}
    </div>
  )
}
