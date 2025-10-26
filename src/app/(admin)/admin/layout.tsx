import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/shared/sidebar';
import Navbar from '@/components/shared/navbar';

const sidebarItems = [
  { icon: 'LayoutDashboard', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: 'Users', label: 'Employees', href: '/admin/employees' },
  { icon: 'Clock', label: 'Attendance', href: '/admin/attendance' },
  { icon: 'Calendar', label: 'Leave Management', href: '/admin/leave-management' },
  { icon: 'FolderKanban', label: 'Projects', href: '/admin/projects' },
  { icon: 'CheckSquare', label: 'Tasks', href: '/admin/tasks' },
  { icon: 'TrendingUp', label: 'Leads', href: '/admin/leads' },
  { icon: 'ShoppingCart', label: 'Sales', href: '/admin/sales' },
  { icon: 'DollarSign', label: 'Payroll', href: '/admin/payroll' },
  { icon: 'Settings2', label: 'Payroll Settings', href: '/admin/payroll-settings' },
  { icon: 'Receipt', label: 'Invoices', href: '/admin/invoices' },
  { icon: 'Wallet', label: 'Accounts', href: '/admin/accounts' },
  { icon: 'MessageSquare', label: 'Messages', href: '/admin/messages' },
  { icon: 'BarChart3', label: 'Reports', href: '/admin/reports' },
  { icon: 'Building2', label: 'Company Profile', href: '/admin/company-profile' },
  { icon: 'Settings', label: 'Settings', href: '/admin/settings' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} baseUrl="/admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={session.name} userRole="Admin" />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}