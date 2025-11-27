'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Upload,
  Calculator,
  Scale
} from 'lucide-react';

export default function InvoicesPage() {
  return (
    <AuthGuard requiredRoles={['finance', 'admin', 'auditor']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
              <p className="text-muted-foreground">
                Manage invoice processing with 3-way matching and exception handling
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Invoice
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,447</div>
                <p className="text-xs text-muted-foreground">
                  This year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Processing</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  Auto-matched
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exceptions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  Require resolution
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>
                Process invoices with automated 3-way matching and exception handling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    placeholder="Search invoices by number, vendor, or status..."
                    className="pl-10 w-full h-10 px-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="text-center py-12">
                <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invoice Management</h3>
                <p className="text-muted-foreground mb-4">
                  This section is under development. Complete invoice processing with 3-way matching will be available soon.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">3-Way Matching</Badge>
                  <Badge variant="outline">Exception Handling</Badge>
                  <Badge variant="outline">Automated Workflows</Badge>
                  <Badge variant="outline">Vendor Portal</Badge>
                  <Badge variant="outline">Approval Routing</Badge>
                  <Badge variant="outline">Payment Integration</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}