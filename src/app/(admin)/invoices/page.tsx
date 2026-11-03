import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"

export default function InvoicesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button>Issue Invoice</Button>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Sale</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>TBY/2026/0001</TableCell>
              <TableCell>TBY-2026-0001</TableCell>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>₹8,96,000</TableCell>
              <TableCell><StatusChip status="issued" /></TableCell>
              <TableCell><Button size="sm" variant="outline">Download PDF</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
