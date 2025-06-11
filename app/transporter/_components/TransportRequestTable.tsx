"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TransportRequestTable({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const session = useSession();
  const token = session?.data?.accessToken;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: transportRequests = [], refetch } = useQuery({
    queryKey: ["transportRequest", token, searchTerm],
    queryFn: async () => {
      if (!token) return [];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hub-manager/transport-requests?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  // Handle status change
  const { mutateAsync } = useMutation({
    mutationKey: ["update-transport-status"],
    mutationFn: async ({ status, id }: { status: string; id: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hub-manager/manage-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId: id,
            action: status,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Shipment status updated successfully");
      refetch();
    },
  });

  const allTransportItems = transportRequests?.data?.requests || [];

  // Pagination calculations
  const totalItems = allTransportItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allTransportItems.slice(startIndex, endIndex);

  const handleAccept = (status: string, id: string) => {
    mutateAsync({ status, id });
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page area, and last page with ellipsis
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Calculate display text
  const showingStart = totalItems === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, totalItems);

  // Render empty state without early return
  if (allTransportItems.length === 0) {
    return (
      <div className="border rounded-md overflow-hidden bg-[#e6f5f0] p-8">
        <div className="text-center">
          <div className="text-gray-500 text-lg font-medium mb-2">
            No Transport Requests Found
          </div>
          <div className="text-gray-400 text-sm">
            {searchTerm
              ? `No requests match your search for "${searchTerm}"`
              : "There are currently no transport requests to display."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border rounded-md overflow-hidden bg-[#e6f5f0]">
        <Table>
          <TableHeader className="bg-[#e6f5f0]">
            <TableRow>
              <TableHead className="text-center font-medium text-gray-600">
                Shipper
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Product Name
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Hub-sourced
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Weight
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Measurement
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Transporter
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Receiver
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Time
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Price
              </TableHead>
              <TableHead className="text-center font-medium text-gray-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item: any, i: any) => (
              <TableRow
                key={i}
                className="border-b border-gray-200 bg-[#e6f5f0]"
              >
                <TableCell className="py-4">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">
                      {item?.shipper.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.shipper.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.shipper.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {item.productName}
                </TableCell>
                <TableCell className="text-center">{item.toHub}</TableCell>
                <TableCell className="text-center">{item.weight}</TableCell>
                <TableCell className="text-center">
                  {item.measurement}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">
                      {item.transporter.name || "No Transporter Found"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.transporter.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.transporter.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{item.receiver.name}</span>
                    <span className="text-xs text-gray-500">
                      {item.receiver.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.receiver.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col items-center">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>{item.time}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell>
                  <div>
                    {item.status === "Pending Approval" && (
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() =>
                            handleAccept("approve", item?.requestId)
                          }
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() =>
                            handleAccept("reject", item?.requestId)
                          }
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            Showing {showingStart} to {showingEnd} of {totalItems} results
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 border-gray-200"
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 border-none"
                  >
                    ...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      currentPage === page
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-gray-200"
                    }`}
                    onClick={() => goToPage(page as number)}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 border-gray-200"
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
