import { prisma } from '@/lib/prisma';
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

export default function StockUnitsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Stock Units</h1>
        <Button>Stock Inward</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chassis #</TableHead>
              <TableHead>Engine #</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Colour</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Purchase Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>ME4JC654K98765432</TableCell>
              <TableCell>JC65E98765432</TableCell>
              <TableCell>Hero Splendor</TableCell>
              <TableCell>Black</TableCell>
              <TableCell>
                <StatusChip status="available" />
              </TableCell>
              <TableCell>₹6,50,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
