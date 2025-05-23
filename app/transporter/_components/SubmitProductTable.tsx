"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProductItem = {
  id: number;
  name: string;
  email: string;
  phone: string;
  product: string;
  hub: string;
  weight: string;
  measurement: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  time: string;
  date: string;
  price: string;
  status: "pending" | "accepted";
};

export default function SubmitProductTable() {
  const [productItems, setProductItems] = useState<ProductItem[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john-smith@example.com",
      phone: "+1 (555) 123-4567",
      product: "Magic Moments",
      hub: "Hub3",
      weight: "2291445",
      measurement: "2291445",
      receiverName: "John Smith",
      receiverEmail: "john-smith@example.com",
      receiverPhone: "+1 (555) 123-4567",
      time: "10:00PM",
      date: "2023-01-15",
      price: "$50.00",
      status: "pending",
    },
    {
      id: 2,
      name: "John Smith",
      email: "john-smith@example.com",
      phone: "+1 (555) 123-4567",
      product: "Magic Moments",
      hub: "Hub3",
      weight: "2291445",
      measurement: "2291445",
      receiverName: "John Smith",
      receiverEmail: "john-smith@example.com",
      receiverPhone: "+1 (555) 123-4567",
      time: "10:00PM",
      date: "2023-01-15",
      price: "$50.00",
      status: "pending",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john-smith@example.com",
      phone: "+1 (555) 123-4567",
      product: "Magic Moments",
      hub: "Hub3",
      weight: "2291445",
      measurement: "2291445",
      receiverName: "John Smith",
      receiverEmail: "john-smith@example.com",
      receiverPhone: "+1 (555) 123-4567",
      time: "10:00PM",
      date: "2023-01-15",
      price: "$50.00",
      status: "pending",
    },
    {
      id: 4,
      name: "John Smith",
      email: "john-smith@example.com",
      phone: "+1 (555) 123-4567",
      product: "Magic Moments",
      hub: "Hub3",
      weight: "2291445",
      measurement: "2291445",
      receiverName: "John Smith",
      receiverEmail: "john-smith@example.com",
      receiverPhone: "+1 (555) 123-4567",
      time: "10:00PM",
      date: "2023-01-15",
      price: "$50.00",
      status: "accepted",
    },
    {
      id: 5,
      name: "John Smith",
      email: "john-smith@example.com",
      phone: "+1 (555) 123-4567",
      product: "Magic Moments",
      hub: "Hub3",
      weight: "2291445",
      measurement: "2291445",
      receiverName: "John Smith",
      receiverEmail: "john-smith@example.com",
      receiverPhone: "+1 (555) 123-4567",
      time: "10:00PM",
      date: "2023-01-15",
      price: "$50.00",
      status: "accepted",
    },
    {
      id: 6,
      name: "John Smith",
      email: "john-smith@example.com",
      phone: "+1 (555) 123-4567",
      product: "Magic Moments",
      hub: "Hub3",
      weight: "2291445",
      measurement: "2291445",
      receiverName: "John Smith",
      receiverEmail: "john-smith@example.com",
      receiverPhone: "+1 (555) 123-4567",
      time: "10:00PM",
      date: "2023-01-15",
      price: "$50.00",
      status: "accepted",
    },
    {
      id: 7,
      name: "John Smith",
      email: "john-smith@example.com",
      phone: "+1 (555) 123-4567",
      product: "Magic Moments",
      hub: "Hub3",
      weight: "2291445",
      measurement: "2291445",
      receiverName: "John Smith",
      receiverEmail: "john-smith@example.com",
      receiverPhone: "+1 (555) 123-4567",
      time: "10:00PM",
      date: "2023-01-15",
      price: "$50.00",
      status: "accepted",
    },
  ]);

  const handleAccept = (id: number) => {
    setProductItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "accepted" } : item
      )
    );
  };

  return (
    <div className="border rounded-md overflow-hidden bg-[#e6f5f0]">
      <Table>
        <TableHeader className="bg-[#e6f5f0]">
          <TableRow>
            <TableHead className="text-center font-medium text-gray-600">
              Name
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Product Name
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Destination Hub
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Weight
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Measurement
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Receiver
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Time
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Price
            </TableHead>
            <TableHead className="text-center font-medium text-gray-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productItems.map((item) => (
            <TableRow
              key={item.id}
              className="border-b border-gray-200 bg-[#e6f5f0]"
            >
              <TableCell className="py-4">
                <div className="flex flex-col items-center">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500">{item.email}</span>
                  <span className="text-xs text-gray-500">{item.phone}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{item.product}</TableCell>
              <TableCell className="text-center">{item.hub}</TableCell>
              <TableCell className="text-center">{item.weight}</TableCell>
              <TableCell className="text-center">{item.measurement}</TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col items-center">
                  <span className="font-medium">{item.receiverName}</span>
                  <span className="text-xs text-gray-500">
                    {item.receiverEmail}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.receiverPhone}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col items-center">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{item.price}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-2 justify-center items-center">
                  {item.status === "pending" ? (
                    <>
                      <Button
                        onClick={() => handleAccept(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                        size="sm"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500 w-full"
                      size="sm"
                    >
                      Location
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
