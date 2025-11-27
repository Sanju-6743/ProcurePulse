// Core Types
export type ID = string;
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';
export type Status = 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'suspended' | 'closed';

// User Types
export type UserRole = 'requester' | 'buyer' | 'approver' | 'vendor' | 'finance' | 'admin' | 'auditor';

export interface User {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  costCenterId?: ID;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Types
export interface Vendor {
  id: ID;
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
  bankDetails: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    swiftCode?: string;
  };
  complianceDocs: {
    type: string;
    url: string;
    expiryDate?: Date;
  }[];
  riskScore: number; // 0-100
  slaMetrics: {
    onTimeDelivery: number;
    qualityScore: number;
    responsiveness: number;
  };
  status: 'active' | 'suspended' | 'pending' | 'blacklisted';
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: ID;
  sku: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  uom: string; // Unit of Measure
  specifications: Record<string, any>;
  images: string[];
  priceTiers: {
    minQuantity: number;
    unitPrice: number;
    currency: Currency;
    vendorId?: ID;
    effectiveDate: Date;
    expiryDate?: Date;
  }[];
  preferredVendors: ID[];
  leadTimeDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Budget Types
export interface Budget {
  id: ID;
  costCenterId: ID;
  periodStart: Date;
  periodEnd: Date;
  currency: Currency;
  totalAmount: number;
  consumedAmount: number;
  encumberedAmount: number;
  availableAmount: number;
  tolerancePercentage: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostCenter {
  id: ID;
  code: string;
  name: string;
  description?: string;
  ownerId: ID;
  parentCostCenterId?: ID;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Requisition Types
export interface Requisition {
  id: ID;
  requesterId: ID;
  costCenterId: ID;
  title: string;
  justification: string;
  currency: Currency;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedDeliveryDate: Date;
  totalAmount: number;
  approvals: Approval[];
  lines: RequisitionLine[];
  attachments: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RequisitionLine {
  id: ID;
  productId?: ID;
  description: string;
  quantity: number;
  uom: string;
  estimatedUnitPrice: number;
  totalAmount: number;
  neededBy: Date;
  specifications?: Record<string, any>;
}

// RFQ Types
export interface RFQ {
  id: ID;
  requisitionId?: ID;
  title: string;
  description: string;
  ownerId: ID;
  invitedVendors: ID[];
  openAt: Date;
  closeAt: Date;
  status: 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';
  bids: Bid[];
  questions: {
    id: ID;
    vendorId: ID;
    question: string;
    answer?: string;
    askedAt: Date;
    answeredAt?: Date;
  }[];
  terms: {
    paymentTerms: string;
    deliveryTerms: string;
    warranty: string;
    other?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Bid {
  id: ID;
  rfqId: ID;
  vendorId: ID;
  unitPrice: number;
  totalPrice: number;
  leadTimeDays: number;
  notes: string;
  attachments: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  terms: {
    paymentTerms?: string;
    deliveryTerms?: string;
    warranty?: string;
  };
  status: 'submitted' | 'withdrawn' | 'winner' | 'rejected';
  submittedAt: Date;
  evaluatedAt?: Date;
  evaluationNotes?: string;
}

// Purchase Order Types
export interface PurchaseOrder {
  id: ID;
  rfqId?: ID;
  vendorId: ID;
  buyerId: ID;
  poNumber: string;
  currency: Currency;
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'closed' | 'cancelled';
  terms: {
    paymentTerms: string;
    deliveryTerms: string;
    shippingMethod: string;
    freightTerms: string;
  };
  lines: POLine[];
  totals: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    freightAmount: number;
    totalAmount: number;
  };
  approvals: Approval[];
  changeOrders: ChangeOrder[];
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  confirmedAt?: Date;
  closedAt?: Date;
}

export interface POLine {
  id: ID;
  productId?: ID;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  taxPercentage: number;
  discountPercentage: number;
  totalAmount: number;
  deliverySchedule: {
    quantity: number;
    deliveryDate: Date;
  }[];
}

export interface ChangeOrder {
  id: ID;
  poId: ID;
  version: number;
  description: string;
  changes: {
    type: 'add' | 'modify' | 'remove';
    lineId?: ID;
    before?: any;
    after?: any;
  }[];
  reason: string;
  requestedBy: ID;
  approvedBy?: ID;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Goods Receipt Types
export interface GoodsReceiptNote {
  id: ID;
  poId: ID;
  grnNumber: string;
  receiverId: ID;
  receivedAt: Date;
  status: 'draft' | 'posted' | 'qa_passed' | 'qa_failed' | 'cancelled';
  lines: GRNLine[];
  qaStatus: 'pending' | 'passed' | 'failed';
  qaNotes?: string;
  qaBy?: ID;
  qaAt?: Date;
  warehouseLocation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GRNLine {
  id: ID;
  poLineId: ID;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  lotSerial?: string;
  expiryDate?: Date;
  notes?: string;
  qaStatus: 'pending' | 'passed' | 'failed';
  rejectionReason?: string;
}

// Invoice Types
export interface Invoice {
  id: ID;
  vendorId: ID;
  poId?: ID;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: Currency;
  status: 'draft' | 'received' | 'validated' | 'matched' | 'exception' | 'approved' | 'paid' | 'disputed';
  lines: InvoiceLine[];
  totals: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
  };
  matchResult?: MatchResult;
  exceptions: InvoiceException[];
  attachments: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLine {
  id: ID;
  poLineId?: ID;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  taxPercentage: number;
  discountPercentage: number;
  totalAmount: number;
}

export interface MatchResult {
  status: 'matched' | 'partial_match' | 'no_match';
  variances: {
    type: 'price' | 'quantity' | 'tax' | 'discount';
    varianceAmount: number;
    variancePercentage: number;
    thresholdExceeded: boolean;
  }[];
  matchedAt: Date;
  matchedBy: ID;
}

export interface InvoiceException {
  id: ID;
  invoiceId: ID;
  type: 'price_variance' | 'quantity_variance' | 'missing_po' | 'duplicate_invoice' | 'terms_mismatch' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'waived';
  resolution?: string;
  resolvedBy?: ID;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface Payment {
  id: ID;
  invoiceId: ID;
  paymentNumber: string;
  amount: number;
  currency: Currency;
  method: 'check' | 'wire' | 'ach' | 'credit_card';
  status: 'pending' | 'processed' | 'failed' | 'cancelled';
  paidAt?: Date;
  processedBy?: ID;
  remittanceRef?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Approval Types
export interface Approval {
  id: ID;
  entityType: 'requisition' | 'rfq' | 'po' | 'change_order' | 'invoice' | 'budget';
  entityId: ID;
  approverId: ID;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  dueAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Audit Types
export interface AuditLog {
  id: ID;
  actorId: ID;
  action: string;
  entityType: string;
  entityId: ID;
  before?: any;
  after?: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Notification Types
export interface Notification {
  id: ID;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'approval' | 'exception' | 'system' | 'collaboration' | 'deadline';
  title: string;
  message: string;
  entityType?: string;
  entityId?: ID;
  userId: ID;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  actions?: {
    label: string;
    action: string;
    url?: string;
  }[];
}

// Search Types
export interface SearchResult {
  type: 'vendor' | 'product' | 'requisition' | 'rfq' | 'po' | 'grn' | 'invoice' | 'payment';
  id: ID;
  title: string;
  description: string;
  relevanceScore: number;
  highlights: string[];
  url: string;
  metadata: Record<string, any>;
}

export interface SearchFilter {
  type?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  category?: string;
  vendor?: string;
  owner?: string;
}

// Dashboard Types
export interface DashboardWidget {
  id: ID;
  type: 'metric' | 'chart' | 'table' | 'list';
  title: string;
  config: any;
  position: { x: number; y: number; width: number; height: number };
  isVisible: boolean;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  unit?: string;
  change: number;
  changeType: 'increase' | 'decrease';
  target?: number;
  period: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
  timestamp: Date;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'file' | 'checkbox' | 'radio';
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

export interface FormConfig {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel: string;
  cancelLabel?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}