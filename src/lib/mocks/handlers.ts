import { http } from 'msw';
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
  SearchResult,
  PaginatedResponse,
  ApiResponse,
} from '@/lib/types';

// Mock data generators
const generateMockVendors = (): Vendor[] => {
  const vendors: Vendor[] = [];
  const vendorNames = [
    'TechCorp Solutions',
    'Global Supplies Inc',
    'Office Depot Pro',
    'Industrial Equipment Ltd',
    'Software Dynamics',
    'Hardware Warehouse',
    'Consulting Partners',
    'Logistics Plus',
    'Manufacturing Co',
    'Service Providers Inc',
    'Digital Solutions',
    'Raw Materials Corp',
    'Packaging Experts',
    'Transport Services',
    'IT Infrastructure',
    'Safety Equipment Co',
    'Cleaning Supplies',
    'Marketing Agency',
    'Legal Services',
    'Accounting Partners',
  ];

  for (let i = 0; i < 20; i++) {
    vendors.push({
      id: uuidv4(),
      name: vendorNames[i],
      taxId: `TAX${1000 + i}`,
      registrationNumber: `REG${2000 + i}`,
      address: {
        street: `${100 + i} Business Ave`,
        city: ['New York', 'London', 'Tokyo', 'Mumbai'][i % 4],
        state: ['NY', 'ENG', 'Kanto', 'MH'][i % 4],
        country: ['USA', 'UK', 'Japan', 'India'][i % 4],
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
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      ],
      riskScore: Math.floor(Math.random() * 100),
      slaMetrics: {
        onTimeDelivery: 85 + Math.floor(Math.random() * 15),
        qualityScore: 90 + Math.floor(Math.random() * 10),
        responsiveness: 80 + Math.floor(Math.random() * 20),
      },
      status: ['active', 'active', 'active', 'suspended'][i % 4] as Vendor['status'],
      categories: [['IT', 'Software'], ['Office', 'Supplies'], ['Industrial'], ['Consulting']][i % 4],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }
  return vendors;
};

const generateMockProducts = (vendors: Vendor[]): Product[] => {
  const products: Product[] = [];
  const categories = ['IT Equipment', 'Office Supplies', 'Industrial', 'Software', 'Services'];
  const productNames = [
    'Laptop Computer',
    'Office Chair',
    'Printer',
    'Monitor',
    'Keyboard',
    'Mouse',
    'Desk',
    'Software License',
    'Consulting Hours',
    'Industrial Machine',
    'Safety Equipment',
    'Cleaning Supplies',
    'Marketing Services',
    'Legal Services',
    'Accounting Services',
  ];

  for (let i = 0; i < 100; i++) {
    const category = categories[i % categories.length];
    const vendor = vendors[i % vendors.length];
    
    products.push({
      id: uuidv4(),
      sku: `SKU${10000 + i}`,
      name: `${productNames[i % productNames.length]} ${i + 1}`,
      description: `High-quality ${productNames[i % productNames.length].toLowerCase()} for business use`,
      category,
      subCategory: `${category} Sub`,
      uom: ['Each', 'Box', 'Pack', 'Hour', 'License'][i % 5],
      specifications: {
        weight: Math.floor(Math.random() * 100) + 1,
        dimensions: `${Math.floor(Math.random() * 50) + 1}x${Math.floor(Math.random() * 50) + 1}x${Math.floor(Math.random() * 50) + 1}`,
      },
      images: [`/images/product${i + 1}.jpg`],
      priceTiers: [
        {
          minQuantity: 1,
          unitPrice: Math.floor(Math.random() * 1000) + 10,
          currency: 'USD',
          vendorId: vendor.id,
          effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      ],
      preferredVendors: [vendor.id],
      leadTimeDays: Math.floor(Math.random() * 30) + 1,
      isActive: Math.random() > 0.1,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }
  return products;
};

// In-memory storage
let mockVendors: Vendor[] = generateMockVendors();
let mockProducts: Product[] = generateMockProducts(mockVendors);
let mockBudgets: Budget[] = [];
let mockCostCenters: CostCenter[] = [];
let mockRequisitions: Requisition[] = [];
let mockRFQs: RFQ[] = [];
let mockPurchaseOrders: PurchaseOrder[] = [];
let mockGRNs: GoodsReceiptNote[] = [];
let mockInvoices: Invoice[] = [];
let mockPayments: Payment[] = [];
let mockUsers: User[] = [];

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getPaginatedResponse = <T>(data: T[], page: number, limit: number): PaginatedResponse<T> => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = data.slice(start, end);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
    success: true,
    timestamp: new Date(),
  };
};

// API Handlers
export const handlers = [
  // Vendors
  http.get('/api/vendors', async (req, res, ctx) => {
    await delay(300);
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    const search = req.url.searchParams.get('search') || '';
    
    let filteredVendors = mockVendors;
    if (search) {
      filteredVendors = mockVendors.filter(vendor =>
        vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        vendor.taxId.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(getPaginatedResponse(filteredVendors, page, limit))
    );
  }),

  http.get('/api/vendors/:id', async (req, res, ctx) => {
    await delay(200);
    const { id } = req.params;
    const vendor = mockVendors.find(v => v.id === id);
    
    if (!vendor) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Vendor not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        data: vendor,
        success: true,
        timestamp: new Date(),
      })
    );
  }),

  http.post('/api/vendors', async (req, res, ctx) => {
    await delay(500);
    const vendorData = await req.json();
    const newVendor: Vendor = {
      id: uuidv4(),
      ...vendorData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockVendors.push(newVendor);
    
    return res(
      ctx.status(201),
      ctx.json({
        data: newVendor,
        success: true,
        message: 'Vendor created successfully',
        timestamp: new Date(),
      })
    );
  }),

  http.put('/api/vendors/:id', async (req, res, ctx) => {
    await delay(500);
    const { id } = req.params;
    const vendorData = await req.json();
    
    const vendorIndex = mockVendors.findIndex(v => v.id === id);
    if (vendorIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Vendor not found' })
      );
    }
    
    mockVendors[vendorIndex] = {
      ...mockVendors[vendorIndex],
      ...vendorData,
      updatedAt: new Date(),
    };
    
    return res(
      ctx.status(200),
      ctx.json({
        data: mockVendors[vendorIndex],
        success: true,
        message: 'Vendor updated successfully',
        timestamp: new Date(),
      })
    );
  }),

  http.delete('/api/vendors/:id', async (req, res, ctx) => {
    await delay(300);
    const { id } = req.params;
    
    const vendorIndex = mockVendors.findIndex(v => v.id === id);
    if (vendorIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Vendor not found' })
      );
    }
    
    mockVendors.splice(vendorIndex, 1);
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Vendor deleted successfully',
        timestamp: new Date(),
      })
    );
  }),

  // Products
  http.get('/api/products', async (req, res, ctx) => {
    await delay(300);
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    const search = req.url.searchParams.get('search') || '';
    const category = req.url.searchParams.get('category') || '';
    
    let filteredProducts = mockProducts;
    if (search) {
      filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    return res(
      ctx.status(200),
      ctx.json(getPaginatedResponse(filteredProducts, page, limit))
    );
  }),

  http.get('/api/products/:id', async (req, res, ctx) => {
    await delay(200);
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Product not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        data: product,
        success: true,
        timestamp: new Date(),
      })
    );
  }),

  // Requisitions
  http.get('/api/requisitions', async (req, res, ctx) => {
    await delay(300);
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    const status = req.url.searchParams.get('status') || '';
    
    let filteredRequisitions = mockRequisitions;
    if (status) {
      filteredRequisitions = mockRequisitions.filter(req => req.status === status);
    }
    
    return res(
      ctx.status(200),
      ctx.json(getPaginatedResponse(filteredRequisitions, page, limit))
    );
  }),

  http.post('/api/requisitions', async (req, res, ctx) => {
    await delay(500);
    const requisitionData = await req.json();
    const newRequisition: Requisition = {
      id: uuidv4(),
      ...requisitionData,
      approvals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockRequisitions.push(newRequisition);
    
    return res(
      ctx.status(201),
      ctx.json({
        data: newRequisition,
        success: true,
        message: 'Requisition created successfully',
        timestamp: new Date(),
      })
    );
  }),

  http.post('/api/requisitions/:id/submit', async (req, res, ctx) => {
    await delay(500);
    const { id } = req.params;
    
    const requisition = mockRequisitions.find(r => r.id === id);
    if (!requisition) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Requisition not found' })
      );
    }
    
    requisition.status = 'submitted';
    requisition.updatedAt = new Date();
    
    return res(
      ctx.status(200),
      ctx.json({
        data: requisition,
        success: true,
        message: 'Requisition submitted successfully',
        timestamp: new Date(),
      })
    );
  }),

  // Search
  http.post('/api/search', async (req, res, ctx) => {
    await delay(500);
    const { query, filters } = await req.json();
    
    const results: SearchResult[] = [];
    
    // Search in vendors
    mockVendors.forEach(vendor => {
      if (vendor.name.toLowerCase().includes(query.toLowerCase()) ||
          vendor.taxId.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'vendor',
          id: vendor.id,
          title: vendor.name,
          description: `${vendor.categories.join(', ')} - Risk Score: ${vendor.riskScore}`,
          relevanceScore: 0.9,
          highlights: [vendor.name],
          url: `/vendors/${vendor.id}`,
          metadata: { status: vendor.status },
        });
      }
    });
    
    // Search in products
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.sku.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'product',
          id: product.id,
          title: product.name,
          description: `${product.category} - ${product.uom}`,
          relevanceScore: 0.8,
          highlights: [product.name],
          url: `/products/${product.id}`,
          metadata: { category: product.category, price: product.priceTiers[0]?.unitPrice },
        });
      }
    });
    
    return res(
      ctx.status(200),
      ctx.json({
        data: results,
        success: true,
        timestamp: new Date(),
      })
    );
  }),

  // Auth
  http.post('/api/auth/login', async (req, res, ctx) => {
    await delay(300);
    const { email, password } = await req.json();
    
    // Mock authentication
    const user: User = {
      id: uuidv4(),
      name: email.split('@')[0],
      email,
      role: 'requester',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return res(
      ctx.status(200),
      ctx.json({
        data: user,
        success: true,
        message: 'Login successful',
        timestamp: new Date(),
      })
    );
  }),

  // Dashboard data
  http.get('/api/dashboard/stats', async (req, res, ctx) => {
    await delay(400);
    
    const stats = {
      totalSpend: 2500000,
      openPOs: 45,
      pendingApprovals: 12,
      vendorOTD: 94.5,
      budgetUtilization: 78.2,
      activeVendors: mockVendors.filter(v => v.status === 'active').length,
      pendingInvoices: 23,
      overduePayments: 5,
    };
    
    return res(
      ctx.status(200),
      ctx.json({
        data: stats,
        success: true,
        timestamp: new Date(),
      })
    );
  }),
];