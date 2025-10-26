import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/shared/sidebar';
import Navbar from '@/components/shared/navbar';
import { PopupMessenger } from '@/components/messenger/PopupMessenger';

const sidebarItems = [
  { icon: 'LayoutDashboard', label: 'Dashboard', href: '/manager/dashboard' },
  { icon: 'Clock', label: 'Attendance', href: '/manager/attendance' },
  { icon: 'Calendar', label: 'Leave', href: '/manager/leave' },
  { icon: 'FolderKanban', label: 'Projects', href: '/manager/projects' },
  { icon: 'CheckSquare', label: 'Tasks', href: '/manager/tasks' },
  { icon: 'Receipt', label: 'Invoices', href: '/manager/invoices' },
  { icon: 'MessageSquare', label: 'Messages', href: '/manager/messages' },
  { icon: 'BarChart3', label: 'Reports', href: '/manager/reports' },
];

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session || session.role !== 'MANAGER') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} baseUrl="/manager" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={session.name} userRole="Manager" />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <PopupMessenger currentUserId={session.id} currentUserName={session.name} />
    </div>
  );
}