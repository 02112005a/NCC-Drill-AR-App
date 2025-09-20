'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Award,
  BarChart3,
  Bot,
  Camera,
  FileUp,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Live Drill', icon: Camera },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/leaderboard', label: 'Leaderboard', icon: Award },
  { href: '/instructor', label: 'AI Instructor', icon: Bot },
  { href: '/custom-drills', label: 'Custom Drills', icon: FileUp },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
