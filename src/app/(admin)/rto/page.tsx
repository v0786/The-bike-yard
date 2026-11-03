import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"

export default function RTOPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">RTO Registrations</h1>
        <Button>New Application</Button>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle Class</TableHead>
              <TableHead>Registration #</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>RTO-001</TableCell>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>Two Wheeler</TableCell>
              <TableCell>—</TableCell>
              <TableCell><StatusChip status="submitted" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
