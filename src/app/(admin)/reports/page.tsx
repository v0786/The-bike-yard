import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { StatusChip } from '@/components/ui/status-chip';

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Total Sales</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Total Revenue</span>
              <span className="font-medium">₹0</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Pending Payments</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Stock Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Available Stock</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Sold Stock</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Pending Bookings</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sale #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
              <TableCell>
                <StatusChip status="pending" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
