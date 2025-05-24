"use client";
import ShipmentTable from "./_components/ShipmentTable";
import { useSession } from "next-auth/react";

export default function ShipperAdminPanel() {
  
  const session = useSession();
  const user = session;
  console.log(session)
  return (
    
    <div className="space-y-6 mt-20">
      <div >
        <h1 className="text-2xl font-bold text-gray-900">Shipper</h1>
        <p className="text-gray-600">Welcome back to your admin panel</p>
      </div>

      <ShipmentTable />
    </div>
  );
}
