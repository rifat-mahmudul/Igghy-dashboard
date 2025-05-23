"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TransportRequestTable from "./TransportRequestTable";
import SubmitProductTable from "./SubmitProductTable";

export default function TransporterTabs() {
  const [activeTab, setActiveTab] = useState<"transport" | "product">(
    "transport"
  );

  return (
    <>
      <div className="grid grid-cols-2 mb-4 rounded-md overflow-hidden border border-gray-200">
        <button
          className={`${
            activeTab === "transport"
              ? "bg-emerald-600 text-white hover:text-white border-green-500"
              : "bg-[#e6f5f0] text-gray-800 border-green-500"
          } rounded-none h-12`}
          onClick={() => setActiveTab("transport")}
        >
          Transport Request
        </button>
        <button
         className={`${
            activeTab === "product"
              ? "bg-emerald-600 text-white hover:text-white border-green-500"
              : "bg-[#e6f5f0] text-gray-800 border-green-500"
          } rounded-none h-12`}
          onClick={() => setActiveTab("product")}
        >
          Submit Product
        </button>
      </div>

      {activeTab === "transport" ? (
        <TransportRequestTable />
      ) : (
        <SubmitProductTable />
      )}

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>Showing 1 to 10 of 50 results</div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-emerald-600 text-white border-emerald-600"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-gray-200"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-gray-200"
          >
            3
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 border-none">
            ...
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-gray-200"
          >
            17
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0 border-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
