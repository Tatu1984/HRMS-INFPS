import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.account.deleteMany();
  await prisma.accountCategory.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.salaryConfig.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();

  const hashedPassword = await bcrypt.hash('12345678', 10);

  // Create employees first
  const adminEmployee = await prisma.employee.create({
    data: {
      employeeId: 'EMP001',
      name: 'Admin User',
      email: 'admin@company.com',
      phone: '+91-9999999999',
      address: '123 Admin Street, Mumbai',
      designation: 'System Administrator',
      salary: 100000,
      department: 'Administration',
      dateOfJoining: new Date('2024-01-01'),
    },
  });

  const managerEmployee = await prisma.employee.create({
    data: {
      employeeId: 'EMP002',
      name: 'Amit Patel',
      email: 'manager@company.com',
      phone: '+91-8888888888',
      address: '456 Manager Avenue, Delhi',
      designation: 'Project Manager',
      salary: 80000,
      department: 'Development',
      dateOfJoining: new Date('2024-02-01'),
    },
  });

  const developerEmployee = await prisma.employee.create({
    data: {
      employeeId: 'EMP003',
      name: 'Priya Sharma',
      email: 'employee@company.com',
      phone: '+91-7777777777',
      address: '789 Employee Road, Bangalore',
      designation: 'Software Developer',
      salary: 50000,
      department: 'Development',
      reportingHeadId: managerEmployee.id,
      dateOfJoining: new Date('2024-03-01'),
    },
  });

  // Create users
  await prisma.user.create({
    data: {
      email: 'admin@company.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      employeeId: adminEmployee.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'manager@company.com',
      username: 'manager',
      password: hashedPassword,
      role: 'MANAGER',
      employeeId: managerEmployee.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'employee@company.com',
      username: 'employee',
      password: hashedPassword,
      role: 'EMPLOYEE',
      employeeId: developerEmployee.id,
    },
  });

  // Create attendance record
  await prisma.attendance.create({
    data: {
      employeeId: developerEmployee.id,
      date: new Date('2025-10-20'),
      punchIn: new Date('2025-10-20T09:00:00'),
      status: 'PRESENT',
    },
  });

  // Create leave request
  await prisma.leave.create({
    data: {
      employeeId: developerEmployee.id,
      leaveType: 'CASUAL',
      startDate: new Date('2025-10-25'),
      endDate: new Date('2025-10-26'),
      days: 2,
      reason: 'Personal work',
      status: 'PENDING',
    },
  });

  // Create project
  const project = await prisma.project.create({
    data: {
      projectId: 'PRJ00001',
      name: 'HRMS Development',
      description: 'Building a comprehensive HR Management System',
      projectType: 'MILESTONE',
      totalBudget: 500000,
      upfrontPayment: 100000,
      startDate: new Date('2025-01-01'),
      status: 'ACTIVE',
      milestones: {
        milestones: [
          { name: 'Phase 1: Core Features', dueDate: '2025-06-30', status: 'in_progress' },
          { name: 'Phase 2: Advanced Features', dueDate: '2025-12-31', status: 'pending' }
        ]
      },
      successCriteria: 'Fully functional HRMS with all modules operational',
    },
  });

  // Add project members
  await prisma.projectMember.createMany({
    data: [
      { projectId: project.id, employeeId: managerEmployee.id, role: 'Project Manager' },
      { projectId: project.id, employeeId: developerEmployee.id, role: 'Developer' },
    ],
  });

  // Create task
  await prisma.task.create({
    data: {
      projectId: project.id,
      assignedTo: developerEmployee.id,
      title: 'Design login page',
      description: 'Create a beautiful and functional login page',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2025-10-25'),
    },
  });

  // Create salary config
  await prisma.salaryConfig.create({
    data: {
      pfPercentage: 12,
      esiPercentage: 0.75,
      taxSlabs: {
        slabs: [
          { min: 0, max: 250000, rate: 0 },
          { min: 250001, max: 500000, rate: 5 },
          { min: 500001, max: 1000000, rate: 20 },
          { min: 1000001, max: null, rate: 30 }
        ]
      },
      bonusRules: {
        performance: { excellent: 20, good: 10, average: 5 }
      },
    },
  });

  // Create account categories
  await prisma.accountCategory.createMany({
    data: [
      {
        name: 'Salaries',
        type: 'EXPENSE',
        subCategories: { items: ['Regular', 'Bonus', 'Overtime'] }
      },
      {
        name: 'Office Expenses',
        type: 'EXPENSE',
        subCategories: { items: ['Rent', 'Utilities', 'Maintenance'] }
      },
      {
        name: 'Project Revenue',
        type: 'INCOME',
        subCategories: { items: ['Consulting', 'Development', 'Support'] }
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin: admin@company.com / 12345678');
  console.log('📧 Manager: manager@company.com / 12345678');
  console.log('📧 Employee: employee@company.com / 12345678');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
