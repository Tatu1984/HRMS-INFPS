'use client';

import { formatCurrency } from '@/lib/utils';

interface PayslipPrintViewProps {
  payroll: {
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
  };
}

export function PayslipPrintView({ payroll }: PayslipPrintViewProps) {
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  // Calculate derived values (these should ideally come from settings)
  const hra = payroll.basicPayable * 0.4; // 40% HRA
  const conveyance = 1600; // Fixed conveyance
  const medicalAllowance = 1250; // Fixed medical allowance
  const specialAllowance = payroll.basicPayable * 0.1; // 10% special allowance

  const pf = payroll.basicPayable * 0.12; // 12% PF
  const esi = payroll.grossSalary * 0.0075; // 0.75% ESI

  // Calculate totals
  const totalEarnings = payroll.basicPayable + hra + conveyance + medicalAllowance + specialAllowance + payroll.variablePayable;
  const totalDeductions = pf + esi + payroll.professionalTax + payroll.tds + payroll.penalties + payroll.advancePayment + payroll.otherDeductions;
  const netPay = totalEarnings - totalDeductions;

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:p-0" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <div className="text-2xl font-bold mb-2">SALARY SLIP</div>
        <div className="text-lg">For the month of {getMonthName(payroll.month)} {payroll.year}</div>
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-40">Employee Name:</span>
            <span>{payroll.employee.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Employee ID:</span>
            <span>{payroll.employee.employeeId}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Designation:</span>
            <span>{payroll.employee.designation || '-'}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-40">Department:</span>
            <span>{payroll.employee.department}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Pay Period:</span>
            <span>{getMonthName(payroll.month)} {payroll.year}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Payment Date:</span>
            <span>{new Date().toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="mb-6 border border-gray-300">
        <div className="bg-gray-200 px-4 py-2 font-semibold border-b border-gray-300">
          ATTENDANCE SUMMARY
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          <div>
            <div className="text-sm text-gray-600">Total Working Days</div>
            <div className="font-semibold text-lg">{payroll.workingDays}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Days Present</div>
            <div className="font-semibold text-lg text-green-600">{payroll.daysPresent}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Days Absent</div>
            <div className="font-semibold text-lg text-red-600">{payroll.daysAbsent}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">LOP Days</div>
            <div className="font-semibold text-lg text-orange-600">{payroll.daysAbsent}</div>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions Table */}
      <div className="border border-gray-300 mb-6">
        <div className="grid grid-cols-2">
          {/* Earnings Column */}
          <div className="border-r border-gray-300">
            <div className="bg-gray-200 px-4 py-2 font-semibold border-b border-gray-300">
              EARNINGS
            </div>
            <div>
              <table className="w-full">
                <thead className="border-b border-gray-300">
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm">Component</th>
                    <th className="px-4 py-2 text-right text-sm">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">Basic Salary</td>
                    <td className="px-4 py-2 text-right text-sm">{payroll.basicPayable.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">HRA (40%)</td>
                    <td className="px-4 py-2 text-right text-sm">{hra.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">Conveyance Allowance</td>
                    <td className="px-4 py-2 text-right text-sm">{conveyance.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">Medical Allowance</td>
                    <td className="px-4 py-2 text-right text-sm">{medicalAllowance.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">Special Allowance</td>
                    <td className="px-4 py-2 text-right text-sm">{specialAllowance.toFixed(2)}</td>
                  </tr>
                  {payroll.variablePayable > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">Variable Pay / Incentive</td>
                      <td className="px-4 py-2 text-right text-sm">{payroll.variablePayable.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-3 text-sm">Total Earnings (A)</td>
                    <td className="px-4 py-3 text-right text-sm">{totalEarnings.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions Column */}
          <div>
            <div className="bg-gray-200 px-4 py-2 font-semibold border-b border-gray-300">
              DEDUCTIONS
            </div>
            <div>
              <table className="w-full">
                <thead className="border-b border-gray-300">
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm">Component</th>
                    <th className="px-4 py-2 text-right text-sm">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">Provident Fund (PF)</td>
                    <td className="px-4 py-2 text-right text-sm">{pf.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">ESI</td>
                    <td className="px-4 py-2 text-right text-sm">{esi.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">Professional Tax</td>
                    <td className="px-4 py-2 text-right text-sm">{payroll.professionalTax.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">TDS</td>
                    <td className="px-4 py-2 text-right text-sm">{payroll.tds.toFixed(2)}</td>
                  </tr>
                  {payroll.penalties > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">Penalties / Other</td>
                      <td className="px-4 py-2 text-right text-sm">{payroll.penalties.toFixed(2)}</td>
                    </tr>
                  )}
                  {payroll.advancePayment > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">Advance / Loan Recovery</td>
                      <td className="px-4 py-2 text-right text-sm">{payroll.advancePayment.toFixed(2)}</td>
                    </tr>
                  )}
                  {payroll.otherDeductions > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">Other Deductions</td>
                      <td className="px-4 py-2 text-right text-sm">{payroll.otherDeductions.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-3 text-sm">Total Deductions (B)</td>
                    <td className="px-4 py-3 text-right text-sm">{totalDeductions.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className="border-2 border-black bg-gray-100 p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">NET PAY (A - B)</span>
          <span className="text-2xl font-bold">₹ {netPay.toFixed(2)}</span>
        </div>
        <div className="mt-2 text-sm">
          <span className="font-semibold">In Words: </span>
          <span className="italic">Rupees {numberToWords(Math.round(netPay))} Only</span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-600 border-t pt-4 mt-8">
        <p className="mb-2">
          <strong>Note:</strong> This is a system-generated payslip and does not require a signature.
        </p>
        <p>
          For any queries regarding this payslip, please contact the HR department.
        </p>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to convert number to words (simplified version)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');

  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
}
