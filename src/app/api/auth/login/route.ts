import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { setSession, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email/Username and password are required' }, { status: 400 });
    }

    // Try to find user by email or username
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }, // Allow login with username too
        ],
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
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await setSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId || undefined,
      name: user.employee?.name || user.username,
      permissions: user.permissions || null,
    });

    return NextResponse.json({
      success: true,
      role: user.role,
      name: user.employee?.name || user.username,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}