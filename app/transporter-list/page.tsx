"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, CheckCircle } from "lucide-react"
import SearchInput from "@/components/search-input"
import Pagination from "@/components/pagination"
import Image from "next/image"

// Sample data
const transporters = Array.from({ length: 10 }, (_, i) => ({
  name: "Jane Cooper",
  departureHub: `Hub${i + 1}`,
  arrivalHub: `Hub${i + 2}`,
  email: "info@gmail.com",
  phone: "+12300000",
  location: true,
}))

export default function TransporterList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4">
      <Card className="bg-emerald-50 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            Transporter List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <SearchInput placeholder="Search to filter..." onChange={setSearchQuery} />
          </div>

          <div className="rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-emerald-100 text-emerald-800">
                <tr>
                  <th className="text-left p-3 text-xs font-medium">Name</th>
                  <th className="text-left p-3 text-xs font-medium">Departure Hub</th>
                  <th className="text-left p-3 text-xs font-medium">Arrival Hub</th>
                  <th className="text-left p-3 text-xs font-medium">Email</th>
                  <th className="text-left p-3 text-xs font-medium">Phone</th>
                  <th className="text-left p-3 text-xs font-medium">Location</th>
                </tr>
              </thead>
              <tbody>
                {transporters.map((transporter, i) => (
                  <tr key={i} className="bg-white even:bg-emerald-50">
                    <td className="p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          <Image src="/diverse-group.png" alt={transporter.name} width={24} height={24} />
                        </div>
                        {transporter.name}
                      </div>
                    </td>
                    <td className="p-3 text-xs">{transporter.departureHub}</td>
                    <td className="p-3 text-xs">{transporter.arrivalHub}</td>
                    <td className="p-3 text-xs">{transporter.email}</td>
                    <td className="p-3 text-xs">{transporter.phone}</td>
                    <td className="p-3 text-xs">
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between text-xs text-gray-500">
            <div>Showing 1 to 10 of 20 results</div>
            <Pagination currentPage={currentPage} totalPages={17} onPageChange={setCurrentPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
