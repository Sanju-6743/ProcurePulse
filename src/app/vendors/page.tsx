
'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
import { toast } from 'sonner';

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
  complianceDocs?: {
    type: string;
    url: string;
    expiryDate: string;
  }[];
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const queryClient = useQueryClient();

  const [newVendor, setNewVendor] = useState({
    name: '',
    taxId: '',
    registrationNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    contact: {
      name: '',
      email: '',
      phone: '',
    },
    categories: [] as string[],
    status: 'pending' as Vendor['status'],
  });

  const isAddDisabled =
    !newVendor.name.trim() ||
    !newVendor.taxId.trim();

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

  const handleAddVendor = async () => {
    // Client-side validation
    if (!newVendor.name.trim() || !newVendor.taxId.trim()) {
      toast.error('Company Name and Tax ID are required');
      return;
    }

    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // If your API requires riskScore / slaMetrics, send sensible defaults
        body: JSON.stringify({
          ...newVendor,
          riskScore: 50,
          slaMetrics: { onTimeDelivery: 0, qualityScore: 0, responsiveness: 0 },
        }),
      });

      if (!response.ok) {
        const msg = await response.text().catch(() => 'Failed to add vendor');
        throw new Error(msg);
      }

      toast.success('Vendor added successfully');

      // Reset form
      setNewVendor({
        name: '',
        taxId: '',
        registrationNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
        contact: {
          name: '',
          email: '',
          phone: '',
        },
        categories: [],
        status: 'pending',
      });

      // Refresh via React Query (no full page reload)
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });

      // Close dialog
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error('Error adding vendor:', err);
      toast.error(err?.message ?? 'Failed to add vendor');
    }
  };

  const handleEditVendor = async () => {
    if (!selectedVendor) return;

    // Client-side validation
    if (!newVendor.name.trim() || !newVendor.taxId.trim()) {
      toast.error('Company Name and Tax ID are required');
      return;
    }

    try {
      const response = await fetch('/api/vendors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedVendor.id,
          ...newVendor,
        }),
      });

      if (!response.ok) {
        const msg = await response.text().catch(() => 'Failed to update vendor');
        throw new Error(msg);
      }

      toast.success('Vendor updated successfully');

      // Refresh via React Query
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });

      // Close dialog and reset
      setIsEditDialogOpen(false);
      setSelectedVendor(null);
      setNewVendor({
        name: '',
        taxId: '',
        registrationNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
        contact: {
          name: '',
          email: '',
          phone: '',
        },
        categories: [],
        status: 'pending',
      });
    } catch (err: any) {
      console.error('Error updating vendor:', err);
      toast.error(err?.message ?? 'Failed to update vendor');
    }
  };

  const handleDeleteVendor = async () => {
    if (!vendorToDelete) return;

    try {
      const response = await fetch(`/api/vendors?id=${vendorToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const msg = await response.text().catch(() => 'Failed to delete vendor');
        throw new Error(msg);
      }

      toast.success('Vendor deleted successfully');

      // Refresh via React Query
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });

      // Close dialog
      setVendorToDelete(null);
    } catch (err: any) {
      console.error('Error deleting vendor:', err);
      toast.error(err?.message ?? 'Failed to delete vendor');
    }
  };

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setNewVendor({
      name: vendor.name,
      taxId: vendor.taxId,
      registrationNumber: vendor.registrationNumber,
      address: vendor.address,
      contact: vendor.contact,
      categories: vendor.categories,
      status: vendor.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleViewDocuments = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDocumentsDialogOpen(true);
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

            <Button
              type="button"
              variant="default"
              title="Add new vendor"
              onClick={() => {
                console.log('Add Vendor button clicked');
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              add new vendor
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
                <div className="text-2xl font-bold">{vendorsData?.pagination.total ?? 0}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendorsData?.data.filter(v => v.status === 'active').length ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">In good standing</p>
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
                    ? Math.round(
                        vendorsData.data.reduce((acc, v) => acc + v.riskScore, 0) /
                          vendorsData.data.length
                      )
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Overall risk assessment</p>
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
                    ? Math.round(
                        vendorsData.data.reduce(
                          (acc, v) => acc + v.slaMetrics.onTimeDelivery,
                          0
                        ) / vendorsData.data.length
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">On-time delivery</p>
              </CardContent>
            </Card>
          </div>

          {/* Vendor List Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor List</CardTitle>
              <CardDescription>View and manage all registered vendors</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
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
                              <div className="text-sm text-muted-foreground">{vendor.taxId}</div>
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
                          <TableCell>{getStatusBadge(vendor.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleEditClick(vendor)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewDocuments(vendor)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Documents
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setVendorToDelete(vendor)}
                                >
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

          {/* Add Vendor Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
                <DialogDescription>
                  Enter the vendor information to add them to your vendor list
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={newVendor.name}
                      onChange={(e) =>
                        setNewVendor((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID *</Label>
                    <Input
                      id="taxId"
                      value={newVendor.taxId}
                      onChange={(e) =>
                        setNewVendor((prev) => ({ ...prev, taxId: e.target.value }))
                      }
                      placeholder="Enter tax ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={newVendor.registrationNumber}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          registrationNumber: e.target.value,
                        }))
                      }
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newVendor.status}
                      onValueChange={(value: Vendor['status']) =>
                        setNewVendor((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="blacklisted">Blacklisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <Label>Address</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={newVendor.address.street}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            address: { ...prev.address, street: e.target.value },
                          }))
                        }
                        placeholder="Enter street address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newVendor.address.city}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }))
                        }
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newVendor.address.state}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            address: { ...prev.address, state: e.target.value },
                          }))
                        }
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newVendor.address.country}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            address: { ...prev.address, country: e.target.value },
                          }))
                        }
                        placeholder="Enter country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={newVendor.address.zipCode}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            address: { ...prev.address, zipCode: e.target.value },
                          }))
                        }
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <Label>Contact Information</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        value={newVendor.contact.name}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, name: e.target.value },
                          }))
                        }
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newVendor.contact.email}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, email: e.target.value },
                          }))
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newVendor.contact.phone}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, phone: e.target.value },
                          }))
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label htmlFor="categories">Categories</Label>
                  <Textarea
                    id="categories"
                    value={newVendor.categories.join(', ')}
                    onChange={(e) =>
                      setNewVendor((prev) => ({
                        ...prev,
                        categories: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter((s) => s),
                      }))
                    }
                    placeholder="Enter categories separated by commas (e.g., Electronics, Software, Hardware)"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVendor} disabled={isAddDisabled}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vendor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Vendor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Vendor</DialogTitle>
              <DialogDescription>
                Update vendor information for {selectedVendor?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Company Name *</Label>
                  <Input
                    id="edit-name"
                    value={newVendor.name}
                    onChange={(e) =>
                      setNewVendor((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-taxId">Tax ID *</Label>
                  <Input
                    id="edit-taxId"
                    value={newVendor.taxId}
                    onChange={(e) =>
                      setNewVendor((prev) => ({ ...prev, taxId: e.target.value }))
                    }
                    placeholder="Enter tax ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-registrationNumber">Registration Number</Label>
                  <Input
                    id="edit-registrationNumber"
                    value={newVendor.registrationNumber}
                    onChange={(e) =>
                      setNewVendor((prev) => ({
                        ...prev,
                        registrationNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter registration number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={newVendor.status}
                    onValueChange={(value: Vendor['status']) =>
                      setNewVendor((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="blacklisted">Blacklisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <Label>Address</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="edit-street">Street Address</Label>
                    <Input
                      id="edit-street"
                      value={newVendor.address.street}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value },
                        }))
                      }
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={newVendor.address.city}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value },
                        }))
                      }
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-state">State</Label>
                    <Input
                      id="edit-state"
                      value={newVendor.address.state}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value },
                        }))
                      }
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-country">Country</Label>
                    <Input
                      id="edit-country"
                      value={newVendor.address.country}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          address: { ...prev.address, country: e.target.value },
                        }))
                      }
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-zipCode">ZIP Code</Label>
                    <Input
                      id="edit-zipCode"
                      value={newVendor.address.zipCode}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          address: { ...prev.address, zipCode: e.target.value },
                        }))
                      }
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <Label>Contact Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-contactName">Contact Name</Label>
                    <Input
                      id="edit-contactName"
                      value={newVendor.contact.name}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, name: e.target.value },
                        }))
                      }
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={newVendor.contact.email}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value },
                        }))
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={newVendor.contact.phone}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value },
                        }))
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label htmlFor="edit-categories">Categories</Label>
                <Textarea
                  id="edit-categories"
                  value={newVendor.categories.join(', ')}
                  onChange={(e) =>
                    setNewVendor((prev) => ({
                      ...prev,
                      categories: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s),
                    }))
                  }
                  placeholder="Enter categories separated by commas (e.g., Electronics, Software, Hardware)"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditVendor} disabled={isAddDisabled}>
                <Edit className="w-4 h-4 mr-2" />
                Update Vendor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Documents Dialog */}
        <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vendor Documents</DialogTitle>
              <DialogDescription>
                Compliance and verification documents for {selectedVendor?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedVendor && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {selectedVendor.complianceDocs && selectedVendor.complianceDocs.length > 0 ? (
                    selectedVendor.complianceDocs.map((doc, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-8 h-8 text-blue-500" />
                              <div>
                                <p className="font-medium">{doc.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Document
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No documents available</p>
                      <p className="text-sm">Compliance documents will appear here once uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDocumentsDialogOpen(false)}>
                Close
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!vendorToDelete} onOpenChange={() => setVendorToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Vendor</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {vendorToDelete?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800">Warning</p>
                    <p className="text-sm text-red-600">
                      Deleting this vendor will permanently remove all associated data including:
                    </p>
                    <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
                      <li>Vendor information and contact details</li>
                      <li>Compliance documents</li>
                      <li>Performance metrics and history</li>
                      <li>Related purchase orders and transactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setVendorToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteVendor}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Vendor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Vendor Details Dialog */}
        <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                      <p>
                        {selectedVendor.address.city}, {selectedVendor.address.state}{' '}
                        {selectedVendor.address.zipCode}
                      </p>
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
