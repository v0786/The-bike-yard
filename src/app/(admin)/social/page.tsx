export default function SocialPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Social Media</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm max-w-md">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Instagram</span>
            <span className="font-medium text-gray-400">Not configured</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Facebook</span>
            <span className="font-medium text-gray-400">Not configured</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>YouTube</span>
            <span className="font-medium text-gray-400">Not configured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
