import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TransporterTabs from "./_components/TransporterTabs";

export default function TransporterAdmin() {
  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mt-4">Transporter</h1>
      <p className="text-gray-600 mb-6">Welcome back to your admin panel</p>

      <div className="flex items-center gap-4 mb-4 bg-[#e6f5f0] p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by email..."
            className="pl-10 border-gray-200 bg-white h-12 rounded-md w-full"
          />
        </div>
        <Button
          variant="outline"
          className="h-12 px-4 border-gray-200 bg-white"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <TransporterTabs />
    </div>
  );
}
