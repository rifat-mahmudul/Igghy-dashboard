"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import HubPieChart from "@/chart/HubPieChart";
import MonthlyDeliveredProductChart from "@/chart/MonthlyDeliveredProductChart";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const [monthFilter, setMonthFilter] = useState("March");

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWI0ZmI4Yzc3NWFlNzJjMmIzZjg3MyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzgwNDM4OCwiZXhwIjoxNzQ4NDA5MTg4fQ.KlndvixUUpO4Nk33wYpD2mI2sKXNMlRox6ZGF54aS-o"

  const {data : statistics} = useQuery({
    queryKey : ["allHubs"],
    queryFn : async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/overview`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }
  })


  const {data : tableData} = useQuery({
    queryKey : ["tableData"],
    queryFn : async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/top-hub-stats?month=05-2025`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }
  })

  return (
    <div className="space-y-6">
      <div className=" bg-[#d9f0e8] p-5 rounded-md">
        <h1 className="text-2xl font-bold mb-3">Overview</h1>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[#b0e0cf] border-none shadow-[0px_4px_8px_1px_#00000033]">
            <CardContent className="py-8 px-4">
              <div className="flex items-center gap-4">
                <div>
                  <Image
                    src={"/green-card.png"}
                    alt="green-card"
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <p className="text-sm">Total Hubs</p>
                  <h2 className="text-2xl font-bold">{statistics?.data.totalHubs}</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#b0e0cf] border-none shadow-[0px_4px_8px_1px_#00000033]">
            <CardContent className="py-8 px-4">
              <div className="flex items-center gap-4">
                <div>
                  <Image
                    src={"/vege-card.png"}
                    alt="vege-card"
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <p className="text-sm">Total Hub Product</p>
                  <h2 className="text-2xl font-bold">{statistics?.data.totalProducts}</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#b0e0cf] border-none shadow-[0px_4px_8px_1px_#00000033]">
            <CardContent className="py-8 px-4">
              <div className="flex items-center gap-4">
                <div>
                  <Image
                    src={"/blue-card.png"}
                    alt="blue-card"
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <p className="text-sm">Delivered Product</p>
                  <h2 className="text-2xl font-bold">{statistics?.data.deliverdProducts}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 bg-[#e6f5f0] border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Top Hub Lists
            </CardTitle>
            <Select defaultValue={monthFilter} onValueChange={setMonthFilter}>
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
          <CardContent className="mt-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#b0e0cf] font-semibold">
                  <tr className="text-center">
                    <th className="p-3 text-xs font-medium">
                      Top Receiver Hub
                    </th>
                    <th className="p-3 text-xs font-medium">Total Product</th>
                    <th className="p-3 text-xs font-medium">Top Sender Hub</th>
                    <th className="p-3 text-xs font-medium">Total Product</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      receiver: "Hub1",
                      receiverTotal: 100,
                      sender: "Hub2",
                      senderTotal: 100,
                    },
                    {
                      receiver: "Hub3",
                      receiverTotal: 300,
                      sender: "Hub9",
                      senderTotal: 300,
                    },
                    {
                      receiver: "Hub4",
                      receiverTotal: 250,
                      sender: "Hub10",
                      senderTotal: 250,
                    },
                    {
                      receiver: "Hub5",
                      receiverTotal: 200,
                      sender: "Hub8",
                      senderTotal: 200,
                    },
                    {
                      receiver: "Hub6",
                      receiverTotal: 150,
                      sender: "Hub12",
                      senderTotal: 100,
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="text-center bg-[#d9f0e8] border-b border-gray-300"
                    >
                      <td className="p-3 text-xs">{row.receiver}</td>
                      <td className="p-3 text-xs">{row.receiverTotal}</td>
                      <td className="p-3 text-xs">{row.sender}</td>
                      <td className="p-3 text-xs">{row.senderTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-emerald-50 border-none">
          {/* hub pie chart */}
          <HubPieChart />
        </Card>
      </div>

      <div>
        <MonthlyDeliveredProductChart />
      </div>
    </div>
  );
}
