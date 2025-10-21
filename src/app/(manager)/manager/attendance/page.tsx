import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateTime } from '@/lib/utils';

export default async function ManagerAttendancePage() {
  const session = await getSession();

  const teamMembers = await prisma.employee.findMany({
    where: {
      reportingHeadId: session!.employeeId!,
    },
  });

  const teamIds = [session!.employeeId!, ...teamMembers.map(t => t.id)];

  const attendance = await prisma.attendance.findMany({
    where: {
      employeeId: {
        in: teamIds,
      },
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: 100,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Attendance</h1>
        <p className="text-gray-600">Monitor your team's attendance</p>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch In</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch Out</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.map((att) => {
                  return (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{att.employee?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(att.date)}</td>
                      <td className="px-4 py-3 text-sm">{att.punchIn ? formatDateTime(att.punchIn) : '-'}</td>
                      <td className="px-4 py-3 text-sm">{att.punchOut ? formatDateTime(att.punchOut) : '-'}</td>
                      <td className="px-4 py-3 text-sm">{att.totalHours || '-'} hrs</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={att.status === 'PRESENT' ? 'default' : 'destructive'}>
                          {att.status}
                        </Badge>
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