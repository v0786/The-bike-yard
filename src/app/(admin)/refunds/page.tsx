import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"

export default function RefundsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Refunds</h1>
        <Button>Request Refund</Button>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Refund #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>REF-001</TableCell>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>₹10,000</TableCell>
              <TableCell>Booking cancelled</TableCell>
              <TableCell><StatusChip status="pending" /></TableCell>
              <TableCell><Button size="sm" variant="outline">View</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
