export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Business Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Business Name</span>
            <span className="font-medium">The Bike Yard</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Address</span>
            <span className="font-medium">Khopat, Thane, Maharashtra, India</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>GSTIN</span>
            <span className="font-medium text-gray-400">Not configured</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Currency</span>
            <span className="font-medium">INR</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Date Format</span>
            <span className="font-medium">DD/MM/YYYY</span>
          </div>
        </div>
      </div>
    </div>
  )
}
