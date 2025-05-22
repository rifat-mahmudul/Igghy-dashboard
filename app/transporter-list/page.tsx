"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SearchInput from "@/components/search-input"
import Pagination from "@/components/pagination"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

// API token
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWI0ZmI4Yzc3NWFlNzJjMmIzZjg3MyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0Nzg4OTM2MSwiZXhwIjoxNzQ4NDk0MTYxfQ.xi_W8IawPu6valGiazj4lMs0rV_JuC5QbZzPTemEqRE"

// Types
type Transporter = {
  id: string
  name: string
  email: string
  phone: string
  fromHub: string
  toHub: string
  status: string
}

type PaginationInfo = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type TransportersResponse = {
  statusCode: number
  success: boolean
  message: string
  data: {
    formattedTransporters: Transporter[]
    pagination: PaginationInfo
  }
}

export default function TransporterList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch transporters
  const { data: transportersData, isLoading } = useQuery({
    queryKey: ["transporters", currentPage, searchQuery],
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/transporters`)
      url.searchParams.append("page", currentPage.toString())
      url.searchParams.append("limit", "10")

      if (searchQuery) {
        url.searchParams.append("search", searchQuery)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transporters")
      }

      return response.json() as Promise<TransportersResponse>
    },
  })

  // Handle search with debounce
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on the way":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const transporters = transportersData?.data.formattedTransporters || []
  const pagination = transportersData?.data.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  }

  return (
    <div className="space-y-4">
      <CardHeader className="flex flex-row items-center justify-between py-4 mb-5 bg-[#d9f0e8] rounded-md">
        <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <Image src={"user-group.png"} alt="user group" width={30} height={30} />
          Transporter List
        </CardTitle>
      </CardHeader>

      <div className="p-4 bg-[#d9f0e8] rounded-md">
        <SearchInput placeholder="Search transporters..." onChange={handleSearch} />
      </div>

      <Card className="border-none bg-[#d9f0e8] rounded-md">
        <CardContent className="p-0">
          <div className="rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-center">
                  <th className="p-3 text-xs font-medium">Name</th>
                  <th className="p-3 text-xs font-medium">Email</th>
                  <th className="p-3 text-xs font-medium">Phone</th>
                  <th className="p-3 text-xs font-medium">From Hub</th>
                  <th className="p-3 text-xs font-medium">To Hub</th>
                  <th className="p-3 text-xs font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : transporters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      No transporters found
                    </td>
                  </tr>
                ) : (
                  transporters.map((transporter) => (
                    <tr className="text-center border-b border-gray-300" key={transporter.id}>
                      <td className="p-3 text-xs">{transporter.name}</td>
                      <td className="p-3 text-xs">{transporter.email}</td>
                      <td className="p-3 text-xs">{transporter.phone}</td>
                      <td className="p-3 text-xs">{transporter.fromHub}</td>
                      <td className="p-3 text-xs">{transporter.toHub}</td>
                      <td className="p-3 text-xs">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transporter.status,
                          )}`}
                        >
                          {transporter.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between text-xs text-gray-500">
            <div>
              {pagination.total > 0
                ? `Showing ${(pagination.page - 1) * pagination.limit + 1} to ${Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )} of ${pagination.total} results`
                : "No results"}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
