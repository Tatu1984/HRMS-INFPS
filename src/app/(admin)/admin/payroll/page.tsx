import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calculator } from 'lucide-react';

export default function PayrollPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll</h1>
          <p className="text-gray-600">Manage employee salaries and payroll</p>
        </div>
        <Button className="bg-blue-600">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Payroll
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Payroll configuration and calculations will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}