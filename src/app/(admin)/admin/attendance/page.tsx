import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateTime } from '@/lib/utils';
import { AttendanceCalendarView } from '@/components/attendance/AttendanceCalendarView';

export default async function AttendancePage() {
  // Get current month's attendance
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const attendance = await prisma.attendance.findMany({
    where: {
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
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
  });

  // Get all employees
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      name: true,
      employeeId: true,
    },
  });

  // Group attendance by date for calendar
  const attendanceByDate = attendance.reduce((acc: any, att) => {
    const dateStr = new Date(att.date).toISOString().split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: att.date,
        presentCount: 0,
        absentCount: 0,
        halfDayCount: 0,
        leaveCount: 0,
        records: [],
      };
    }

    if (att.status === 'PRESENT') acc[dateStr].presentCount++;
    else if (att.status === 'ABSENT') acc[dateStr].absentCount++;
    else if (att.status === 'HALF_DAY') acc[dateStr].halfDayCount++;
    else if (att.status === 'LEAVE') acc[dateStr].leaveCount++;

    acc[dateStr].records.push(att);
    return acc;
  }, {});

  // Calculate absent employees for each date
  const calendarData = Object.entries(attendanceByDate).map(([date, data]: [string, any]) => {
    const totalEmployees = employees.length;
    const presentCount = data.presentCount + data.halfDayCount + data.leaveCount;
    const absentCount = totalEmployees - presentCount;

    return {
      date: new Date(date),
      status: 'PRESENT', // Dummy status for calendar
      presentCount,
      absentCount,
      employeeCount: totalEmployees,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-gray-600">Track employee attendance and working hours</p>
      </div>

      <AttendanceCalendarView attendanceData={calendarData} showEmployeeCount={true} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Work Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Break</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Idle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{att.employee.name}</div>
                          <div className="text-xs text-gray-500">{att.employee.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(att.date.toString())}</td>
                      <td className="px-4 py-3 text-sm text-xs">{att.punchIn ? formatDateTime(att.punchIn.toString()).split(' ')[1] : '-'}</td>
                      <td className="px-4 py-3 text-sm text-xs">{att.punchOut ? formatDateTime(att.punchOut.toString()).split(' ')[1] : '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{att.totalHours ? `${att.totalHours}h` : '-'}</td>
                      <td className="px-4 py-3 text-sm">{att.breakDuration ? `${att.breakDuration}h` : '-'}</td>
                      <td className="px-4 py-3 text-sm text-orange-600">{att.idleTime ? `${att.idleTime}h` : '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={att.status === 'PRESENT' ? 'default' : att.status === 'HALF_DAY' ? 'secondary' : 'destructive'}>
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