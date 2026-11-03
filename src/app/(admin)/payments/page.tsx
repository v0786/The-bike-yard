import { prisma } from "@/lib/prisma"
import { formatInr } from "@/lib/currency"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"

export default function PaymentsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Button>Record Payment</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>PAY-001</TableCell>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>{formatInr(500000)}</TableCell>
              <TableCell>UPI</TableCell>
              <TableCell>
                <StatusChip status="completed" />
              </TableCell>
              <TableCell>03 Nov 2026</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
