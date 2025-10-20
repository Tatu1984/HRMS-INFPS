import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSession, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const employee = db.getEmployeeById(user.employeeId);

    await setSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      name: employee?.name || user.username,
    });

    return NextResponse.json({
      success: true,
      role: user.role,
      name: employee?.name || user.username,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}