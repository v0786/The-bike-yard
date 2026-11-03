import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusChip } from '@/components/ui/status-chip';

export default function InsurancePage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Insurance Applications</h1>
        <Button>New Application</Button>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Policy Type</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INS-001</TableCell>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>ICICI Lombard</TableCell>
              <TableCell>Comprehensive</TableCell>
              <TableCell>₹25,000</TableCell>
              <TableCell>
                <StatusChip status="submitted" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
