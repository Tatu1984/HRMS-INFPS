import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  employeeId: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  designation: string;
  salary: number;
  department: string;
  reportingHeadId?: string;
  dateOfJoining: string;
  profilePicture?: string;
  documents?: any;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  punchIn?: string;
  punchOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
}

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: 'SICK' | 'CASUAL' | 'EARNED' | 'UNPAID';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'HOLD';
  approvedBy?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  milestones?: any;
  successCriteria?: string;
  managerId?: string;
  members: string[];
}

export interface Task {
  id: string;
  projectId: string;
  assignedTo: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'HOLD' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  createdAt: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  deductions: any;
  bonuses: any;
  netSalary: number;
  absent: number;
  present: number;
  target?: number;
  targetAchieved?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: any;
  issuedDate: string;
  dueDate: string;
  createdAt: string;
}

export interface Account {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  purpose: string;
  description?: string;
  category: string;
  subCategory?: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject?: string;
  content: string;
  read: boolean;
  tracked: boolean;
  createdAt: string;
}

class Database {
  private readFile<T>(filename: string): T[] {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeFile<T>(filename: string, data: T[]): void {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  getUsers(): User[] { return this.readFile<User>('users.json'); }
  saveUsers(users: User[]): void { this.writeFile('users.json', users); }
  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  getEmployees(): Employee[] { return this.readFile<Employee>('employees.json'); }
  saveEmployees(employees: Employee[]): void { this.writeFile('employees.json', employees); }
  getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find(e => e.id === id);
  }

  getAttendance(): Attendance[] { return this.readFile<Attendance>('attendance.json'); }
  saveAttendance(attendance: Attendance[]): void { this.writeFile('attendance.json', attendance); }

  getLeaves(): Leave[] { return this.readFile<Leave>('leaves.json'); }
  saveLeaves(leaves: Leave[]): void { this.writeFile('leaves.json', leaves); }

  getProjects(): Project[] { return this.readFile<Project>('projects.json'); }
  saveProjects(projects: Project[]): void { this.writeFile('projects.json', projects); }

  getTasks(): Task[] { return this.readFile<Task>('tasks.json'); }
  saveTasks(tasks: Task[]): void { this.writeFile('tasks.json', tasks); }

  getPayroll(): Payroll[] { return this.readFile<Payroll>('payroll.json'); }
  savePayroll(payroll: Payroll[]): void { this.writeFile('payroll.json', payroll); }

  getInvoices(): Invoice[] { return this.readFile<Invoice>('invoices.json'); }
  saveInvoices(invoices: Invoice[]): void { this.writeFile('invoices.json', invoices); }

  getAccounts(): Account[] { return this.readFile<Account>('accounts.json'); }
  saveAccounts(accounts: Account[]): void { this.writeFile('accounts.json', accounts); }

  getMessages(): Message[] { return this.readFile<Message>('messages.json'); }
  saveMessages(messages: Message[]): void { this.writeFile('messages.json', messages); }
}

export const db = new Database();