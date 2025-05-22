"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

// API token
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmYwNDI1YjQwYzMyMjM1OThhMDM1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzkxMTg3MSwiZXhwIjoxNzQ4NTE2NjcxfQ.eaHs8v-9KkHQdStjI-R6vj_VNJtv45C7SBkmDqQNyaM"

type FormData = {
  username: string
  email: string
  phone: string
  hubId: string
  password: string
  confirmPassword: string
}

type Hub = {
  _id: string
  hubName: string
}

export default function AddHubManager() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedHub, setSelectedHub] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      hubId: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Watch password for validation
  const password = watch("password")

  // Fetch hubs for dropdown
  const { data: hubsData, isLoading: isLoadingHubs } = useQuery({
    queryKey: ["hubs-dropdown"],
    queryFn: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/hubs?limit=100`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch hubs")
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error fetching hubs:", error)
        throw error
      }
    },
  })

  const hubs = hubsData?.data?.formattedHubs || []


  // Handle hub selection
  const handleHubChange = (value: string) => {
    setSelectedHub(value)
    setValue("hubId", value)
  }

  // Create hub manager mutation
  const createManagerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/add-managers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          name: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
          confirmPassword: data.confirmPassword,
          hubId: data.hubId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create hub manager")
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success("Hub manager created successfully")
      router.push("/hub-manager-list")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create hub manager")
    },
  })

  const onSubmit = (data: FormData) => {
    if (!selectedHub) {
      toast.error("Please select a hub")
      return
    }
    createManagerMutation.mutate(data)
  }

  return (
    <div>
      <Card className="bg-[#d9f0e8] border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-[#444444]">Add New Hub Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Name</Label>
                <Input
                  id="username"
                  placeholder="User name"
                  className="bg-inherit border border-gray-400"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="bg-inherit border border-gray-400"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Phone"
                  className="bg-inherit border border-gray-400"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\-\s]+$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hubId">Select Hub</Label>
                <input type="hidden" {...register("hubId", { required: "Please select a hub" })} />

                <select
                  className="w-full h-10 px-3 py-2 bg-inherit border border-gray-400 rounded-md"
                  value={selectedHub}
                  onChange={(e) => handleHubChange(e.target.value)}
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
                        {hub?.hubName}
                      </option>
                    ))
                  )}
                </select>

                {errors.hubId && <p className="text-red-500 text-xs mt-1">{errors.hubId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="bg-inherit border border-gray-400"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="bg-inherit border border-gray-400"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting || createManagerMutation.isPending}
              >
                {isSubmitting || createManagerMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Link href="/hub-manager-list">
                <Button
                  type="button"
                  variant="outline"
                  className="text-white bg-[#432105] hover:bg-[#432105] hover:text-white border-none"
                >
                  Return to the list
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
