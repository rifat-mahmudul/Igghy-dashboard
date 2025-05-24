"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import SearchInput from "@/components/search-input"
import Pagination from "@/components/pagination"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"



// Types
type HubManager = {
  id: string
  name: string
  email: string
  phone: string
  joiningDate: string
  assignedHub: string
}

type Hub = {
  hubName: string
  _id: string
}

type PaginationInfo = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type HubManagersResponse = {
  statusCode: number
  success: boolean
  message: string
  data: {
    formattedUsers: HubManager[]
    pagination: PaginationInfo
  }
}

type EditManagerFormData = {
  name: string
  email: string
  phone: string
  hubId: string
  password?: string
  confirmPassword?: string
}

export default function HubManagerList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [managerToDelete, setManagerToDelete] = useState<HubManager | null>(null)
  const [managerToEdit, setManagerToEdit] = useState<HubManager | null>(null)
  const [selectedHubId, setSelectedHubId] = useState("")

  const queryClient = useQueryClient()
  const session = useSession();
const token = session?.data?.accessToken;

  // Fetch hub managers
  const { data: hubManagersData, isLoading } = useQuery({
    queryKey: ["hubManagers", currentPage, searchQuery],
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/hub-managers`)
      url.searchParams.append("page", currentPage.toString())
      url.searchParams.append("limit", "10")

      if (searchQuery) {
        url.searchParams.append("search", searchQuery)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch hub managers")
      }

      return response.json() as Promise<HubManagersResponse>
    },
  })

  // Fetch hubs for dropdown
  const { data: hubsData, isLoading: isLoadingHubs } = useQuery({
    queryKey: ["hubs-dropdown"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/hubs?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch hubs")
      }

      return response.json()
    },
  })

  const hubs = hubsData?.data?.formattedHubs || []

  // Delete hub manager mutation
  const deleteManagerMutation = useMutation({
    mutationFn: async (managerId: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete-manager/${managerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete manager")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubManagers"] })
      toast.success("Hub manager deleted successfully")
      setIsDeleteModalOpen(false)
      setManagerToDelete(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete hub manager")
    },
  })

  // Edit form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditManagerFormData>()

  // Watch password field for validation
  const password = watch("password")

  // Update form when selectedHubId changes
  useEffect(() => {
    if (selectedHubId) {
      setValue("hubId", selectedHubId)
    }
  }, [selectedHubId, setValue])

  // Edit hub manager mutation
  const editManagerMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<EditManagerFormData>
    }) => {


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit-manager/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Edit manager error:", errorData)
        throw new Error(errorData.message || "Failed to update manager")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubManagers"] })
      toast.success("Hub manager updated successfully")
      setIsEditModalOpen(false)
      setManagerToEdit(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hub manager")
    },
  })

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Open delete confirmation modal
  const openDeleteModal = (manager: HubManager) => {
    setManagerToDelete(manager)
    setIsDeleteModalOpen(true)
  }

  // Handle delete confirmation
  const confirmDelete = () => {
    if (managerToDelete) {
      deleteManagerMutation.mutate(managerToDelete.id)
    }
  }

  // Find hub ID by hub name
  const findHubIdByName = (hubName: string) => {
    const hub = hubs.find((h: Hub) => h.hubName === hubName)
    return hub ? hub._id : ""
  }

  // Open edit modal
  const openEditModal = (manager: HubManager) => {
    setManagerToEdit(manager)
    setValue("name", manager.name)
    setValue("email", manager.email)
    setValue("phone", manager.phone)

    const hubId = findHubIdByName(manager.assignedHub)
    setValue("hubId", hubId)
    setSelectedHubId(hubId)

    setValue("password", "")
    setValue("confirmPassword", "")
    setIsEditModalOpen(true)
  }

  // Handle hub selection change
  const handleHubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHubId(e.target.value)
  }

  // Handle edit form submission
  const onEditSubmit = (data: EditManagerFormData) => {
    if (managerToEdit) {
      // Create a payload with only the fields that have values
      const payload: any = {}

      if (data.name) payload.name = data.name
      if (data.email) payload.email = data.email
      if (data.phone) payload.phone = data.phone
      if (data.hubId) payload.hubId = data.hubId

      // Always include password fields, even if empty
      payload.password = data.password || ""
      payload.confirmPassword = data.confirmPassword || ""

      editManagerMutation.mutate({
        id: managerToEdit.id,
        data: payload,
      })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yy")
    } catch (error) {
      return dateString
    }
  }

  const hubManagers = hubManagersData?.data.formattedUsers || []
  const pagination = hubManagersData?.data.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  }

  return (
    <div className="space-y-4 mt-20">
      <CardHeader className="flex flex-row items-center justify-between py-3 mb-5 bg-[#d9f0e8] rounded-md">
        <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <Image src={"megaphone.png"} alt="megaphone" width={30} height={30} />
          Hub Manager
        </CardTitle>
        <Link href="hub-manager-list/add-hub-manager">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Add <span className="ml-1">+</span>
          </Button>
        </Link>
      </CardHeader>

      <div className="p-4 bg-[#d9f0e8] rounded-md">
        <SearchInput placeholder="Search to filter..." onChange={handleSearch} />
      </div>

      <Card className="border-none bg-[#d9f0e8] rounded-md">
        <CardContent className="p-0">
          <div className="rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center p-3 text-xs font-medium">ID</th>
                  <th className="text-center p-3 text-xs font-medium">Name</th>
                  <th className="text-center p-3 text-xs font-medium">Email</th>
                  <th className="text-center p-3 text-xs font-medium">Phone</th>
                  <th className="text-center p-3 text-xs font-medium">Joining Date</th>
                  <th className="text-center p-3 text-xs font-medium">Assigned Hub</th>
                  <th className="text-center p-3 text-xs font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : hubManagers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
                      No hub managers found
                    </td>
                  </tr>
                ) : (
                  hubManagers.map((manager, index) => (
                    <tr key={manager.id} className="border-b border-gray-300">
                      <td className="p-3 text-xs text-center">{String(index + 1).padStart(2, "0")}</td>
                      <td className="p-3 text-xs text-center">{manager.name}</td>
                      <td className="p-3 text-xs text-center">{manager.email}</td>
                      <td className="p-3 text-xs text-center">{manager.phone}</td>
                      <td className="p-3 text-xs text-center">{formatDate(manager.joiningDate)}</td>
                      <td className="p-3 text-xs text-center">{manager.assignedHub}</td>
                      <td className="p-3 text-xs text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-emerald-600"
                            onClick={() => openEditModal(manager)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-red-600"
                            onClick={() => openDeleteModal(manager)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#d9f0e8]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the hub manager{" "}
              <span className="font-medium">{managerToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <div className="flex gap-3 w-full justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteManagerMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteManagerMutation.isPending}
              >
                {deleteManagerMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Manager Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) {
            reset()
            setManagerToEdit(null)
            setSelectedHubId("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-[#d9f0e8]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Hub Manager</DialogTitle>
            <DialogDescription>Update the hub manager's information below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" className="bg-inherit border border-gray-300" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="bg-inherit border border-gray-300"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                className="bg-inherit border border-gray-300"
                {...register("phone", {
                  pattern: {
                    value: /^[0-9+\-\s]+$/,
                    message: "Invalid phone number",
                  },
                })}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hubId">Assigned Hub</Label>
              <input type="hidden" {...register("hubId")} />
              <select
                id="hubId"
                className="w-full h-10 px-3 py-2 bg-inherit border border-gray-300 rounded-md"
                value={selectedHubId}
                onChange={handleHubChange}
              >
                <option value="">Select a hub</option>
                {isLoadingHubs ? (
                  <option value="" disabled>
                    Loading hubs...
                  </option>
                ) : hubs.length === 0 ? (
                  <option value="" disabled>
                    No hubs available
                  </option>
                ) : (
                  hubs.map((hub: Hub) => (
                    <option key={hub._id} value={hub._id}>
                      {hub.hubName}
                    </option>
                  ))
                )}
              </select>
              {errors.hubId && <p className="text-red-500 text-xs mt-1">{errors.hubId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                className="bg-inherit border border-gray-300"
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              <p className="text-xs text-gray-500">Leave blank to keep current password</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password (Optional)</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-inherit border border-gray-300"
                {...register("confirmPassword", {
                  validate: (value) => !password || value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
            </div>

            <DialogFooter className="sm:justify-start">
              <div className="flex gap-3 w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting || editManagerMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={isSubmitting || editManagerMutation.isPending}
                >
                  {isSubmitting || editManagerMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
