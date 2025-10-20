import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function EmployeeLeavesPage() {
  const session = await getSession();
  const leaves = db.getLeaves().filter(l => l.employeeId === session!.employeeId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Leaves</h1>
          <p className="text-gray-600">Apply for and manage your leave requests</p>
        </div>
        <Button className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Apply for Leave
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Leave Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">{leave.leaveType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(leave.startDate)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(leave.endDate)}</td>
                    <td className="px-4 py-3 text-sm">{leave.days}</td>
                    <td className="px-4 py-3 text-sm">{leave.reason}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge 
                        variant={
                          leave.status === 'APPROVED' ? 'default' : 
                          leave.status === 'REJECTED' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}