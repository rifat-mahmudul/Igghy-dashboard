"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const TopHubLists = () => {
  const [monthFilter, setMonthFilter] = useState("05-2025");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Get the current month and year for the dropdown options
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);

      const monthYear = `${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${date.getFullYear()}`;
      const displayName = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      options.push({ value: monthYear, label: displayName });
    }

    return options;
  };

  const monthOptions = getMonthOptions();

  const session = useSession();

  // Token for API authentication
  const token = session?.data?.accessToken;

  // Fetch data from API
  const {
    data: tableData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tableData", monthFilter, page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/top-hub-stats?month=${monthFilter}&page=${page}&limit=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await res.json();

      if (!responseData.success) {
        throw new Error(responseData.message || "Failed to fetch data");
      }

      return responseData;
    },
  });

  // Handle month filter change
  const handleMonthChange = (value: any) => {
    setMonthFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  // Calculate total pages - since API doesn't provide this, we'll estimate based on data length
  const totalItems = tableData?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Top Hub Lists</CardTitle>
        <Select value={monthFilter} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px] h-8 text-xs bg-inherit border-none">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="mt-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : isError ? (
          <div className="text-center py-4 text-red-500">
            Error loading data. Please try again.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#b0e0cf] font-semibold">
                  <tr className="text-center">
                    <th className="p-3 text-xs font-medium">
                      Top Receiver Hub
                    </th>
                    <th className="p-3 text-xs font-medium">Total Received</th>
                    <th className="p-3 text-xs font-medium">Top Sender Hub</th>
                    <th className="p-3 text-xs font-medium">Total Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.data?.map((row: any, i: any) => (
                    <tr
                      key={i}
                      className="text-center bg-[#d9f0e8] border-b border-gray-300"
                    >
                      <td className="p-3 text-xs">
                        {row.topReceiverHub || "N/A"}
                      </td>
                      <td className="p-3 text-xs">{row.totalReceived || 0}</td>
                      <td className="p-3 text-xs">
                        {row.topSenderHub || "N/A"}
                      </td>
                      <td className="p-3 text-xs">{row.totalSent || 0}</td>
                    </tr>
                  ))}

                  {/* Show empty rows if data is less than page size */}
                  {!tableData?.data?.length && (
                    <tr className="text-center bg-[#d9f0e8]">
                      <td colSpan={4} className="p-3 text-xs">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                className={`px-3 py-1 rounded text-xs ${
                  page <= 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#b0e0cf] text-gray-700 hover:bg-[#9ed6c1]"
                }`}
              >
                Previous
              </button>

              <span className="text-xs">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page >= totalPages}
                className={`px-3 py-1 rounded text-xs ${
                  page >= totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#b0e0cf] text-gray-700 hover:bg-[#9ed6c1]"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </CardContent>
    </div>
  );
};

export default TopHubLists;
