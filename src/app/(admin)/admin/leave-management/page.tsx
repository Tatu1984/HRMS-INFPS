import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, Ban } from 'lucide-react';

export default async function LeaveManagementPage() {
  const leaves = db.getLeaves();
  const employees = db.getEmployees();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <p className="text-gray-600">Review and manage employee leave requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Leave Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaves.map((leave) => {
                  const emp = employees.find(e => e.id === leave.employeeId);
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{emp?.name}</td>
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
                      <td className="px-4 py-3 text-sm">
                        {leave.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-orange-600">
                              <Clock className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}