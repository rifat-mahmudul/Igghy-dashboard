"use client"

import TransportRequestTable from "./TransportRequestTable"
import SubmitProductTable from "./SubmitProductTable"

interface TransporterTabsProps {
  activeTab: string
  setActiveTab: (tab: "transport" | "product") => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function TransporterTabs({ activeTab, setActiveTab, searchTerm }: TransporterTabsProps) {
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

      {/* Render both components but hide the inactive one */}
      <div style={{ display: activeTab === "transport" ? "block" : "none" }}>
        <TransportRequestTable searchTerm={searchTerm} />
      </div>
      <div style={{ display: activeTab === "product" ? "block" : "none" }}>
        <SubmitProductTable searchTerm={searchTerm} />
      </div>
    </>
  )
}
