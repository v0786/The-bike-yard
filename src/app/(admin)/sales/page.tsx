import { prisma } from "@/lib/prisma"
import { formatInr } from "@/lib/currency"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"

export default function SalesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <Button>Record Sale</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sale #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Bike</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>TBY-2026-0001</TableCell>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>Hero Splendor</TableCell>
              <TableCell>{formatInr(8900000)}</TableCell>
              <TableCell>
                <StatusChip status="paid" />
              </TableCell>
              <TableCell>03 Nov 2026</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View Invoice</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
