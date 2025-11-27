'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Search, 
  Filter,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  Target,
  PieChart,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <AuthGuard requiredRoles={['buyer', 'approver', 'finance', 'admin', 'auditor']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive procurement analytics and reporting
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.8M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5%</div>
                <p className="text-xs text-muted-foreground">
                  Through strategic sourcing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PO Cycle Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2</div>
                <p className="text-xs text-muted-foreground">
                  Days average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendor Performance</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  On-time delivery
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spend by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Spend by Category</CardTitle>
                <CardDescription>
                  Procurement spending distribution across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Charts</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced charts and visualizations will be available soon.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">Bar Charts</Badge>
                    <Badge variant="outline">Pie Charts</Badge>
                    <Badge variant="outline">Trend Analysis</Badge>
                    <Badge variant="outline">Drill-down</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spend Trend</CardTitle>
                <CardDescription>
                  Procurement spending trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Trend Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Time-series analysis and forecasting capabilities coming soon.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">Time Series</Badge>
                    <Badge variant="outline">Forecasting</Badge>
                    <Badge variant="outline">Anomaly Detection</Badge>
                    <Badge variant="outline">Seasonality</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vendor Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance</CardTitle>
                <CardDescription>
                    Key vendor metrics and KPIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'On-Time Delivery', value: '94.2%', trend: 'up' },
                    { metric: 'Quality Score', value: '96.8%', trend: 'up' },
                    { metric: 'Response Time', value: '2.1 days', trend: 'down' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{item.value}</span>
                        <TrendingUp className={`w-4 h-4 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Process Efficiency</CardTitle>
                <CardDescription>
                  Procurement process performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Approval Time', value: '1.8 days', trend: 'down' },
                    { metric: 'PO Cycle Time', value: '4.2 days', trend: 'down' },
                    { metric: 'Invoice Processing', value: '3.1 days', trend: 'down' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{item.value}</span>
                        <TrendingUp className={`w-4 h-4 ${item.trend === 'down' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
                <CardDescription>
                  Compliance and control metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Policy Adherence', value: '98.2%', trend: 'up' },
                    { metric: 'Audit Pass Rate', value: '96.5%', trend: 'up' },
                    { metric: 'Exception Rate', value: '2.1%', trend: 'down' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{item.value}</span>
                        <TrendingUp className={`w-4 h-4 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Analytics Info */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Powerful analytics and business intelligence capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Business Intelligence</h3>
                <p className="text-muted-foreground mb-4">
                  This section is under development. Advanced analytics with interactive dashboards and AI-powered insights will be available soon.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Interactive Dashboards</Badge>
                  <Badge variant="outline">Real-time Data</Badge>
                  <Badge variant="outline">Custom Reports</Badge>
                  <Badge variant="outline">Predictive Analytics</Badge>
                  <Badge variant="outline">AI Insights</Badge>
                  <Badge variant="outline">Data Export</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}