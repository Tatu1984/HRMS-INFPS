import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';
import { generateId, generateEmployeeId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employees = db.getEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const employees = db.getEmployees();
    const users = db.getUsers();

    // Check if email already exists
    if (employees.some(e => e.email === body.email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const newEmployee = {
      id: generateId(),
      employeeId: generateEmployeeId(),
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
      profilePicture: body.profilePicture,
      documents: body.documents,
    };

    employees.push(newEmployee);
    db.saveEmployees(employees);

    // Create user account
    const hashedPwd = await hashPassword('12345678'); // Default password
    const newUser = {
      id: generateId(),
      email: body.email,
      username: body.email.split('@')[0],
      password: hashedPwd,
      role: 'EMPLOYEE' as const,
      employeeId: newEmployee.id,
    };

    users.push(newUser);
    db.saveUsers(users);

    return NextResponse.json({ success: true, employee: newEmployee }, { status: 201 });
  } catch (error) {
    console.error('Create employee error:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}