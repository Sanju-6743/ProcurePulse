'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth';
import { useProcurementStore } from '@/lib/stores/procurement';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Building2, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Users,
  FileCheck,
  CreditCard,
  Plus,
  ArrowRight,
  BarChart3,
  Target,
  Activity,
} from 'lucide-react';

interface DashboardStats {
  totalSpend: number;
  openPOs: number;
  pendingApprovals: number;
  vendorOTD: number;
  budgetUtilization: number;
  activeVendors: number;
  pendingInvoices: number;
  overduePayments: number;
}

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to ProcureFlow</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access the procurement portal</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}

function Dashboard() {
  const { user } = useAuthStore();
  
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const quickActions = [
    {
      title: 'Create Requisition',
      description: 'Request new items or services',
      icon: FileText,
      href: '/requisitions/new',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      roles: ['requester', 'buyer', 'admin'],
    },
    {
      title: 'Create RFQ',
      description: 'Request quotes from vendors',
      icon: FileCheck,
      href: '/rfq/new',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      roles: ['buyer', 'admin'],
    },
    {
      title: 'Approve Requests',
      description: 'Review pending approvals',
      icon: CheckCircle,
      href: '/approvals',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      roles: ['approver', 'admin'],
    },
    {
      title: 'View Analytics',
      description: 'Check spending insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      roles: ['buyer', 'approver', 'finance', 'admin', 'auditor'],
    },
  ];

  const filteredQuickActions = quickActions.filter(action =>
    action.roles.includes(user?.role || '')
  );

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. Here's what's happening with your procurement.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{user?.role}</Badge>
            <Badge variant="secondary">{user?.department}</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(stats?.totalSpend || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open POs</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.openPOs || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +3 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingApprovals || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendor OTD</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.vendorOTD || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  On-time delivery rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.budgetUtilization || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Of allocated budget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeVendors || 0}</div>
                <p className="text-xs text-muted-foreground">
                  In good standing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingInvoices || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.overduePayments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Require follow-up
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredQuickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-2`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={action.href}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requisitions</CardTitle>
              <CardDescription>Latest purchase requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'REQ-001', title: 'Office Equipment Upgrade', status: 'approved', amount: 2500 },
                  { id: 'REQ-002', title: 'Software Licenses', status: 'pending', amount: 1200 },
                  { id: 'REQ-003', title: 'Training Materials', status: 'draft', amount: 800 },
                ].map((req, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{req.title}</p>
                      <p className="text-sm text-muted-foreground">{req.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={req.status === 'approved' ? 'default' : req.status === 'pending' ? 'secondary' : 'outline'}>
                        {req.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">${req.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'PO-2024-0001', vendor: 'TechCorp Solutions', status: 'confirmed', amount: 15000 },
                  { id: 'PO-2024-0002', vendor: 'Office Depot Pro', status: 'sent', amount: 3500 },
                  { id: 'PO-2024-0003', vendor: 'Industrial Equipment Ltd', status: 'draft', amount: 25000 },
                ].map((po, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{po.vendor}</p>
                      <p className="text-sm text-muted-foreground">{po.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={po.status === 'confirmed' ? 'default' : po.status === 'sent' ? 'secondary' : 'outline'}>
                        {po.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">${po.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}