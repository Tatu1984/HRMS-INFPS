import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { formatCurrency, getMonthName } from '@/lib/utils';

export default async function EmployeePayslipsPage() {
  const session = await getSession();
  const payroll = await prisma.payroll.findMany({
    where: {
      employeeId: session!.employeeId!,
    },
    orderBy: [
      { year: 'desc' },
      { month: 'desc' },
    ],
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payslips</h1>
        <p className="text-gray-600">View and download your salary slips</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {payroll.map((pay) => (
          <Card key={pay.id}>
            <CardHeader>
              <CardTitle>{getMonthName(pay.month)} {pay.year}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Salary:</span>
                  <span className="font-semibold">{formatCurrency(pay.baseSalary)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deductions:</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(pay.deductions?.total || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bonuses:</span>
                  <span className="font-semibold text-green-600">
                    + {formatCurrency(pay.bonuses?.total || 0)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Net Salary:</span>
                  <span className="text-blue-600">{formatCurrency(pay.netSalary)}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Payslip
              </Button>
            </CardContent>
          </Card>
        ))}
        {payroll.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No payslips available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}