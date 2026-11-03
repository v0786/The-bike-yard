import { prisma } from "@/lib/prisma"
import { formatInr } from "@/lib/currency"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"

export default function CustomersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button>Add Customer</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>+91 98765 43210</TableCell>
              <TableCell>rahul@example.com</TableCell>
              <TableCell>Thane</TableCell>
              <TableCell>
                <StatusChip status="active" />
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
