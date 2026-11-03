export default function StaffDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Assigned Leads</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Pending Bookings</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Today's Tasks</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>
    </div>
  );
}
