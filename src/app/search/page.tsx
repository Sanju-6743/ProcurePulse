'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  FileText,
  ShoppingCart,
  Building2,
  Package,
  DollarSign,
  Users,
  Calendar,
  Star,
  Download,
  Save,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'requisition' | 'po' | 'invoice' | 'vendor' | 'product';
  title: string;
  description: string;
  relevanceScore: number;
  status?: string;
  amount?: number;
  date?: string;
  highlights: string[];
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 'REQ-2024-0456',
      type: 'requisition',
      title: 'Office Equipment Upgrade',
      description: 'Request for new laptops and monitors for IT department',
      relevanceScore: 0.95,
      status: 'approved',
      amount: 2500,
      date: '2024-01-15',
      highlights: ['Office', 'Equipment', 'Upgrade']
    },
    {
      id: 'PO-2024-0123',
      type: 'po',
      title: 'Software Licenses Purchase',
      description: 'Purchase order for Microsoft Office licenses',
      relevanceScore: 0.88,
      status: 'confirmed',
      amount: 12000,
      date: '2024-01-20',
      highlights: ['Software', 'Licenses', 'Microsoft']
    },
    {
      id: 'VEN-001',
      type: 'vendor',
      title: 'TechCorp Solutions',
      description: 'IT equipment and software provider with 95% on-time delivery',
      relevanceScore: 0.82,
      status: 'active',
      highlights: ['TechCorp', 'Solutions', 'IT', 'Equipment']
    },
    {
      id: 'INV-2024-0892',
      type: 'invoice',
      title: 'Invoice for Office Supplies',
      description: 'Monthly invoice for office supplies and consumables',
      relevanceScore: 0.76,
      status: 'paid',
      amount: 850,
      date: '2024-01-25',
      highlights: ['Office', 'Supplies', 'Monthly']
    },
    {
      id: 'PROD-0456',
      type: 'product',
      title: 'Laptop Computer Dell XPS 15',
      description: 'High-performance laptop for business use',
      relevanceScore: 0.71,
      highlights: ['Laptop', 'Computer', 'Dell', 'XPS']
    },
  ];

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'requisition': return <FileText className="w-4 h-4" />;
      case 'po': return <ShoppingCart className="w-4 h-4" />;
      case 'invoice': return <DollarSign className="w-4 h-4" />;
      case 'vendor': return <Building2 className="w-4 h-4" />;
      case 'product': return <Package className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'requisition': return 'text-blue-600';
      case 'po': return 'text-green-600';
      case 'invoice': return 'text-purple-600';
      case 'vendor': return 'text-orange-600';
      case 'product': return 'text-cyan-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'approved':
      case 'confirmed':
      case 'active':
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">{status}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{status}</Badge>;
      case 'rejected':
      case 'cancelled':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AuthGuard requiredRoles={['requester', 'buyer', 'approver', 'finance', 'admin', 'auditor']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
            <p className="text-muted-foreground">
              Search across all procurement entities including requisitions, POs, invoices, vendors, and products
            </p>
          </div>

          {/* Search Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>
                Enter keywords to search across all procurement data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search requisitions, POs, invoices, vendors, products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Entity Type</label>
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full h-10 px-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="requisition">Requisitions</option>
                      <option value="po">Purchase Orders</option>
                      <option value="invoice">Invoices</option>
                      <option value="vendor">Vendors</option>
                      <option value="product">Products</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select 
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full h-10 px-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">From Date</label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full h-10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">To Date</label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Save Search
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchQuery && (
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  Found {mockResults.length} results for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockResults.map((result, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-lg bg-muted ${getTypeColor(result.type)}`}>
                        {getTypeIcon(result.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{result.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(result.type)}`}>
                                {result.type.toUpperCase()}
                              </span>
                              {getStatusBadge(result.status)}
                              {result.amount && (
                                <span className="text-sm font-medium">
                                  ${result.amount.toLocaleString()}
                                </span>
                              )}
                              {result.date && (
                                <span className="text-sm text-muted-foreground">
                                  {new Date(result.date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.highlights.map((highlight, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{Math.round(result.relevanceScore * 100)}%</span>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Searches */}
          {!searchQuery && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Searches</CardTitle>
                <CardDescription>
                  Quick access to your frequently used searches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'High Value POs', description: 'Purchase orders over $10,000', count: 45 },
                    { name: 'Pending Approvals', description: 'Requisitions awaiting approval', count: 18 },
                    { name: 'Active Vendors', description: 'Vendors in good standing', count: 156 },
                    { name: 'Overdue Invoices', description: 'Invoices past due date', count: 8 },
                    { name: 'IT Purchases', description: 'Technology-related procurement', count: 234 },
                    { name: 'Q4 Spending', description: 'Fourth quarter expenditures', count: 89 },
                  ].map((search, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{search.name}</h3>
                        <Badge variant="secondary">{search.count}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{search.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
              <CardDescription>
                Get the most out of global search with these tips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Search Operators</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use quotes for exact phrases: "office equipment"</li>
                    <li>• Use AND to combine terms: laptop AND dell</li>
                    <li>• Use OR for alternatives: supplies OR consumables</li>
                    <li>• Use NOT to exclude terms: software NOT microsoft</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Search Fields</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Search by ID: REQ-2024-0456</li>
                    <li>• Search by vendor name: TechCorp</li>
                    <li>• Search by amount range: 1000..5000</li>
                    <li>• Search by date: 2024-01</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}