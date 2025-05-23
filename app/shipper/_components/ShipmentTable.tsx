import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample data based on the image
const shipments = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "10m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "pending", // pending or completed
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "20m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "pending",
  },
  {
    id: 3,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "20m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "pending",
  },
  {
    id: 4,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "20m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "pending",
  },
  {
    id: 5,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "20m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "completed",
  },
  {
    id: 6,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "20m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "completed",
  },
  {
    id: 7,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "20m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "completed",
  },
  {
    id: 8,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1(555) 123-4567",
    product: "Magic Moments",
    weight: "5kg",
    measurement: "20m",
    receiver: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1(555) 123-4567",
    },
    departureHub: "Hub3",
    time: "2023-01-15 10:00PM",
    price: "$50.00",
    status: "completed",
  },
]

export default function ShipmentTable() {
  // Pagination state
  const totalResults = 50
  const currentPage = 1
  const resultsPerPage = 10
  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  return (
    <div className="overflow-hidden rounded-lg bg-[#e6f5f0]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-center">
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Product Name</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Weight</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Measurement</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Receiver</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Departure Hub</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Time</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="text-center">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{shipment.name}</div>
                  <div className="text-xs text-gray-500">{shipment.email}</div>
                  <div className="text-xs text-gray-500">{shipment.phone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{shipment.product}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{shipment.weight}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{shipment.measurement}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{shipment.receiver.name}</div>
                  <div className="text-xs text-gray-500">{shipment.receiver.email}</div>
                  <div className="text-xs text-gray-500">{shipment.receiver.phone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{shipment.departureHub}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{shipment.time}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{shipment.price}</td>
                <td className="px-4 py-3">
                  {shipment.status === "pending" ? (
                    <div className="flex flex-col gap-2">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Accept</Button>
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Cancel</Button>
                    </div>
                  ) : (
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Delete</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination directly in the ShipmentTable component */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startResult}</span> to{" "}
            <span className="font-medium">{endResult}</span> of <span className="font-medium">{totalResults}</span>{" "}
            results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md border-gray-200 bg-[#f5f9f7]"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <Button variant="outline" size="sm" className="h-8 w-8 rounded-md border-0 bg-primary text-white">
              1
            </Button>

            <Button variant="outline" size="sm" className="h-8 w-8 rounded-md border-gray-200 bg-white">
              2
            </Button>

            <Button variant="outline" size="sm" className="h-8 w-8 rounded-md border-gray-200 bg-white">
              3
            </Button>

            <span className="px-2 text-gray-500">...</span>

            <Button variant="outline" size="sm" className="h-8 w-8 rounded-md border-gray-200 bg-white">
              17
            </Button>

            <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border-gray-200 bg-[#f5f9f7]">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
