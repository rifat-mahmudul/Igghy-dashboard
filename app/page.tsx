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
import TopHubLists from "@/table/TopHubLists";

export default function Dashboard() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmYwNDI1YjQwYzMyMjM1OThhMDM1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzkxMzAyMSwiZXhwIjoxNzQ4NTE3ODIxfQ.V0W_mpWcF5-8bL2_FEi7kMQdJrQoz3Qn1ln5RtjFcrI"

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
        <TopHubLists />

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
