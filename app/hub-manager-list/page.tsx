"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"
import SearchInput from "@/components/search-input"
import Pagination from "@/components/pagination"
import Image from "next/image"

// Sample data
const hubManagers = Array.from({ length: 10 }, (_, i) => ({
  id: `0${i + 1}`,
  name: "Jane Cooper",
  email: "jane.cooper@example.com",
  phone: "+12300000",
  joiningDate: "27/04/25",
  assignedHub: `Hub${i + 1}`,
}))

export default function HubManagerList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4">
      <Card className="bg-emerald-50 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-emerald-600" />
            Hub Manager
          </CardTitle>
          <Link href="hub-manager-list/add-hub-manager">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Add <span className="ml-1">+</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <SearchInput placeholder="Search to filter..." onChange={setSearchQuery} />
          </div>

          <div className="rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-emerald-100 text-emerald-800">
                <tr>
                  <th className="text-left p-3 text-xs font-medium">ID</th>
                  <th className="text-left p-3 text-xs font-medium">Name</th>
                  <th className="text-left p-3 text-xs font-medium">Email</th>
                  <th className="text-left p-3 text-xs font-medium">Phone</th>
                  <th className="text-left p-3 text-xs font-medium">Joining Date</th>
                  <th className="text-left p-3 text-xs font-medium">Assigned Hub</th>
                  <th className="text-left p-3 text-xs font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {hubManagers.map((manager, i) => (
                  <tr key={i} className="bg-white even:bg-emerald-50">
                    <td className="p-3 text-xs">{manager.id}</td>
                    <td className="p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          <Image src="/diverse-group.png" alt={manager.name} width={24} height={24} />
                        </div>
                        {manager.name}
                      </div>
                    </td>
                    <td className="p-3 text-xs">{manager.email}</td>
                    <td className="p-3 text-xs">{manager.phone}</td>
                    <td className="p-3 text-xs">{manager.joiningDate}</td>
                    <td className="p-3 text-xs">{manager.assignedHub}</td>
                    <td className="p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-emerald-600">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
