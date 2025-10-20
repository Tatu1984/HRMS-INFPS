import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employee = db.getEmployeeById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const employees = db.getEmployees();
    const index = employees.findIndex(e => e.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const updatedEmployee = {
      ...employees[index],
      name: body.name,
      email: body.email,
      phone: body.phone,
      altPhone: body.altPhone,
      address: body.address,
      designation: body.designation,
      salary: body.salary,
      department: body.department,
      reportingHeadId: body.reportingHeadId || undefined,
      dateOfJoining: body.dateOfJoining,
    };

    employees[index] = updatedEmployee;
    db.saveEmployees(employees);

    // Update user email if changed
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.employeeId === params.id);
    if (userIndex !== -1 && users[userIndex].email !== body.email) {
      users[userIndex].email = body.email;
      users[userIndex].username = body.email.split('@')[0];
      db.saveUsers(users);
    }

    return NextResponse.json({ success: true, employee: updatedEmployee });
  } catch (error) {
    console.error('Update employee error:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employees = db.getEmployees();
    const filteredEmployees = employees.filter(e => e.id !== params.id);

    if (employees.length === filteredEmployees.length) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    db.saveEmployees(filteredEmployees);

    // Delete associated user
    const users = db.getUsers();
    const filteredUsers = users.filter(u => u.employeeId !== params.id);
    db.saveUsers(filteredUsers);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}