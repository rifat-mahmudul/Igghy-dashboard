"use client";

import { useEffect, useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

type Statistics = {
  month: string;
  totalDelivered: number;
};

export default function MonthlyDeliveredProductChart() {
  const year = new Date().getFullYear();
  const [monthFilter, setMonthFilter] = useState(year);

  const previousYear = year - 1;
  const previousYear2 = year - 2;
  const previousYear3 = year - 3;
  const previousYear4 = year - 4;
  const previousYear5 = year - 5;

  const years = [
    previousYear5,
    previousYear4,
    previousYear3,
    previousYear2,
    previousYear,
    year,
  ];

  const colors = [
    "#3b82f6",
    "#60a5fa",
    "#67e8f9",
    "#2dd4bf",
    "#e879f9",
    "#fde047",
    "#f472b6",
    "#fb923c",
    "#facc15",
    "#c084fc",
    "#86efac",
    "#4ade80",
  ];

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmYwNDI1YjQwYzMyMjM1OThhMDM1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzkxMzAyMSwiZXhwIjoxNzQ4NTE3ODIxfQ.V0W_mpWcF5-8bL2_FEi7kMQdJrQoz3Qn1ln5RtjFcrI";

  const { data: statisticsVar, refetch } = useQuery({
    queryKey: ["top-receiver-hub", monthFilter], // Add monthFilter to queryKey to trigger refetch when it changes
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/monthly-delivered-products?year=${monthFilter}`,
        {
          // Use monthFilter instead of year
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    },
  });

  const MAX_DELIVERIES = 500;

  // Only refetch when monthFilter changes
  useEffect(() => {
    refetch();
  }, [monthFilter, refetch]); // Add dependencies

  return (
    <div className="w-full rounded-lg bg-[#e6f5f0] p-4 my-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          Top Receiver Hub
        </CardTitle>
        <Select
          defaultValue={monthFilter.toString()}
          onValueChange={(value) => setMonthFilter(Number.parseInt(value))}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs bg-inherit border-none">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <div className="flex h-[350px]">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 h-[350px] w-10">
          {[500, 400, 300, 200, 100, 0].map((value) => (
            <div
              key={value}
              className="h-6 flex items-center justify-end w-full"
            >
              {value}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative h-[400px]">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between h-[350px]">
            {[0, 1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="w-full border-b border-gray-200" />
            ))}
          </div>

          {/* Bars and month labels */}
          <div className="absolute inset-0 h-[350px]">
            <div className="h-full flex">
              {statisticsVar?.data?.map((item: Statistics, index: number) => (
                <div key={item.month} className="flex-1 flex flex-col h-full">
                  <div className="flex-1 flex items-end justify-center px-1 pb-6">
                    <div
                      className="w-8 rounded-t-sm"
                      style={{
                        height: `${
                          (item.totalDelivered / MAX_DELIVERIES) * 100
                        }%`,
                        backgroundColor: `${colors[index % colors.length]}`,
                      }}
                    />
                  </div>
                  <div className="h-6 flex items-center justify-center text-xs">
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
