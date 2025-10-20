import fs from 'fs';
import path from 'path';
import * as bcrypt from 'bcryptjs';

const dataDir = path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function seed() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  const users = [
    { id: '1', email: 'admin@company.com', username: 'admin', password: hashedPassword, role: 'ADMIN', employeeId: '1' },
    { id: '2', email: 'manager@company.com', username: 'manager', password: hashedPassword, role: 'MANAGER', employeeId: '2' },
    { id: '3', email: 'employee@company.com', username: 'employee', password: hashedPassword, role: 'EMPLOYEE', employeeId: '3' }
  ];

  const employees = [
    { id: '1', employeeId: 'EMP001', name: 'Admin User', email: 'admin@company.com', phone: '+91-9999999999', address: '123 Admin Street, Mumbai', designation: 'System Administrator', salary: 100000, department: 'Administration', dateOfJoining: '2024-01-01' },
    { id: '2', employeeId: 'EMP002', name: 'Amit Patel', email: 'manager@company.com', phone: '+91-8888888888', address: '456 Manager Avenue, Delhi', designation: 'Project Manager', salary: 80000, department: 'Development', dateOfJoining: '2024-02-01' },
    { id: '3', employeeId: 'EMP003', name: 'Priya Sharma', email: 'employee@company.com', phone: '+91-7777777777', address: '789 Employee Road, Bangalore', designation: 'Software Developer', salary: 50000, department: 'Development', reportingHeadId: '2', dateOfJoining: '2024-03-01' }
  ];

  const attendance = [
    { id: '1', employeeId: '3', date: '2025-10-20', punchIn: '2025-10-20T09:00:00', status: 'PRESENT' }
  ];

  const leaves = [
    { id: '1', employeeId: '3', leaveType: 'CASUAL', startDate: '2025-10-25', endDate: '2025-10-26', days: 2, reason: 'Personal work', status: 'PENDING', createdAt: new Date().toISOString() }
  ];

  const projects = [
    { id: '1', name: 'HRMS Development', description: 'Building a comprehensive HR Management System', startDate: '2025-01-01', status: 'ACTIVE', managerId: '2', members: ['2', '3'] }
  ];

  const tasks = [
    { id: '1', projectId: '1', assignedTo: '3', title: 'Design login page', description: 'Create a beautiful and functional login page', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2025-10-25', createdAt: new Date().toISOString() }
  ];

  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(dataDir, 'employees.json'), JSON.stringify(employees, null, 2));
  fs.writeFileSync(path.join(dataDir, 'attendance.json'), JSON.stringify(attendance, null, 2));
  fs.writeFileSync(path.join(dataDir, 'leaves.json'), JSON.stringify(leaves, null, 2));
  fs.writeFileSync(path.join(dataDir, 'projects.json'), JSON.stringify(projects, null, 2));
  fs.writeFileSync(path.join(dataDir, 'tasks.json'), JSON.stringify(tasks, null, 2));
  fs.writeFileSync(path.join(dataDir, 'payroll.json'), JSON.stringify([], null, 2));
  fs.writeFileSync(path.join(dataDir, 'invoices.json'), JSON.stringify([], null, 2));
  fs.writeFileSync(path.join(dataDir, 'accounts.json'), JSON.stringify([], null, 2));
  fs.writeFileSync(path.join(dataDir, 'messages.json'), JSON.stringify([], null, 2));

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin: admin@company.com / 12345678');
  console.log('📧 Manager: manager@company.com / 12345678');
  console.log('📧 Employee: employee@company.com / 12345678');
}

seed().catch(console.error);