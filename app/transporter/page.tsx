"use client";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TransporterTabs from "./_components/TransporterTabs";
import { useState } from "react";

export default function TransporterAdmin() {
  const [searchTerm, setSearchTerm] = useState("");

  const [activeTab, setActiveTab] = useState<"transport" | "product">(
    "transport"
  );

  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold text-gray-800">Transporter</h1>
      <p className="text-gray-600">Welcome back to your admin panel</p>

      <div className="mb-4 bg-[#e6f5f0] p-4 rounded-lg mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by email..."
            className="pl-10 border-gray-200 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <TransporterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
