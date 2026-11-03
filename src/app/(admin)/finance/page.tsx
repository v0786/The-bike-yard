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

export default function FinancePage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Finance Applications</h1>
        <Button>New Application</Button>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Lender</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>FIN-001</TableCell>
              <TableCell>Rahul Sharma</TableCell>
              <TableCell>HDFC Bank</TableCell>
              <TableCell>₹5,00,000</TableCell>
              <TableCell>
                <StatusChip status="submitted" />
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
