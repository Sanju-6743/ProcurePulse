'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Search,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  CreditCard,
  Truck,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Users,
  Archive,
  Calculator,
  FileSearch,
  CheckSquare,
  DollarSign,
  MessageSquare,
  BarChart3,
  Database,
  FileSignature,
  PackageOpen,
  Receipt,
  Handshake,
  Shield,
  Eye,
  Wrench,
  Palette,
  Globe,
  Zap,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['requester', 'buyer', 'approver', 'finance', 'admin', 'auditor'],
  },
  {
    name: 'Vendors',
    href: '/vendors',
    icon: Building2,
    roles: ['buyer', 'admin', 'auditor'],
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    roles: ['requester', 'buyer', 'admin', 'auditor'],
  },
  {
    name: 'Budgets',
    href: '/budgets',
    icon: Calculator,
    roles: ['approver', 'finance', 'admin', 'auditor'],
  },
  {
    name: 'Requisitions',
    href: '/requisitions',
    icon: FileText,
    roles: ['requester', 'buyer', 'approver', 'admin', 'auditor'],
  },
  {
    name: 'RFQs',
    href: '/rfq',
    icon: FileSearch,
    roles: ['buyer', 'admin', 'auditor'],
  },
  {
    name: 'Purchase Orders',
    href: '/po',
    icon: ShoppingCart,
    roles: ['buyer', 'finance', 'admin', 'auditor'],
  },
  {
    name: 'Goods Receipt',
    href: '/grn',
    icon: PackageOpen,
    roles: ['buyer', 'admin', 'auditor'],
  },
  {
    name: 'Invoices',
    href: '/invoices',
    icon: Receipt,
    roles: ['finance', 'admin', 'auditor'],
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCard,
    roles: ['finance', 'admin', 'auditor'],
  },
  {
    name: 'Approvals',
    href: '/approvals',
    icon: CheckSquare,
    roles: ['approver', 'admin'],
  },
  {
    name: 'Exceptions',
    href: '/exceptions',
    icon: AlertTriangle,
    roles: ['buyer', 'finance', 'admin', 'auditor'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['buyer', 'approver', 'finance', 'admin', 'auditor'],
  },
  {
    name: 'Search',
    href: '/search',
    icon: Search,
    roles: ['requester', 'buyer', 'approver', 'finance', 'admin', 'auditor'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin'],
  },
];

const adminNavigation = [
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    name: 'System Logs',
    href: '/admin/logs',
    icon: Database,
    roles: ['admin'],
  },
  {
    name: 'Audit Trail',
    href: '/admin/audit',
    icon: Shield,
    roles: ['admin', 'auditor'],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user, hasRole, logout } = useAuthStore();

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  const filteredAdminNavigation = adminNavigation.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">ProcureFlow</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {filteredAdminNavigation.length > 0 && (
          <>
            <div className="pt-6 mt-6 border-t">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </h3>
            </div>
            <div className="space-y-1">
              {filteredAdminNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-lg">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        'hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:bg-card',
        className
      )}>
        <SidebarContent />
      </div>
    </>
  );
}