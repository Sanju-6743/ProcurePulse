'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Paperclip
} from 'lucide-react';

export default function RequisitionsPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingApprovals: 0,
    approved: 0,
    totalValue: 0,
    requisitions: [],
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [recentRequisitions, setRecentRequisitions] = useState([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch real-time stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/requisitions/stats');
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch requisition stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      subClient: '',
      state: '',
      denomination: '',
      quantity: '',
      convenience: '',
      vendor: '',
      remarks: '',
    },
  });

  // Calculate amounts
  const calculateTotalStampDuty = () => {
    const denomination = parseFloat(form.watch('denomination')) || 0;
    const quantity = parseFloat(form.watch('quantity')) || 0;
    return denomination * quantity;
  };

  const calculateTotalConv = () => {
    const convenience = parseFloat(form.watch('convenience')) || 0;
    const quantity = parseFloat(form.watch('quantity')) || 0;
    return convenience * quantity;
  };

  const calculateTotalAmount = () => {
    return calculateTotalStampDuty() + calculateTotalConv();
  };

  const handleNewRequisition = () => {
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      // Calculate total amount before submitting
      const totalAmount = calculateTotalAmount();

      const submissionData = {
        ...data,
        totalAmount,
        totalStampDuty: calculateTotalStampDuty(),
        totalConvenience: calculateTotalConv(),
      };

      const response = await fetch('/api/requisitions/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Requisition Submitted Successfully",
          description: "Your requisition has been submitted and is now pending approval.",
        });

        // Add notification for admins
        const newNotification = {
          id: Date.now(),
          type: 'requisition_submitted',
          title: 'New Requisition Submitted',
          message: `A new requisition for ${data.clientName} has been submitted for approval.`,
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);

        setIsDialogOpen(false);
        form.reset();

        // Refresh stats after creating new requisition
        const statsResponse = await fetch('/api/requisitions/stats');
        const statsResult = await statsResponse.json();
        if (statsResult.success) {
          setStats(statsResult.data);
          setRecentRequisitions(statsResult.data.requisitions || []);
        }
      } else {
        toast({
          title: "Submission Failed",
          description: result.message || "Failed to submit requisition. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to submit requisition:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit requisition. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthGuard requiredRoles={['requester', 'buyer', 'approver', 'admin', 'auditor']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Admin Notifications */}
          {notifications.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Notifications ({notifications.filter(n => !n.read).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notification: any) => (
                    <div key={notification.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setNotifications(prev =>
                            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                          );
                        }}
                      >
                        Mark Read
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Requisitions</h1>
              <p className="text-muted-foreground">
                Create and manage purchase requests with approval workflows
              </p>
            </div>
            <Button onClick={handleNewRequisition}>
              <Plus className="w-4 h-4 mr-2" />
              New Requisition
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : stats.totalRequests}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active requisitions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : stats.pendingApprovals}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : stats.approved}
                </div>
                <p className="text-xs text-muted-foreground">
                  Approved requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : `$${stats.totalValue.toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  In approved requests
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Requisition Management</CardTitle>
              <CardDescription>
                Create, track, and manage purchase requisitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    placeholder="Search requisitions by title, requester, or status..."
                    className="pl-10 w-full h-10 px-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {recentRequisitions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Requisitions</h3>
                  <div className="space-y-2">
                    {recentRequisitions.map((req: any) => (
                      <Card key={req.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{req.clientName}</h4>
                              <Badge
                                variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}
                              >
                                {req.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {req.vendor} • ${req.totalAmount?.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${req.totalAmount?.toLocaleString() || '0'}</p>
                            <p className="text-xs text-muted-foreground">{req.state}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Requisitions Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first requisition to get started with the approval workflow.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Requisition Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Requisition</DialogTitle>
                <DialogDescription>
                  Fill in the details below to submit a new purchase requisition for approval.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      rules={{ required: "Date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientName"
                      rules={{ required: "Client Name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client name..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subClient"
                      rules={{ required: "Sub Client is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub Client</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter sub client..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                              <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                              <SelectItem value="assam">Assam</SelectItem>
                              <SelectItem value="bihar">Bihar</SelectItem>
                              <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                              <SelectItem value="goa">Goa</SelectItem>
                              <SelectItem value="gujarat">Gujarat</SelectItem>
                              <SelectItem value="haryana">Haryana</SelectItem>
                              <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                              <SelectItem value="jharkhand">Jharkhand</SelectItem>
                              <SelectItem value="karnataka">Karnataka</SelectItem>
                              <SelectItem value="kerala">Kerala</SelectItem>
                              <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                              <SelectItem value="maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="manipur">Manipur</SelectItem>
                              <SelectItem value="meghalaya">Meghalaya</SelectItem>
                              <SelectItem value="mizoram">Mizoram</SelectItem>
                              <SelectItem value="nagaland">Nagaland</SelectItem>
                              <SelectItem value="odisha">Odisha</SelectItem>
                              <SelectItem value="punjab">Punjab</SelectItem>
                              <SelectItem value="rajasthan">Rajasthan</SelectItem>
                              <SelectItem value="sikkim">Sikkim</SelectItem>
                              <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                              <SelectItem value="telangana">Telangana</SelectItem>
                              <SelectItem value="tripura">Tripura</SelectItem>
                              <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                              <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                              <SelectItem value="west-bengal">West Bengal</SelectItem>
                              <SelectItem value="delhi">Delhi</SelectItem>
                              <SelectItem value="jammu-kashmir">Jammu and Kashmir</SelectItem>
                              <SelectItem value="ladakh">Ladakh</SelectItem>
                              <SelectItem value="puducherry">Puducherry</SelectItem>
                              <SelectItem value="chandigarh">Chandigarh</SelectItem>
                              <SelectItem value="andaman-nicobar">Andaman and Nicobar Islands</SelectItem>
                              <SelectItem value="dadra-nagar-haveli-daman-diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                              <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="denomination"
                      rules={{ required: "Denomination is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Denomination</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      rules={{ required: "Quantity is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Total Stamp Duty</FormLabel>
                      <Input
                        type="number"
                        value={calculateTotalStampDuty().toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="convenience"
                      rules={{ required: "Convenience is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Convenience</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Total Convenience</FormLabel>
                      <Input
                        type="number"
                        value={calculateTotalConv().toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div>
                      <FormLabel>Total Amount</FormLabel>
                      <Input
                        type="number"
                        value={calculateTotalAmount().toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="vendor"
                    rules={{ required: "Vendor is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter vendor name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter remarks..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Requisition</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
