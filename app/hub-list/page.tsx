"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SearchInput from "@/components/search-input"
import Pagination from "@/components/pagination"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"

// API token
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmYwNDI1YjQwYzMyMjM1OThhMDM1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzkxMTg3MSwiZXhwIjoxNzQ4NTE2NjcxfQ.eaHs8v-9KkHQdStjI-R6vj_VNJtv45C7SBkmDqQNyaM"

// Types
type HubFormData = {
  hubName: string
  lat: string
  lng: string
}

type Hub = {
  hubName: string
  assignedManager: string | null
  assignedDate: string
  email: string | null
  phone: string | null
}

type PaginationInfo = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type HubsResponse = {
  statusCode: number
  success: boolean
  message: string
  data: {
    formattedHubs: Hub[]
    pagination: PaginationInfo
  }
}

export default function HubList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddHubOpen, setIsAddHubOpen] = useState(false)

  const queryClient = useQueryClient()

  // Fetch hubs
  const {
    data: hubsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["hubs", currentPage, searchQuery],
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/hubs`)
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
        throw new Error("Failed to fetch hubs")
      }

      return response.json() as Promise<HubsResponse>
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HubFormData>({
    defaultValues: {
      hubName: "",
      lat: "",
      lng: "",
    },
  })

  // Create hub mutation
  const createHubMutation = useMutation({
    mutationFn: async (data: HubFormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/hubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          hubName: data.hubName,
          coordinates: {
            lat: Number.parseFloat(data.lat),
            lng: Number.parseFloat(data.lng),
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create hub")
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch the hubs list
      queryClient.invalidateQueries({ queryKey: ["hubs"] })
      refetch() // Immediate refetch for instant update

      // Ensure toast is called correctly
      toast.success("Hub created successfully")

      reset()
      setIsAddHubOpen(false)
    },
    onError: (error: Error) => {
      // Ensure error toast is called correctly
      toast.error(error.message || "Failed to create hub")
    },
  })

  const onSubmit = (data: HubFormData) => {
    createHubMutation.mutate(data)
  }

  // Handle search with debounce
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yy")
    } catch (error) {
      return "N/A"
    }
  }

  const hubs = hubsData?.data.formattedHubs || []
  const pagination = hubsData?.data.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  }

  return (
    <div className="space-y-4">
      <CardHeader className="flex flex-row items-center justify-between py-4 mb-5 bg-[#d9f0e8] rounded-md">
        <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <Image src={"hub-flag.png"} alt="hub flag" width={30} height={30} />
          Hub List
        </CardTitle>
        <Dialog
          open={isAddHubOpen}
          onOpenChange={(open) => {
            setIsAddHubOpen(open)
            if (!open) reset()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Add <span className="ml-1">+</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#d9f0e8] p-0 border-none pb-6">
            <div className="pt-6 pl-6 rounded-t-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add New Hub</DialogTitle>
              </DialogHeader>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="px-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hub-name">Hub Name</Label>
                  <Input
                    id="hub-name"
                    placeholder="Hub name"
                    className="bg-inherit border border-gray-300"
                    {...register("hubName", {
                      required: "Hub name is required",
                    })}
                  />
                  {errors.hubName && <p className="text-red-500 text-xs mt-1">{errors.hubName.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      placeholder="23.7000"
                      className="bg-inherit border border-gray-300"
                      {...register("lat", {
                        required: "Latitude is required",
                        pattern: {
                          value: /^-?([0-8]?[0-9]|90)(\.\d{4})$/,
                          message: "Please enter a valid latitude with exactly 4 decimal places (e.g., 23.7000)",
                        },
                      })}
                    />
                    {errors.lat && <p className="text-red-500 text-xs mt-1">{errors.lat.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      placeholder="80.4000"
                      className="bg-inherit border border-gray-300"
                      {...register("lng", {
                        required: "Longitude is required",
                        pattern: {
                          value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.\d{4})$/,
                          message: "Please enter a valid longitude with exactly 4 decimal places (e.g., 80.4000)",
                        },
                      })}
                    />
                    {errors.lng && <p className="text-red-500 text-xs mt-1">{errors.lng.message}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                  disabled={isSubmitting || createHubMutation.isPending}
                >
                  {isSubmitting || createHubMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <div className="p-4 bg-[#d9f0e8] rounded-md">
        <SearchInput placeholder="Search to filter..." onChange={handleSearch} />
      </div>

      <Card className="border-none bg-[#d9f0e8] rounded-md">
        <CardContent className="p-0">
          <div className="rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-center">
                  <th className="p-3 text-xs font-medium">Hub Name</th>
                  <th className="p-3 text-xs font-medium">Assigned Manager</th>
                  <th className="p-3 text-xs font-medium">Assigned Date</th>
                  <th className="p-3 text-xs font-medium">Email</th>
                  <th className="p-3 text-xs font-medium">Phone</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : hubs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      No hubs found
                    </td>
                  </tr>
                ) : (
                  hubs.map((hub, i) => (
                    <tr className="text-center border-b border-gray-300" key={i}>
                      <td className="p-3 text-xs">{hub.hubName}</td>
                      <td className="p-3 text-xs">
                        <div className="text-center">
                          {hub.assignedManager || "Not assigned"}
                        </div>
                      </td>
                      <td className="p-3 text-xs">{formatDate(hub.assignedDate)}</td>
                      <td className="p-3 text-xs">{hub.email || "N/A"}</td>
                      <td className="p-3 text-xs">{hub.phone || "N/A"}</td>
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
