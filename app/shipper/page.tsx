import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShipmentTable from "./_components/ShipmentTable";

export default function ShipperAdminPanel() {
  return (
    <div className="space-y-6 mt-20">
      <div >
        <h1 className="text-2xl font-bold text-gray-900">Shipper</h1>
        <p className="text-gray-600">Welcome back to your admin panel</p>
      </div>

      <div className="flex items-center justify-between gap-4 bg-[#e6f5f0] p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by email..."
            className="pl-10 border-gray-200 bg-white"
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-200"
        >
          Filter
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              d="M4.5 6L7.5 9L10.5 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Button>
      </div>

      <ShipmentTable />
    </div>
  );
}
