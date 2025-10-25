'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Download, Printer, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PayrollData {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  workingDays: number;
  daysPresent: number;
  daysAbsent: number;
  basicSalary: number;
  variablePay: number;
  salesTarget: number | null;
  targetAchieved: number | null;
  basicPayable: number;
  variablePayable: number;
  grossSalary: number;
  professionalTax: number;
  tds: number;
  penalties: number;
  advancePayment: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  employee: {
    employeeId: string;
    name: string;
    department: string;
    designation?: string;
  };
}

interface PayslipViewProps {
  payrollId: string;
  employeeId: string;
  open: boolean;
  onClose: () => void;
}

export function PayslipView({ payrollId, employeeId, open, onClose }: PayslipViewProps) {
  const [currentPayroll, setCurrentPayroll] = useState<PayrollData | null>(null);
  const [payrollHistory, setPayrollHistory] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (open && payrollId && employeeId) {
      fetchPayrollData();
    }
  }, [open, payrollId, employeeId]);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      // Fetch current payroll
      const currentResponse = await fetch(`/api/payroll/${payrollId}`);
      if (currentResponse.ok) {
        const current = await currentResponse.json();
        setCurrentPayroll(current);
      }

      // Fetch payroll history for this employee
      const historyResponse = await fetch(`/api/payroll?employeeId=${employeeId}`);
      if (historyResponse.ok) {
        const history = await historyResponse.json();
        setPayrollHistory(history);
        // Find current payroll index in history
        const index = history.findIndex((p: PayrollData) => p.id === payrollId);
        setCurrentIndex(index >= 0 ? index : 0);
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigatePayslip = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < payrollHistory.length) {
      setCurrentIndex(newIndex);
      setCurrentPayroll(payrollHistory[newIndex]);
    }
  };

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

  if (!currentPayroll) {
    return null;
  }

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < payrollHistory.length - 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Payslip - {getMonthName(currentPayroll.month)} {currentPayroll.year}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigatePayslip('prev')}
                disabled={!hasPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {payrollHistory.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigatePayslip('next')}
                disabled={!hasNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Header Section */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{currentPayroll.employee.name}</h2>
                <p className="text-gray-600">Employee ID: {currentPayroll.employee.employeeId}</p>
                <p className="text-gray-600">Department: {currentPayroll.employee.department}</p>
                {currentPayroll.employee.designation && (
                  <p className="text-gray-600">Designation: {currentPayroll.employee.designation}</p>
                )}
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(currentPayroll.status)} size="lg">
                  {currentPayroll.status}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Pay Period: {getMonthName(currentPayroll.month)} {currentPayroll.year}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentPayroll.workingDays}</div>
                  <div className="text-sm text-gray-600">Working Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentPayroll.daysPresent}</div>
                  <div className="text-sm text-gray-600">Days Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{currentPayroll.daysAbsent}</div>
                  <div className="text-sm text-gray-600">Days Absent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 text-sm font-semibold text-gray-600">Component</th>
                    <th className="text-right py-2 text-sm font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2">Basic Salary</td>
                    <td className="text-right py-2 font-semibold">{formatCurrency(currentPayroll.basicPayable)}</td>
                  </tr>
                  {currentPayroll.variablePay > 0 && (
                    <>
                      <tr>
                        <td className="py-2">
                          Variable Pay
                          {currentPayroll.salesTarget && (
                            <div className="text-xs text-gray-500">
                              Target: {formatCurrency(currentPayroll.salesTarget)} |
                              Achieved: {formatCurrency(currentPayroll.targetAchieved || 0)}
                              {currentPayroll.salesTarget > 0 && (
                                <> ({((currentPayroll.targetAchieved || 0) / currentPayroll.salesTarget * 100).toFixed(1)}%)</>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="text-right py-2 font-semibold text-green-600">
                          {formatCurrency(currentPayroll.variablePayable)}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr className="bg-gray-50">
                    <td className="py-3 font-semibold">Gross Salary</td>
                    <td className="text-right py-3 font-bold text-lg">{formatCurrency(currentPayroll.grossSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 text-sm font-semibold text-gray-600">Component</th>
                    <th className="text-right py-2 text-sm font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2">Professional Tax</td>
                    <td className="text-right py-2 text-red-600">{formatCurrency(currentPayroll.professionalTax)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">TDS</td>
                    <td className="text-right py-2 text-red-600">{formatCurrency(currentPayroll.tds)}</td>
                  </tr>
                  {currentPayroll.penalties > 0 && (
                    <tr>
                      <td className="py-2">Penalties</td>
                      <td className="text-right py-2 text-red-600">{formatCurrency(currentPayroll.penalties)}</td>
                    </tr>
                  )}
                  {currentPayroll.advancePayment > 0 && (
                    <tr>
                      <td className="py-2">Advance Payment</td>
                      <td className="text-right py-2 text-red-600">{formatCurrency(currentPayroll.advancePayment)}</td>
                    </tr>
                  )}
                  {currentPayroll.otherDeductions > 0 && (
                    <tr>
                      <td className="py-2">Other Deductions</td>
                      <td className="text-right py-2 text-red-600">{formatCurrency(currentPayroll.otherDeductions)}</td>
                    </tr>
                  )}
                  <tr className="bg-gray-50">
                    <td className="py-3 font-semibold">Total Deductions</td>
                    <td className="text-right py-3 font-bold text-red-600">{formatCurrency(currentPayroll.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Net Pay */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Net Salary</div>
                  <div className="text-4xl font-bold text-green-600">
                    {formatCurrency(currentPayroll.netSalary)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">In Words</div>
                  <div className="text-sm font-semibold text-gray-700 max-w-xs">
                    {/* TODO: Convert number to words */}
                    Rupees {currentPayroll.netSalary.toFixed(2)} Only
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
