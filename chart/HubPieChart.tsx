"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Type definitions for our data
interface HubData {
  hubId: string;
  hubName: string;
  deliveredCount: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: HubData[];
}

export default function HubPieChart() {
  const [monthFilter, setMonthFilter] = useState("05-2025");

  // Authorization token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmYwNDI1YjQwYzMyMjM1OThhMDM1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzkxMzAyMSwiZXhwIjoxNzQ4NTE3ODIxfQ.V0W_mpWcF5-8bL2_FEi7kMQdJrQoz3Qn1ln5RtjFcrI";

  // Function to generate a color based on string input
  const generateColor = (str: string) => {
    // Simple hash function to generate a number from a string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to hex color
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };

  // Fetch data using TanStack Query
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hubData", monthFilter],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/top-receiver-hub-count?month=${monthFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return response.json() as Promise<ApiResponse>;
    },
  });

  // Process data for chart
  const chartData =
    apiResponse?.data?.map((hub) => ({
      name: hub.hubName,
      value: hub.deliveredCount,
    })) || [];

  // Calculate total delivered
  const totalDelivered =
    apiResponse?.data?.reduce((sum, hub) => sum + hub.deliveredCount, 0) || 0;

  // Generate chart config with colors
  const chartConfig: Record<string, { label: string; color: string }> = {};
  apiResponse?.data?.forEach((hub) => {
    chartConfig[hub.hubName] = {
      label: hub.hubName,
      color: generateColor(hub.hubId),
    };
  });

  // Handle month change
  const handleMonthChange = (value: string) => {
    setMonthFilter(value);
  };

  return (
    <div className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          Top Receiver Hub
        </CardTitle>
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

      <div className="h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Loading hub data...
            </p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            <p>Error loading data</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No hub data available for this month</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name }) => `${name}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartConfig[entry.name]?.color || "#cccccc"}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
      {!isLoading && !error && chartData.length > 0 && (
        <h2 className="pb-3 text-center">
          Total delivered product: {totalDelivered}
        </h2>
      )}
    </div>
  );
}
