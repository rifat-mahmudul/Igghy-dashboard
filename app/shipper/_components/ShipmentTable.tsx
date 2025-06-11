"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ShipmentTable() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedShipments, setDisplayedShipments] = useState<any[]>([]);

  const session = useSession();
  const token = session?.data?.accessToken;

  const queryClient = useQueryClient();

  const {
    data: allShipments,
    isLoading,
    // refetch,
  } = useQuery({
    // queryKey: ["shipments-data", searchTerm, token],
    queryKey: ["shipments-data"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hub-manager/shipper-requests?search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const shipments = allShipments?.data?.requests || [];

  // Calculate pagination values
  useEffect(() => {
    if (shipments.length > 0) {
      setTotalResults(shipments.length);
      setTotalPages(Math.ceil(shipments.length / resultsPerPage));

      // Update displayed shipments based on current page
      const startIndex = (currentPage - 1) * resultsPerPage;
      const endIndex = Math.min(startIndex + resultsPerPage, shipments.length);
      setDisplayedShipments(shipments.slice(startIndex, endIndex));
    } else {
      setTotalResults(0);
      setTotalPages(0);
      setDisplayedShipments([]);
      // setDisplayedShipments([]);
    }
  }, [shipments, currentPage, resultsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Calculate start and end result for display
  const startResult =
    totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handle status change
  const { mutateAsync } = useMutation({
    mutationKey: ["updateShipmentStatus"],
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
      queryClient.invalidateQueries({
        queryKey: ["shipments-data"],
      });
    },
  });

  const handleStatus = (status: string, id: string) => {
    mutateAsync({ status, id });
  };

  return (
    <div>
      <div className="bg-[#e6f5f0] p-4 rounded-lg mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by email..."
            className="pl-10 border-gray-200 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-[#e6f5f0]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-center">
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Product Name
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Weight
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Measurement
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Receiver
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Destination Hub
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Time
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading shipments...
                  </td>
                </tr>
              ) : displayedShipments.length === 0 ? (
                <tr key={"no-shipments"}>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No shipments found
                  </td>
                </tr>
              ) : (
                displayedShipments.map((shipment: any) => (
                  <tr key={shipment.requestId} className="text-center">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {shipment.shipper.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shipment.shipper.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shipment.shipper.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {shipment.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {shipment.weight}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {shipment.measurement}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {shipment.receiver.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shipment.receiver.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shipment.receiver.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {shipment.toHub}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {shipment.price}
                    </td>
                    <td className="px-4 py-3">
                      {shipment.status === "Pending Approval" && (
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() =>
                              handleStatus("approve", shipment?.requestId)
                            }
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() =>
                              handleStatus("reject", shipment?.requestId)
                            }
                            className="w-full bg-red-500 hover:bg-red-600 text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startResult}</span> to{" "}
              <span className="font-medium">{endResult}</span> of{" "}
              <span className="font-medium">{totalResults}</span> results
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-gray-200 bg-[#f5f9f7]"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {getPageNumbers().map((pageNumber, index) => {
                if (
                  pageNumber === "ellipsis-start" ||
                  pageNumber === "ellipsis-end"
                ) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={`page-${pageNumber}`}
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 rounded-md ${
                      currentPage === pageNumber
                        ? "border-0 bg-primary text-white"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => handlePageChange(pageNumber as number)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-gray-200 bg-[#f5f9f7]"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
