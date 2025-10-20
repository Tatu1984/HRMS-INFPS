'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface SidebarItem {
  icon: string; // Changed from LucideIcon to string
  label: string;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  baseUrl: string;
}

export default function Sidebar({ items, baseUrl }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 text-white h-screen p-4 space-y-2">
      <div className="mb-8 pb-4 border-b border-slate-700">
        <h1 className="text-2xl font-bold">HRMS</h1>
        <p className="text-sm text-slate-400">Management System</p>
      </div>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const IconComponent = (Icons as any)[item.icon];
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            {IconComponent && <IconComponent className="w-5 h-5" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}