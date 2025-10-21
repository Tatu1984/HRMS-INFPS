import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateTime } from '@/lib/utils';

export default async function EmployeeAttendancePage() {
  const session = await getSession();
  const attendance = await prisma.attendance.findMany({
    where: {
      employeeId: session!.employeeId!,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-gray-600">View your attendance history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch In</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch Out</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{formatDate(att.date.toString())}</td>
                    <td className="px-4 py-3 text-sm">{att.punchIn ? formatDateTime(att.punchIn.toString()) : '-'}</td>
                    <td className="px-4 py-3 text-sm">{att.punchOut ? formatDateTime(att.punchOut.toString()) : '-'}</td>
                    <td className="px-4 py-3 text-sm">{att.totalHours ? att.totalHours.toFixed(2) : '-'} hrs</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={att.status === 'PRESENT' ? 'default' : 'destructive'}>
                        {att.status}
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