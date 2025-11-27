'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Eye,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

export default function ExceptionsPage() {
  return (
    <AuthGuard requiredRoles={['buyer', 'finance', 'admin', 'auditor']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Exceptions</h1>
              <p className="text-muted-foreground">
                Manage and resolve procurement exceptions and discrepancies
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
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
                <CardTitle className="text-sm font-medium">Open Exceptions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  Require resolution
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Successfully closed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4</div>
                <p className="text-xs text-muted-foreground">
                  Days to resolve
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Exceptions */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Matching</CardTitle>
                <CardDescription>
                  3-way match exceptions and discrepancies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'INV-2024-0892', type: 'Price Variance', vendor: 'TechCorp', amount: 450, severity: 'high', days: 1 },
                    { id: 'INV-2024-0893', type: 'Quantity Mismatch', vendor: 'Office Depot', amount: 120, severity: 'medium', days: 2 },
                    { id: 'INV-2024-0894', type: 'Missing PO', vendor: 'Global Supplies', amount: 2800, severity: 'high', days: 3 },
                  ].map((exception, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{exception.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {exception.id} • {exception.vendor} • ${exception.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={exception.severity === 'high' ? 'destructive' : 'secondary'}>
                          {exception.severity}
                        </Badge>
                        <Badge variant="outline">
                          {exception.days}d
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

            {/* Receipt Exceptions */}
            <Card>
              <CardHeader>
                <CardTitle>Goods Receipt</CardTitle>
                <CardDescription>
                  Receipt discrepancies and quality issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'GRN-2024-0342', type: 'Damaged Goods', vendor: 'Industrial Equipment', amount: 1200, severity: 'medium', days: 2 },
                    { id: 'GRN-2024-0343', type: 'Short Shipment', vendor: 'Logistics Plus', amount: 350, severity: 'low', days: 1 },
                    { id: 'GRN-2024-0344', type: 'QA Failed', vendor: 'Manufacturing Co', amount: 2800, severity: 'high', days: 4 },
                  ].map((exception, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{exception.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {exception.id} • ${exception.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={exception.severity === 'high' ? 'destructive' : 'secondary'}>
                          {exception.severity}
                        </Badge>
                        <Badge variant="outline">
                          {exception.days}d
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

          {/* Exception Management Info */}
          <Card>
            <CardHeader>
              <CardTitle>Exception Management</CardTitle>
              <CardDescription>
                Comprehensive exception handling and resolution workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Exception Management</h3>
                <p className="text-muted-foreground mb-4">
                  This section is under development. Complete exception management with automated workflows will be available soon.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Automated Detection</Badge>
                  <Badge variant="outline">Workflow Routing</Badge>
                  <Badge variant="outline">Escalation Rules</Badge>
                  <Badge variant="outline">Resolution Tracking</Badge>
                  <Badge variant="outline">Analytics</Badge>
                  <Badge variant="outline">Prevention</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}