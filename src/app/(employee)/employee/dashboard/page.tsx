import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, CheckSquare, MessageSquare, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function EmployeeDashboard() {
  const session = await getSession();
  const employee = db.getEmployeeById(session!.employeeId);
  const tasks = db.getTasks().filter(t => t.assignedTo === session!.employeeId);
  const leaves = db.getLeaves().filter(l => l.employeeId === session!.employeeId);
  const messages = db.getMessages().filter(m => m.recipientId === session!.employeeId && !m.read);

  const activeTasks = tasks.filter(t => t.status !== 'COMPLETED').length;
  const leavesLeft = 24; // Calculate based on leave records

  return (
    <div className="p-6 space-y-6">
      {/* Top Action Bar */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Today's Status</h3>
              <p className="text-sm text-blue-100">Monday, October 20, 2025</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-6">
                <p className="text-sm text-blue-100">Current Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(employee?.salary || 0)}</p>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Clock className="w-4 h-4 mr-2" />
                Punch In
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-blue-700">
                Break
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Attendance %</p>
                <p className="text-2xl font-bold">95.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Leaves Left</p>
                <p className="text-2xl font-bold">{leavesLeft} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Tasks</p>
                <p className="text-2xl font-bold">{activeTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">New Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Company Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                  CEO
                </div>
                <p className="font-semibold">Rahul Mehta</p>
                <p className="text-xs text-gray-500">Chief Executive Officer</p>
              </div>
              <div className="h-8 w-px bg-gray-300 mx-auto"></div>
              {employee?.reportingHeadId && (
                <>
                  <div className="inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold mb-2">
                      PM
                    </div>
                    <p className="font-semibold">
                      {db.getEmployeeById(employee.reportingHeadId)?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {db.getEmployeeById(employee.reportingHeadId)?.designation}
                    </p>
                    <Badge className="mt-1">Your Manager</Badge>
                  </div>
                  <div className="h-8 w-px bg-gray-300 mx-auto"></div>
                </>
              )}
              <div className="inline-block">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold mb-2">
                  YOU
                </div>
                <p className="font-semibold">{employee?.name}</p>
                <p className="text-xs text-gray-500">{employee?.designation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HR Policies */}
      <Card>
        <CardHeader>
          <CardTitle>HR Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold mb-1">Work From Home Policy</h4>
              <p className="text-sm text-gray-600">Employees can work from home up to 2 days per week with prior approval.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold mb-1">Leave Policy</h4>
              <p className="text-sm text-gray-600">24 days earned leave, 12 days casual leave, 12 days sick leave annually.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold mb-1">Code of Conduct</h4>
              <p className="text-sm text-gray-600">Maintain professional behavior and adhere to company values at all times.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}