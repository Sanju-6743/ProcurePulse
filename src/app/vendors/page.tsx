'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

interface Vendor {
  id: string;
  name: string;
  taxId: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  riskScore: number;
  slaMetrics: {
    onTimeDelivery: number;
    qualityScore: number;
    responsiveness: number;
  };
  status: 'active' | 'suspended' | 'pending' | 'blacklisted';
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

interface VendorsResponse {
  data: Vendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const { data: vendorsData, isLoading, error } = useQuery<VendorsResponse>({
    queryKey: ['vendors', currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
      });
      
      const response = await fetch(`/api/vendors?${params}`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },
  });

  const getStatusBadge = (status: Vendor['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge variant="secondary">Suspended</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'blacklisted':
        return <Badge variant="destructive">Blacklisted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskScoreIcon = (score: number) => {
    if (score <= 30) return <CheckCircle className="w-4 h-4" />;
    if (score <= 70) return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <AuthGuard requiredRoles={['buyer', 'admin', 'auditor']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
              <p className="text-muted-foreground">
                Manage your vendor relationships and performance metrics
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vendorsData?.pagination.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendorsData?.data.filter(v => v.status === 'active').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  In good standing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendorsData?.data.length 
                    ? Math.round(vendorsData.data.reduce((acc, v) => acc + v.riskScore, 0) / vendorsData.data.length)
                    : 0
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall risk assessment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg OTD</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendorsData?.data.length 
                    ? Math.round(vendorsData.data.reduce((acc, v) => acc + v.slaMetrics.onTimeDelivery, 0) / vendorsData.data.length)
                    : 0
                  }%
                </div>
                <p className="text-xs text-muted-foreground">
                  On-time delivery
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor List</CardTitle>
              <CardDescription>
                View and manage all registered vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search vendors by name, tax ID, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Vendors Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>OTD %</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          {[...Array(7)].map((_, j) => (
                            <TableCell key={j}>
                              <div className="h-4 bg-muted rounded animate-pulse" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : vendorsData?.data?.length ? (
                      vendorsData.data.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {vendor.taxId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {vendor.categories.slice(0, 2).map((category, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                              {vendor.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{vendor.categories.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center space-x-1 ${getRiskScoreColor(vendor.riskScore)}`}>
                              {getRiskScoreIcon(vendor.riskScore)}
                              <span className="font-medium">{vendor.riskScore}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{vendor.slaMetrics.onTimeDelivery}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(vendor.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{vendor.contact.email}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                <span>{vendor.contact.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedVendor(vendor)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Documents
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">No vendors found</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Details Dialog */}
        <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
              <DialogDescription>
                Complete information about {selectedVendor?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedVendor && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                    <p className="font-medium">{selectedVendor.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div>{getStatusBadge(selectedVendor.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tax ID</label>
                    <p className="font-medium">{selectedVendor.taxId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                    <p className="font-medium">{selectedVendor.registrationNumber}</p>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <div className="flex items-start space-x-2 mt-1">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p>{selectedVendor.address.street}</p>
                      <p>{selectedVendor.address.city}, {selectedVendor.address.state} {selectedVendor.address.zipCode}</p>
                      <p>{selectedVendor.address.country}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="font-medium">{selectedVendor.contact.name}</p>
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="w-3 h-3" />
                        <span>{selectedVendor.contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{selectedVendor.contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Performance Metrics</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="text-center p-3 border rounded-lg">
                      <div className={`text-2xl font-bold ${getRiskScoreColor(selectedVendor.riskScore)}`}>
                        {selectedVendor.riskScore}
                      </div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedVendor.slaMetrics.onTimeDelivery}%
                      </div>
                      <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedVendor.slaMetrics.qualityScore}%
                      </div>
                      <div className="text-sm text-muted-foreground">Quality Score</div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categories</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVendor.categories.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedVendor(null)}>
                Close
              </Button>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Vendor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </AuthGuard>
  );
}