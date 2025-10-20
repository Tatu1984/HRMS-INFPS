import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/auth';

const publicPaths = ['/login'];
const adminPaths = ['/admin'];
const managerPaths = ['/manager'];
const employeePaths = ['/employee'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const token = request.cookies.get('session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const session = await decrypt(token);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (adminPaths.some(path => pathname.startsWith(path)) && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL(`/${session.role.toLowerCase()}/dashboard`, request.url));
  }

  if (managerPaths.some(path => pathname.startsWith(path)) && session.role !== 'MANAGER') {
    return NextResponse.redirect(new URL(`/${session.role.toLowerCase()}/dashboard`, request.url));
  }

  if (employeePaths.some(path => pathname.startsWith(path)) && session.role !== 'EMPLOYEE') {
    return NextResponse.redirect(new URL(`/${session.role.toLowerCase()}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};