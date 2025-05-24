"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function AdminPanel() {
  const session = useSession()
  const token = session?.data?.accessToken

  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: receivers = [] } = useQuery({
    queryKey: ["transportRequest", token, searchTerm],
    queryFn: async () => {
      if (!token) return []

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hub-manager/receiver-requests?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.json()
    },
  })

  const allReceiverItems = receivers?.data?.requests || []

  // Pagination calculations
  const totalItems = allReceiverItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = allReceiverItems.slice(startIndex, endIndex)

  // Calculate display text
  const showingStart = totalItems === 0 ? 0 : startIndex + 1
  const showingEnd = Math.min(endIndex, totalItems)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Handle status change
  const { mutateAsync } = useMutation({
    mutationKey: ["update-transport-status"],
    mutationFn: async ({ status, id }: { status: string; id: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hub-manager/manage-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: id,
          action: status,
        }),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Shipment status updated successfully")
    },
  })

  const handleAccept = (status: string, id: string) => {
    mutateAsync({ status, id })
  }

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, current page area, and last page with ellipsis
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show middle pages
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  // Handle search input change and reset pagination
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold text-gray-800">Receiver</h1>
      <p className="text-gray-600 mt-1 mb-6">Welcome back to your admin panel</p>

      <div className="mb-6">
        <div className="mb-6 bg-[#e6f5f0] rounded-lg p-4">
          <div className="relative flex-1 mr-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-[#e6f5f0]">
          <table className="min-w-full bg-[#e6f5f0]">
            <thead>
              <tr className="text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Departure Hub</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Measurement</th>
                <th className="px-4 py-3">Shipper</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item: any, i: any) => (
                <tr key={i} className="border-b border-gray-200 bg-[#e6f5f0]">
                  <td className="py-4">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">{item?.transporter.name}</span>
                      <span className="text-xs text-gray-500">{item.transporter.email}</span>
                      <span className="text-xs text-gray-500">{item.transporter.phone}</span>
                    </div>
                  </td>
                  <td className="text-center">{item.productName}</td>
                  <td className="text-center">{item.toHub}</td>
                  <td className="text-center">{item.weight}</td>
                  <td className="text-center">{item.measurement}</td>
                  <td className="py-4">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">{item.receiver.name}</span>
                      <span className="text-xs text-gray-500">{item.receiver.email}</span>
                      <span className="text-xs text-gray-500">{item.receiver.phone}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col items-center">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>{item.time}</span>
                    </div>
                  </td>
                  <td className="text-center">{item.price}</td>
                  <td>
                    <div className="flex justify-center items-center">
                      {item.status === "Pending Approval" ? (
                        <Button
                          onClick={() => handleAccept("approve", item.requestId)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                          size="sm"
                        >
                          Accept
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500 w-full"
                          size="sm"
                        >
                          Accepted
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Functional Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="text-gray-600">
              Showing {showingStart} to {showingEnd} of {totalItems} results
            </div>
            <div className="flex items-center space-x-1">
              <button
                className={`w-8 h-8 flex items-center justify-center rounded bg-[#e0f0e9] text-gray-600 hover:bg-[#d0e8e0] ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={goToPrevious}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">...</button>
                  ) : (
                    <button
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        currentPage === page ? "bg-green-500 text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => goToPage(page as number)}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}

              <button
                className={`w-8 h-8 flex items-center justify-center rounded bg-[#e0f0e9] text-gray-600 hover:bg-[#d0e8e0] ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
