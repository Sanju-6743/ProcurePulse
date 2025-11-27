'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileSearch, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Handshake,
  Star
} from 'lucide-react';

export default function RFQPage() {
  return (
    <AuthGuard requiredRoles={['buyer', 'admin', 'auditor']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">RFQ Management</h1>
              <p className="text-muted-foreground">
                Create and manage requests for quotations with vendor bidding
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create RFQ
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
                <FileSearch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Open for bidding
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting evaluation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18%</div>
                <p className="text-xs text-muted-foreground">
                  Through competitive bidding
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendor Response</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">
                  Response rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Request for Quotation</CardTitle>
              <CardDescription>
                Manage RFQ creation, vendor bidding, and award processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    placeholder="Search RFQs by title, status, or vendor..."
                    className="pl-10 w-full h-10 px-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="text-center py-12">
                <FileSearch className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">RFQ Management</h3>
                <p className="text-muted-foreground mb-4">
                  This section is under development. Complete RFQ and bidding management will be available soon.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Vendor Invitation</Badge>
                  <Badge variant="outline">Bid Comparison</Badge>
                  <Badge variant="outline">Award Management</Badge>
                  <Badge variant="outline">Q&A Portal</Badge>
                  <Badge variant="outline">Scoring System</Badge>
                  <Badge variant="outline">Automated Workflows</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}