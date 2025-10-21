import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    } else if (session.role === 'EMPLOYEE') {
      // Employees can only see their own attendance
      where.employeeId = session.employeeId!;
    } else if (session.role === 'MANAGER') {
      // Managers can see their team's attendance
      const manager = await prisma.employee.findUnique({
        where: { id: session.employeeId! },
        include: { subordinates: true },
      });

      if (manager) {
        where.employeeId = {
          in: [manager.id, ...manager.subordinates.map(s => s.id)],
        };
      }
    }
    // Admins can see all attendance (no filter)

    if (date) {
      const dateObj = new Date(date);
      where.date = {
        gte: new Date(dateObj.setHours(0, 0, 0, 0)),
        lte: new Date(dateObj.setHours(23, 59, 59, 999)),
      };
    } else if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            designation: true,
            department: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

// POST /api/attendance - Punch in/out
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, employeeId } = body; // action: 'punch-in', 'punch-out', 'break-start', 'break-end'

    // Employees can only punch for themselves
    const targetEmployeeId = session.role === 'EMPLOYEE' ? session.employeeId! : employeeId;

    if (!targetEmployeeId) {
      return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's attendance record
    let attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: targetEmployeeId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const now = new Date();

    if (action === 'punch-in') {
      if (attendance) {
        return NextResponse.json(
          { error: 'Already punched in today' },
          { status: 400 }
        );
      }

      attendance = await prisma.attendance.create({
        data: {
          employeeId: targetEmployeeId,
          date: today,
          punchIn: now,
          status: 'PRESENT',
        },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(attendance);
    }

    if (!attendance) {
      return NextResponse.json(
        { error: 'No punch-in record found for today' },
        { status: 400 }
      );
    }

    if (action === 'punch-out') {
      if (attendance.punchOut) {
        return NextResponse.json(
          { error: 'Already punched out today' },
          { status: 400 }
        );
      }

      // Calculate total hours
      const punchInTime = attendance.punchIn ? new Date(attendance.punchIn).getTime() : 0;
      const punchOutTime = now.getTime();
      let totalHours = (punchOutTime - punchInTime) / (1000 * 60 * 60);

      // Subtract break time if any
      if (attendance.breakStart && attendance.breakEnd) {
        const breakStartTime = new Date(attendance.breakStart).getTime();
        const breakEndTime = new Date(attendance.breakEnd).getTime();
        const breakHours = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
        totalHours -= breakHours;
      }

      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          punchOut: now,
          totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
          status: totalHours >= 4 ? 'PRESENT' : 'HALF_DAY',
        },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(attendance);
    }

    if (action === 'break-start') {
      if (attendance.breakStart) {
        return NextResponse.json(
          { error: 'Break already started' },
          { status: 400 }
        );
      }

      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: { breakStart: now },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(attendance);
    }

    if (action === 'break-end') {
      if (!attendance.breakStart) {
        return NextResponse.json(
          { error: 'No break started' },
          { status: 400 }
        );
      }

      if (attendance.breakEnd) {
        return NextResponse.json(
          { error: 'Break already ended' },
          { status: 400 }
        );
      }

      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: { breakEnd: now },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(attendance);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing attendance:', error);
    return NextResponse.json(
      { error: 'Failed to process attendance' },
      { status: 500 }
    );
  }
}
