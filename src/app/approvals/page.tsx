'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Eye,
  MessageSquare
} from 'lucide-react';

export default function ApprovalsPage() {
  return (
    <AuthGuard requiredRoles={['approver', 'admin']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
              <p className="text-muted-foreground">
                Review and approve requests, purchase orders, and exceptions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting your action
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Past due date
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Processed today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.8</div>
                <p className="text-xs text-muted-foreground">
                  Days to approve
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requisitions for Approval */}
            <Card>
              <CardHeader>
                <CardTitle>Requisitions</CardTitle>
                <CardDescription>
                  Purchase requests requiring your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'REQ-2024-0456', title: 'Office Equipment Upgrade', requester: 'John Smith', amount: 2500, days: 2 },
                    { id: 'REQ-2024-0457', title: 'Software Licenses Renewal', requester: 'Sarah Johnson', amount: 12000, days: 1 },
                    { id: 'REQ-2024-0458', title: 'Training Materials', requester: 'Mike Brown', amount: 800, days: 3 },
                  ].map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{req.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {req.id} • {req.requester} • ${req.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={req.days > 2 ? 'destructive' : 'secondary'}>
                          {req.days}d
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Purchase Orders for Approval */}
            <Card>
              <CardHeader>
                <CardTitle>Change Orders</CardTitle>
                <CardDescription>
                  Purchase order modifications requiring approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'PO-2024-0123', title: 'Equipment Order Change', vendor: 'TechCorp', amount: 3500, days: 1 },
                    { id: 'PO-2024-0124', title: 'Delivery Schedule Update', vendor: 'Office Depot', amount: 0, days: 4 },
                  ].map((po, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{po.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {po.id} • {po.vendor} • ${po.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={po.days > 2 ? 'destructive' : 'secondary'}>
                          {po.days}d
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approval Workflow Info */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Center</CardTitle>
              <CardDescription>
                Centralized approval management for all procurement activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Approval Workflows</h3>
                <p className="text-muted-foreground mb-4">
                  This section is under development. Complete approval management with advanced workflows will be available soon.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Multi-level Approvals</Badge>
                  <Badge variant="outline">Parallel Processing</Badge>
                  <Badge variant="outline">Delegation</Badge>
                  <Badge variant="outline">Escalation Rules</Badge>
                  <Badge variant="outline">Audit Trail</Badge>
                  <Badge variant="outline">SLA Tracking</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}