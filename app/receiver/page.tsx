import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold text-gray-800">Receiver</h1>
      <p className="text-gray-600 mt-1 mb-6">
        Welcome back to your admin panel
      </p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-6 bg-[#e6f5f0] rounded-lg p-4">
          <div className="relative flex-1 mr-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-md border border-gray-200 text-sm font-medium">
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-[#e6f5f0]">
          <table className="min-w-full bg-[#e6f5f0]">
            <thead>
              <tr className="text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Departure Hub</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Measurement</th>
                <th className="px-4 py-3">Shipper</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-300 text-sm text-center bg-[#e6f5f0]`}
                >
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium">John Smith</div>
                      <div className="text-xs text-gray-500">
                        john.smith@example.com
                      </div>
                      <div className="text-xs text-gray-500">
                        +1 (555) 123-4567
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">Magic Moments</td>
                  <td className="px-4 py-4">Hub3</td>
                  <td className="px-4 py-4">2291445</td>
                  <td className="px-4 py-4">2291445</td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium">John Smith</div>
                      <div className="text-xs text-gray-500">
                        john.smith@example.com
                      </div>
                      <div className="text-xs text-gray-500">
                        +1 (555) 123-4567
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div>2023-01-15</div>
                      <div>10:00PM</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">$50.00</td>
                  <td className="px-4 py-4">
                    <button className="px-4 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors">
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-gray-600">Showing 1 to 10 of 50 results</div>
          <div className="flex items-center space-x-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#e0f0e9] text-gray-600 hover:bg-[#d0e8e0]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-green-500 text-white">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
              ...
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
              17
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#e0f0e9] text-gray-600 hover:bg-[#d0e8e0]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
