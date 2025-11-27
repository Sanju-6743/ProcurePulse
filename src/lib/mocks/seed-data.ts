import { v4 as uuidv4 } from 'uuid';
import type {
  Vendor,
  Product,
  Budget,
  CostCenter,
  Requisition,
  RFQ,
  PurchaseOrder,
  GoodsReceiptNote,
  Invoice,
  Payment,
  User,
  Approval,
  AuditLog,
  Notification,
} from '@/lib/types';

// Utility functions
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min: number, max: number, decimals = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

// User Generator
export const generateUsers = (count: number): User[] => {
  const roles: User['role'][] = ['requester', 'buyer', 'approver', 'vendor', 'finance', 'admin', 'auditor'];
  const departments = ['IT', 'Finance', 'Operations', 'HR', 'Procurement', 'Marketing'];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emma', 'William', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const users: User[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    
    users.push({
      id: uuidv4(),
      name: `${firstName} ${lastName}`,
      email,
      role: randomElement(roles),
      department: randomElement(departments),
      isActive: Math.random() > 0.1,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return users;
};

// Vendor Generator
export const generateVendors = (count: number): Vendor[] => {
  const vendorNames = [
    'TechCorp Solutions', 'Global Supplies Inc', 'Office Depot Pro', 'Industrial Equipment Ltd',
    'Software Dynamics', 'Hardware Warehouse', 'Consulting Partners', 'Logistics Plus',
    'Manufacturing Co', 'Service Providers Inc', 'Digital Solutions', 'Raw Materials Corp',
    'Packaging Experts', 'Transport Services', 'IT Infrastructure', 'Safety Equipment Co',
    'Cleaning Supplies', 'Marketing Agency', 'Legal Services', 'Accounting Partners',
    'Cloud Services Inc', 'Network Solutions', 'Data Systems', 'CyberSec Pro',
    'Office Furniture Co', 'Electronics Depot', 'Medical Supplies', 'Construction Materials',
    'Food Services', 'Facility Management'
  ];
  
  const cities = ['New York', 'London', 'Tokyo', 'Mumbai', 'Singapore', 'Sydney', 'Toronto', 'Berlin'];
  const countries = ['USA', 'UK', 'Japan', 'India', 'Singapore', 'Australia', 'Canada', 'Germany'];
  const categories = [
    ['IT', 'Software', 'Hardware'],
    ['Office', 'Supplies', 'Furniture'],
    ['Industrial', 'Manufacturing', 'Equipment'],
    ['Consulting', 'Services', 'Professional'],
    ['Logistics', 'Transport', 'Shipping'],
    ['Raw Materials', 'Components', 'Parts'],
    ['Safety', 'Compliance', 'Equipment'],
    ['Marketing', 'Advertising', 'Design']
  ];
  
  const vendors: Vendor[] = [];
  
  for (let i = 0; i < count; i++) {
    const cityIndex = i % cities.length;
    const categoryIndex = i % categories.length;
    
    vendors.push({
      id: uuidv4(),
      name: vendorNames[i] || `Vendor ${i + 1}`,
      taxId: `TAX${1000 + i}`,
      registrationNumber: `REG${2000 + i}`,
      address: {
        street: `${100 + i} Business Ave`,
        city: cities[cityIndex],
        state: ['NY', 'ENG', 'Kanto', 'MH', 'SG', 'NSW', 'ON', 'BER'][cityIndex],
        country: countries[cityIndex],
        zipCode: `${10000 + i}`,
      },
      contact: {
        name: `Contact ${i + 1}`,
        email: `contact${i + 1}@vendor${i + 1}.com`,
        phone: `+1-${555 + i}-${1000 + i}`,
      },
      bankDetails: {
        bankName: `Bank ${i + 1}`,
        accountNumber: `ACC${1000000 + i}`,
        routingNumber: `RTN${10000000 + i}`,
        swiftCode: `SWIFT${i}`,
      },
      complianceDocs: [
        {
          type: 'Business License',
          url: `/docs/vendor${i + 1}/license.pdf`,
          expiryDate: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
        },
        {
          type: 'Insurance Certificate',
          url: `/docs/vendor${i + 1}/insurance.pdf`,
          expiryDate: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
        }
      ],
      riskScore: randomInt(1, 100),
      slaMetrics: {
        onTimeDelivery: randomInt(70, 100),
        qualityScore: randomInt(75, 100),
        responsiveness: randomInt(65, 100),
      },
      status: randomElement(['active', 'active', 'active', 'suspended', 'pending']),
      categories: categories[categoryIndex],
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return vendors;
};

// Product Generator
export const generateProducts = (count: number, vendors: Vendor[]): Product[] => {
  const categories = [
    'IT Equipment', 'Office Supplies', 'Industrial Equipment', 'Software Licenses',
    'Professional Services', 'Raw Materials', 'Safety Equipment', 'Marketing Services',
    'Legal Services', 'Accounting Services', 'Facility Management', 'Transportation'
  ];
  
  const productTemplates = [
    { name: 'Laptop Computer', uom: 'Each', basePrice: 1200 },
    { name: 'Office Chair', uom: 'Each', basePrice: 250 },
    { name: 'Printer', uom: 'Each', basePrice: 300 },
    { name: 'Monitor', uom: 'Each', basePrice: 400 },
    { name: 'Keyboard', uom: 'Each', basePrice: 50 },
    { name: 'Mouse', uom: 'Each', basePrice: 25 },
    { name: 'Desk', uom: 'Each', basePrice: 500 },
    { name: 'Software License', uom: 'License', basePrice: 100 },
    { name: 'Consulting Hours', uom: 'Hour', basePrice: 150 },
    { name: 'Industrial Machine', uom: 'Each', basePrice: 50000 },
    { name: 'Safety Helmet', uom: 'Each', basePrice: 45 },
    { name: 'Cleaning Supplies', uom: 'Case', basePrice: 75 },
    { name: 'Marketing Campaign', uom: 'Project', basePrice: 5000 },
    { name: 'Legal Contract Review', uom: 'Hour', basePrice: 200 },
    { name: 'Financial Audit', uom: 'Project', basePrice: 10000 },
    { name: 'Facility Maintenance', uom: 'Month', basePrice: 2000 },
    { name: 'Shipping Service', uom: 'Shipment', basePrice: 100 },
    { name: 'Raw Material A', uom: 'Kg', basePrice: 10 },
    { name: 'Component B', uom: 'Piece', basePrice: 5 },
    { name: 'Tool Set', uom: 'Set', basePrice: 150 }
  ];
  
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = productTemplates[i % productTemplates.length];
    const category = categories[i % categories.length];
    const vendor = randomElement(vendors);
    
    products.push({
      id: uuidv4(),
      sku: `SKU${10000 + i}`,
      name: `${template.name} ${Math.floor(i / productTemplates.length) + 1}`,
      description: `High-quality ${template.name.toLowerCase()} for business use`,
      category,
      subCategory: `${category} Sub`,
      uom: template.uom,
      specifications: {
        weight: randomFloat(0.1, 100, 2),
        dimensions: `${randomInt(1, 100)}x${randomInt(1, 100)}x${randomInt(1, 100)}`,
        color: randomElement(['Black', 'White', 'Gray', 'Blue', 'Red']),
        material: randomElement(['Plastic', 'Metal', 'Wood', 'Composite']),
      },
      images: [`/images/product${i + 1}.jpg`],
      priceTiers: [
        {
          minQuantity: 1,
          unitPrice: template.basePrice * randomFloat(0.8, 1.5),
          currency: 'USD',
          vendorId: vendor.id,
          effectiveDate: randomDate(new Date(2023, 0, 1), new Date()),
          expiryDate: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
        },
        {
          minQuantity: 10,
          unitPrice: template.basePrice * randomFloat(0.7, 1.2),
          currency: 'USD',
          vendorId: vendor.id,
          effectiveDate: randomDate(new Date(2023, 0, 1), new Date()),
          expiryDate: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
        }
      ],
      preferredVendors: [vendor.id],
      leadTimeDays: randomInt(1, 30),
      isActive: Math.random() > 0.1,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return products;
};

// Cost Center Generator
export const generateCostCenters = (count: number, users: User[]): CostCenter[] => {
  const costCenterNames = [
    'IT Department', 'Finance Department', 'Operations', 'Human Resources',
    'Marketing', 'Sales', 'Research & Development', 'Customer Service',
    'Facilities', 'Legal', 'Procurement', 'Quality Assurance',
    'Production', 'Logistics', 'Administration', 'Training'
  ];
  
  const costCenters: CostCenter[] = [];
  
  for (let i = 0; i < count; i++) {
    const owner = randomElement(users.filter(u => u.role === 'approver' || u.role === 'admin'));
    
    costCenters.push({
      id: uuidv4(),
      code: `CC${100 + i}`,
      name: costCenterNames[i] || `Cost Center ${i + 1}`,
      description: `Budget allocation for ${costCenterNames[i]?.toLowerCase() || 'department'}`,
      ownerId: owner.id,
      parentCostCenterId: i > 3 ? costCenters[0]?.id : undefined,
      isActive: Math.random() > 0.1,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return costCenters;
};

// Budget Generator
export const generateBudgets = (count: number, costCenters: CostCenter[]): Budget[] => {
  const budgets: Budget[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    const costCenter = randomElement(costCenters);
    const year = currentYear - (i % 3); // Current year and 2 previous years
    const quarter = (i % 4) + 1;
    const totalAmount = randomInt(50000, 500000);
    const consumedAmount = randomInt(0, Math.floor(totalAmount * 0.9));
    const encumberedAmount = randomInt(0, Math.floor((totalAmount - consumedAmount) * 0.5));
    
    budgets.push({
      id: uuidv4(),
      costCenterId: costCenter.id,
      periodStart: new Date(year, (quarter - 1) * 3, 1),
      periodEnd: new Date(year, quarter * 3, 0),
      currency: 'USD',
      totalAmount,
      consumedAmount,
      encumberedAmount,
      availableAmount: totalAmount - consumedAmount - encumberedAmount,
      tolerancePercentage: randomInt(5, 20),
      status: randomElement(['active', 'active', 'closed']),
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return budgets;
};

// Requisition Generator
export const generateRequisitions = (count: number, users: User[], costCenters: CostCenter[], products: Product[]): Requisition[] => {
  const requisitions: Requisition[] = [];
  const justifications = [
    'Office equipment upgrade needed',
    'New hire setup requirements',
    'Project materials needed',
    'Emergency replacement required',
    'Quarterly supplies restock',
    'Expansion project materials',
    'Maintenance and repair supplies',
    'Training materials needed',
    'Client presentation materials',
    'Safety equipment compliance'
  ];
  
  for (let i = 0; i < count; i++) {
    const requester = randomElement(users.filter(u => u.role === 'requester'));
    const costCenter = randomElement(costCenters);
    const status = randomElement(['draft', 'submitted', 'under_review', 'approved', 'rejected']);
    const priority = randomElement(['low', 'medium', 'high', 'urgent']);
    
    // Generate requisition lines
    const lineCount = randomInt(1, 5);
    const lines = [];
    let totalAmount = 0;
    
    for (let j = 0; j < lineCount; j++) {
      const product = randomElement(products);
      const quantity = randomInt(1, 10);
      const estimatedUnitPrice = product.priceTiers[0]?.unitPrice || randomFloat(10, 1000);
      const lineTotal = quantity * estimatedUnitPrice;
      
      lines.push({
        id: uuidv4(),
        productId: product.id,
        description: product.name,
        quantity,
        uom: product.uom,
        estimatedUnitPrice,
        totalAmount: lineTotal,
        neededBy: randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
      });
      
      totalAmount += lineTotal;
    }
    
    // Generate approvals
    const approvals: Approval[] = [];
    if (status !== 'draft') {
      const approver = randomElement(users.filter(u => u.role === 'approver'));
      approvals.push({
        id: uuidv4(),
        entityType: 'requisition',
        entityId: '', // Will be set after requisition creation
        approverId: approver.id,
        level: 1,
        status: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending',
        comments: status === 'rejected' ? 'Budget constraints' : undefined,
        dueAt: randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        approvedAt: status === 'approved' ? new Date() : undefined,
        rejectedAt: status === 'rejected' ? new Date() : undefined,
        createdAt: randomDate(new Date(2023, 0, 1), new Date()),
        updatedAt: new Date(),
      });
    }
    
    requisitions.push({
      id: uuidv4(),
      requesterId: requester.id,
      costCenterId: costCenter.id,
      title: `${randomElement(justifications)} - ${new Date().toLocaleDateString()}`,
      justification: randomElement(justifications),
      currency: 'USD',
      status,
      priority,
      requestedDeliveryDate: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      totalAmount,
      approvals,
      lines,
      attachments: [],
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return requisitions;
};

// RFQ Generator
export const generateRFQs = (count: number, users: User[], requisitions: Requisition[], vendors: Vendor[]): RFQ[] => {
  const rfqs: RFQ[] = [];
  
  for (let i = 0; i < count; i++) {
    const owner = randomElement(users.filter(u => u.role === 'buyer'));
    const requisition = randomElement(requisitions);
    const status = randomElement(['draft', 'published', 'closed', 'awarded', 'cancelled']);
    
    // Invite 3-5 vendors
    const invitedVendors: string[] = [];
    const vendorCount = randomInt(3, 5);
    const availableVendors = vendors.filter(v => v.status === 'active');
    
    for (let j = 0; j < vendorCount && j < availableVendors.length; j++) {
      const vendor = availableVendors[j];
      if (!invitedVendors.includes(vendor.id)) {
        invitedVendors.push(vendor.id);
      }
    }
    
    rfqs.push({
      id: uuidv4(),
      requisitionId: requisition.id,
      title: `RFQ for ${requisition.title}`,
      description: `Request for quotation for items specified in requisition ${requisition.id}`,
      ownerId: owner.id,
      invitedVendors,
      openAt: randomDate(new Date(2023, 0, 1), new Date()),
      closeAt: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      status,
      bids: [], // Will be generated separately
      questions: [],
      terms: {
        paymentTerms: 'Net 30 days',
        deliveryTerms: 'FOB Destination',
        warranty: '12 months manufacturer warranty',
        other: 'All prices must include shipping and handling'
      },
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return rfqs;
};

// Purchase Order Generator
export const generatePurchaseOrders = (count: number, users: User[], vendors: Vendor[], rfqs: RFQ[]): PurchaseOrder[] => {
  const purchaseOrders: PurchaseOrder[] = [];
  
  for (let i = 0; i < count; i++) {
    const buyer = randomElement(users.filter(u => u.role === 'buyer'));
    const vendor = randomElement(vendors.filter(v => v.status === 'active'));
    const rfq = randomElement(rfqs);
    const status = randomElement(['draft', 'sent', 'confirmed', 'partially_received', 'received', 'closed', 'cancelled']);
    
    // Generate PO lines based on RFQ or create generic lines
    const lineCount = randomInt(1, 5);
    const lines = [];
    let subtotal = 0;
    
    for (let j = 0; j < lineCount; j++) {
      const unitPrice = randomFloat(50, 2000);
      const quantity = randomInt(1, 10);
      const taxPercentage = randomInt(0, 10);
      const discountPercentage = randomInt(0, 15);
      const lineTotal = quantity * unitPrice * (1 + taxPercentage / 100) * (1 - discountPercentage / 100);
      
      lines.push({
        id: uuidv4(),
        description: `Product/Service ${j + 1}`,
        quantity,
        uom: randomElement(['Each', 'Box', 'Hour', 'License']),
        unitPrice,
        taxPercentage,
        discountPercentage,
        totalAmount: lineTotal,
        deliverySchedule: [
          {
            quantity,
            deliveryDate: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
          }
        ],
      });
      
      subtotal += lineTotal;
    }
    
    const taxAmount = subtotal * 0.08; // 8% tax
    const discountAmount = subtotal * 0.05; // 5% discount
    const freightAmount = randomFloat(50, 500);
    const totalAmount = subtotal + taxAmount - discountAmount + freightAmount;
    
    purchaseOrders.push({
      id: uuidv4(),
      rfqId: rfq.id,
      vendorId: vendor.id,
      buyerId: buyer.id,
      poNumber: `PO-${2024}-${String(i + 1).padStart(4, '0')}`,
      currency: 'USD',
      status,
      terms: {
        paymentTerms: 'Net 30 days',
        deliveryTerms: 'FOB Destination',
        shippingMethod: 'Standard Ground',
        freightTerms: 'Prepaid',
      },
      lines,
      totals: {
        subtotal,
        taxAmount,
        discountAmount,
        freightAmount,
        totalAmount,
      },
      approvals: [],
      changeOrders: [],
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
      sentAt: status !== 'draft' ? randomDate(new Date(2023, 0, 1), new Date()) : undefined,
      confirmedAt: ['confirmed', 'partially_received', 'received', 'closed'].includes(status) 
        ? randomDate(new Date(2023, 0, 1), new Date()) 
        : undefined,
      closedAt: status === 'closed' ? new Date() : undefined,
    });
  }
  
  return purchaseOrders;
};

// Goods Receipt Note Generator
export const generateGRNs = (count: number, users: User[], purchaseOrders: PurchaseOrder[]): GoodsReceiptNote[] => {
  const grns: GoodsReceiptNote[] = [];
  
  for (let i = 0; i < count; i++) {
    const receiver = randomElement(users);
    const po = randomElement(purchaseOrders.filter(po => ['sent', 'confirmed', 'partially_received'].includes(po.status)));
    const status = randomElement(['draft', 'posted', 'qa_passed', 'qa_failed', 'cancelled']);
    
    // Generate GRN lines based on PO lines
    const lines = [];
    
    for (const poLine of po.lines) {
      const quantityReceived = randomInt(1, poLine.quantity);
      const quantityAccepted = status === 'qa_failed' ? 0 : quantityReceived;
      const quantityRejected = quantityReceived - quantityAccepted;
      
      lines.push({
        id: uuidv4(),
        poLineId: poLine.id,
        quantityReceived,
        quantityAccepted,
        quantityRejected,
        lotSerial: quantityRejected > 0 ? `LOT-${randomInt(1000, 9999)}` : undefined,
        notes: quantityRejected > 0 ? 'Damaged during shipping' : undefined,
        qaStatus: status === 'qa_failed' ? 'failed' : 'passed',
        rejectionReason: quantityRejected > 0 ? 'Quality issues' : undefined,
      });
    }
    
    grns.push({
      id: uuidv4(),
      poId: po.id,
      grnNumber: `GRN-${2024}-${String(i + 1).padStart(4, '0')}`,
      receiverId: receiver.id,
      receivedAt: randomDate(new Date(2023, 0, 1), new Date()),
      status,
      lines,
      qaStatus: status.includes('qa') ? status.replace('qa_', '') as 'passed' | 'failed' : 'pending',
      qaNotes: status === 'qa_failed' ? 'Failed quality inspection' : undefined,
      warehouseLocation: `WH-${randomInt(1, 10)}-${randomInt(1, 100)}`,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return grns;
};

// Invoice Generator
export const generateInvoices = (count: number, vendors: Vendor[], purchaseOrders: PurchaseOrder[]): Invoice[] => {
  const invoices: Invoice[] = [];
  
  for (let i = 0; i < count; i++) {
    const vendor = randomElement(vendors);
    const po = randomElement(purchaseOrders);
    const status = randomElement(['draft', 'received', 'validated', 'matched', 'exception', 'approved', 'paid', 'disputed']);
    
    // Generate invoice lines
    const lines = [];
    let subtotal = 0;
    
    for (let j = 0; j < po.lines.length; j++) {
      const poLine = po.lines[j];
      const unitPrice = poLine.unitPrice * randomFloat(0.95, 1.05); // Slight price variation
      const quantity = poLine.quantity;
      const taxPercentage = poLine.taxPercentage;
      const discountPercentage = poLine.discountPercentage;
      const lineTotal = quantity * unitPrice * (1 + taxPercentage / 100) * (1 - discountPercentage / 100);
      
      lines.push({
        id: uuidv4(),
        poLineId: poLine.id,
        description: poLine.description,
        quantity,
        uom: poLine.uom,
        unitPrice,
        taxPercentage,
        discountPercentage,
        totalAmount: lineTotal,
      });
      
      subtotal += lineTotal;
    }
    
    const taxAmount = subtotal * 0.08;
    const discountAmount = subtotal * 0.05;
    const totalAmount = subtotal + taxAmount - discountAmount;
    
    invoices.push({
      id: uuidv4(),
      vendorId: vendor.id,
      poId: po.id,
      invoiceNumber: `INV-${vendor.name.substring(0, 3).toUpperCase()}-${2024}-${String(i + 1).padStart(4, '0')}`,
      invoiceDate: randomDate(new Date(2023, 0, 1), new Date()),
      dueDate: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      currency: 'USD',
      status,
      lines,
      totals: {
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
      },
      exceptions: [],
      attachments: [],
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return invoices;
};

// Payment Generator
export const generatePayments = (count: number, invoices: Invoice[], users: User[]): Payment[] => {
  const payments: Payment[] = [];
  
  for (let i = 0; i < count; i++) {
    const invoice = randomElement(invoices.filter(inv => ['approved', 'paid'].includes(inv.status)));
    const method = randomElement(['check', 'wire', 'ach', 'credit_card']);
    const status = randomElement(['pending', 'processed', 'failed', 'cancelled']);
    
    payments.push({
      id: uuidv4(),
      invoiceId: invoice.id,
      paymentNumber: `PAY-${2024}-${String(i + 1).padStart(4, '0')}`,
      amount: invoice.totals.totalAmount,
      currency: 'USD',
      method,
      status,
      paidAt: status === 'processed' ? randomDate(new Date(2023, 0, 1), new Date()) : undefined,
      processedBy: status === 'processed' ? randomElement(users).id : undefined,
      remittanceRef: status === 'processed' ? `REF-${randomInt(100000, 999999)}` : undefined,
      notes: status === 'failed' ? 'Payment failed due to insufficient funds' : undefined,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  
  return payments;
};

// Main seed function
export const generateAllSeedData = () => {
  console.log('Generating seed data...');
  
  // Generate base entities
  const users = generateUsers(50);
  const vendors = generateVendors(30);
  const products = generateProducts(100, vendors);
  const costCenters = generateCostCenters(20, users);
  const budgets = generateBudgets(20, costCenters);
  
  // Generate transactional entities
  const requisitions = generateRequisitions(200, users, costCenters, products);
  const rfqs = generateRFQs(50, users, requisitions, vendors);
  const purchaseOrders = generatePurchaseOrders(150, users, vendors, rfqs);
  const grns = generateGRNs(200, users, purchaseOrders);
  const invoices = generateInvoices(300, vendors, purchaseOrders);
  const payments = generatePayments(150, invoices, users);
  
  console.log('Seed data generated successfully!');
  
  return {
    users,
    vendors,
    products,
    costCenters,
    budgets,
    requisitions,
    rfqs,
    purchaseOrders,
    grns,
    invoices,
    payments,
  };
};