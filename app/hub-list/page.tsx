"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchInput from "@/components/search-input";
import Pagination from "@/components/pagination";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

// Sample data
const hubs = Array.from({ length: 10 }, (_, i) => ({
  name: `Hub${i + 1}`,
  assignedManager: "Jane Cooper",
  assignedDate: "26/04/25",
  email: "info@gmail.com",
  phone: "+12300000",
}));

// API token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWI0ZmI4Yzc3NWFlNzJjMmIzZjg3MyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0Nzg4OTM2MSwiZXhwIjoxNzQ4NDk0MTYxfQ.xi_W8IawPu6valGiazj4lMs0rV_JuC5QbZzPTemEqRE";

// Form type
type HubFormData = {
  hubName: string;
  lat: string;
  lng: string;
};

export default function HubList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddHubOpen, setIsAddHubOpen] = useState(false);

  const queryClient = useQueryClient();

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
  });

  // Create hub mutation
  const createHubMutation = useMutation({
    mutationFn: async (data: HubFormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/hubs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hubName: data.hubName,
            coordinates: {
              lat: Number.parseFloat(data.lat),
              lng: Number.parseFloat(data.lng),
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create hub");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch the hubs list
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      toast({
        title: "Success",
        description: "Hub created successfully",
        variant: "default",
      });
      reset();
      setIsAddHubOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create hub",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: HubFormData) => {
    createHubMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <CardHeader className="flex flex-row items-center justify-between py-3 mb-5 bg-[#d9f0e8] rounded-md">
        <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <Image src={"hub-flag.png"} alt="hub flag" width={30} height={30} />
          Hub List
        </CardTitle>
        <Dialog
          open={isAddHubOpen}
          onOpenChange={(open) => {
            setIsAddHubOpen(open);
            if (!open) reset();
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
                <DialogTitle className="text-2xl font-bold">
                  Add New Hub
                </DialogTitle>
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
                  {errors.hubName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.hubName.message}
                    </p>
                  )}
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
                          value: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,7})?$/,
                          message: "Please enter a valid latitude",
                        },
                      })}
                    />
                    {errors.lat && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lat.message}
                      </p>
                    )}
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
                          value:
                            /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,7})?$/,
                          message: "Please enter a valid longitude",
                        },
                      })}
                    />
                    {errors.lng && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lng.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                  disabled={isSubmitting || createHubMutation.isPending}
                >
                  {isSubmitting || createHubMutation.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <div className="p-4 bg-[#d9f0e8] rounded-md">
        <SearchInput
          placeholder="Search to filter..."
          onChange={setSearchQuery}
        />
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
                {hubs.map((hub, i) => (
                  <tr className="text-center border-b border-gray-300" key={i}>
                    <td className="p-3 text-xs">{hub.name}</td>
                    <td className="p-3 text-xs">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          <Image
                            src="/diverse-group.png"
                            alt={hub.assignedManager}
                            width={24}
                            height={24}
                          />
                        </div>
                        {hub.assignedManager}
                      </div>
                    </td>
                    <td className="p-3 text-xs">{hub.assignedDate}</td>
                    <td className="p-3 text-xs">{hub.email}</td>
                    <td className="p-3 text-xs">{hub.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between text-xs text-gray-500">
            <div>Showing 1 to 10 of 20 results</div>
            <Pagination
              currentPage={currentPage}
              totalPages={17}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
