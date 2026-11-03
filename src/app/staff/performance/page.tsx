export default function StaffPerformancePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Performance</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm max-w-md">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Sales This Month</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Revenue</span>
            <span className="font-medium">₹0</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Pending Follow-ups</span>
            <span className="font-medium">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
