"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import SearchInput from "@/components/search-input"
import Pagination from "@/components/pagination"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Sample data
const hubs = Array.from({ length: 10 }, (_, i) => ({
  name: `Hub${i + 1}`,
  assignedManager: "Jane Cooper",
  assignedDate: "26/04/25",
  email: "info@gmail.com",
  phone: "+12300000",
}))

export default function HubList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddHubOpen, setIsAddHubOpen] = useState(false)
  const [newHubName, setNewHubName] = useState("")

  const handleAddHub = () => {
    // In a real app, you would add the hub to your database
    console.log("Adding hub:", newHubName)
    setNewHubName("")
    setIsAddHubOpen(false)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-emerald-50 border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Hub List
          </CardTitle>
          <Dialog open={isAddHubOpen} onOpenChange={setIsAddHubOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Add <span className="ml-1">+</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white p-0 border-none">
              <div className="bg-emerald-50 p-6 rounded-t-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-medium">Add New Hub</DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hub-name">Hub Name</Label>
                    <Input
                      id="hub-name"
                      placeholder="Hub name"
                      value={newHubName}
                      onChange={(e) => setNewHubName(e.target.value)}
                    />
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto" onClick={handleAddHub}>
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <SearchInput placeholder="Search to filter..." onChange={setSearchQuery} />
          </div>

          <div className="rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-emerald-100 text-emerald-800">
                <tr>
                  <th className="text-left p-3 text-xs font-medium">Hub Name</th>
                  <th className="text-left p-3 text-xs font-medium">Assigned Manager</th>
                  <th className="text-left p-3 text-xs font-medium">Assigned Date</th>
                  <th className="text-left p-3 text-xs font-medium">Email</th>
                  <th className="text-left p-3 text-xs font-medium">Phone</th>
                </tr>
              </thead>
              <tbody>
                {hubs.map((hub, i) => (
                  <tr key={i} className="bg-white even:bg-emerald-50">
                    <td className="p-3 text-xs">{hub.name}</td>
                    <td className="p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          <Image src="/diverse-group.png" alt={hub.assignedManager} width={24} height={24} />
                        </div>
                        {hub.assignedManager}
                      </div>
                    </td>
                    <td className="p-3 text-xs">{hub.assignedDate}</td>
                    <td className="p-3 text-xs">{hub.email}</td>
                    <td className="p-3 text-xs">{hub.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between text-xs text-gray-500">
            <div>Showing 1 to 10 of 20 results</div>
            <Pagination currentPage={currentPage} totalPages={17} onPageChange={setCurrentPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
