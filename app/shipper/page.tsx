"use client";
import ShipmentTable from "./_components/ShipmentTable";

export default function ShipperAdminPanel() {

  return (
    
    <div className="space-y-6 mt-20">
      <div >
        <h1 className="text-3xl font-bold text-gray-800">Shipper</h1>
        <p className="text-gray-600">Welcome back to your admin panel</p>
      </div>

      <ShipmentTable />
    </div>
  );
}
