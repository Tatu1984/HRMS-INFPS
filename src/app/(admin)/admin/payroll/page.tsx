import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PayrollDialog } from '@/components/forms/payroll-dialog';

export default async function PayrollPage() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      employeeId: true,
      name: true,
      salary: true,
      department: true,
    },
  });

  const payrolls = await prisma.payroll.findMany({
    include: {
      employee: {
        select: {
          employeeId: true,
          name: true,
          department: true,
        },
      },
    },
    orderBy: [
      { year: 'desc' },
      { month: 'desc' },
    ],
  });

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PAID: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll</h1>
          <p className="text-gray-600">Manage employee salaries and payroll</p>
        </div>
        <PayrollDialog employees={employees} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
        </CardHeader>
        <CardContent>
          {payrolls.length === 0 ? (
            <p className="text-gray-600">No payroll records yet. Click "Calculate Payroll" to generate.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Period</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Days</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Basic</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Variable</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Gross</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Deductions</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Net Salary</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payrolls.map((payroll) => (
                    <tr key={payroll.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{payroll.employee.name}</div>
                          <div className="text-xs text-gray-500">{payroll.employee.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getMonthName(payroll.month)} {payroll.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <div className="text-xs">
                          <div className="text-green-600 font-semibold">{payroll.daysPresent}P</div>
                          <div className="text-red-600">{payroll.daysAbsent}A</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(payroll.basicPayable)}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(payroll.variablePayable)}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(payroll.grossSalary)}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(payroll.totalDeductions)}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">{formatCurrency(payroll.netSalary)}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className={getStatusColor(payroll.status)}>
                          {payroll.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}