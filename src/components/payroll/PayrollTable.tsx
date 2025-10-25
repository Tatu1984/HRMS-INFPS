'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { PayslipView } from './PayslipView';
import { Eye } from 'lucide-react';

interface PayrollTableProps {
  payrolls: Array<{
    id: string;
    employeeId: string;
    month: number;
    year: number;
    daysPresent: number;
    daysAbsent: number;
    basicPayable: number;
    variablePayable: number;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    status: string;
    employee: {
      employeeId: string;
      name: string;
      department: string;
    };
  }>;
}

export function PayrollTable({ payrolls }: PayrollTableProps) {
  const [selectedPayroll, setSelectedPayroll] = useState<{ id: string; employeeId: string } | null>(null);

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
      APPROVED: 'bg-blue-100 text-blue-700',
      PAID: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleRowClick = (payrollId: string, employeeId: string) => {
    setSelectedPayroll({ id: payrollId, employeeId });
  };

  if (payrolls.length === 0) {
    return <p className="text-gray-600">No payroll records yet. Click "Calculate Payroll" to generate.</p>;
  }

  return (
    <>
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
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(payroll.id, payroll.employeeId)}
              >
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
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(payroll.id, payroll.employeeId);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayroll && (
        <PayslipView
          payrollId={selectedPayroll.id}
          employeeId={selectedPayroll.employeeId}
          open={!!selectedPayroll}
          onClose={() => setSelectedPayroll(null)}
        />
      )}
    </>
  );
}
