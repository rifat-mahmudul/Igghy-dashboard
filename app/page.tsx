"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CuboidIcon as Cube } from "lucide-react"

export default function Dashboard() {
  const [monthFilter, setMonthFilter] = useState("March")
  const [yearFilter, setYearFilter] = useState("This year")

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Overview</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-200 p-3 rounded-md">
                <Cube className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-emerald-700">Total Hubs</p>
                <h2 className="text-2xl font-bold text-emerald-800">120</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-200 p-3 rounded-md">
                <Cube className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Total Hub Product</p>
                <h2 className="text-2xl font-bold text-purple-800">350</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-200 p-3 rounded-md">
                <Cube className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Delivered Product</p>
                <h2 className="text-2xl font-bold text-blue-800">200</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-3 bg-emerald-50 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Hub Lists</CardTitle>
            <Select defaultValue={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs bg-white">
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
          <CardContent>
            <div className="rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-emerald-100 text-emerald-800">
                  <tr>
                    <th className="text-left p-2 text-xs font-medium">Top Receiver Hub</th>
                    <th className="text-left p-2 text-xs font-medium">Total Product</th>
                    <th className="text-left p-2 text-xs font-medium">Top Sender Hub</th>
                    <th className="text-left p-2 text-xs font-medium">Total Product</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { receiver: "Hub1", receiverTotal: 100, sender: "Hub2", senderTotal: 100 },
                    { receiver: "Hub3", receiverTotal: 300, sender: "Hub9", senderTotal: 300 },
                    { receiver: "Hub4", receiverTotal: 250, sender: "Hub10", senderTotal: 250 },
                    { receiver: "Hub5", receiverTotal: 200, sender: "Hub8", senderTotal: 200 },
                    { receiver: "Hub6", receiverTotal: 150, sender: "Hub12", senderTotal: 100 },
                  ].map((row, i) => (
                    <tr key={i} className="bg-white even:bg-emerald-50">
                      <td className="p-2 text-xs">{row.receiver}</td>
                      <td className="p-2 text-xs">{row.receiverTotal}</td>
                      <td className="p-2 text-xs">{row.sender}</td>
                      <td className="p-2 text-xs">{row.senderTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-emerald-50 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Receiver Hub</CardTitle>
            <Select defaultValue="February" onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs bg-white">
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
          <CardContent className="flex flex-col items-center">
            <div className="w-48 h-48 relative">
              {/* This is a placeholder for the pie chart - in a real app you'd use a chart library */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute w-1/3 h-full bg-blue-400 origin-center rotate-0"></div>
                <div className="absolute w-1/3 h-full bg-yellow-400 origin-center rotate-120"></div>
                <div className="absolute w-1/3 h-full bg-purple-400 origin-center rotate-240"></div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>Hub 1</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span>Hub 2</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span>Hub 3</span>
                </div>
              </div>
              <p className="text-xs mt-2">Total delivered product: 3000</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-emerald-50 border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Monthly Delivered Product</CardTitle>
          <Select defaultValue={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-white">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last year">Last year</SelectItem>
              <SelectItem value="This year">This year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            {/* This is a placeholder for the bar chart - in a real app you'd use a chart library */}
            <div className="h-full w-full flex items-end justify-between gap-2 border-l border-b border-gray-300 relative">
              {[
                { month: "Jan", value: 380, color: "bg-blue-400" },
                { month: "Feb", value: 150, color: "bg-blue-400" },
                { month: "Mar", value: 200, color: "bg-cyan-400" },
                { month: "Apr", value: 280, color: "bg-cyan-400" },
                { month: "May", value: 380, color: "bg-purple-400" },
                { month: "Jun", value: 280, color: "bg-yellow-400" },
                { month: "Jul", value: 100, color: "bg-pink-400" },
                { month: "Aug", value: 230, color: "bg-orange-400" },
                { month: "Sep", value: 350, color: "bg-yellow-400" },
                { month: "Oct", value: 200, color: "bg-purple-400" },
                { month: "Nov", value: 120, color: "bg-green-300" },
                { month: "Dec", value: 450, color: "bg-green-400" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-full ${item.color} rounded-t`}
                    style={{ height: `${(item.value / 500) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-1">{item.month}</span>
                </div>
              ))}

              {/* Y-axis labels */}
              <div className="absolute -left-8 bottom-0 h-full flex flex-col justify-between text-xs text-gray-500">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-gray-200"
                  style={{ bottom: `${i * 20}%` }}
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
