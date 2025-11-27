import { openDB, DBSchema, IDBPDatabase } from 'idb';
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
  AuditLog,
  Notification,
} from '@/lib/types';

interface ProcurementDB extends DBSchema {
  vendors: {
    key: string;
    value: Vendor;
    indexes: { 'by-name': string; 'by-status': string };
  };
  products: {
    key: string;
    value: Product;
    indexes: { 'by-name': string; 'by-category': string; 'by-sku': string };
  };
  budgets: {
    key: string;
    value: Budget;
    indexes: { 'by-costCenter': string; 'by-period': string };
  };
  costCenters: {
    key: string;
    value: CostCenter;
    indexes: { 'by-code': string; 'by-owner': string };
  };
  requisitions: {
    key: string;
    value: Requisition;
    indexes: { 'by-requester': string; 'by-status': string; 'by-costCenter': string };
  };
  rfqs: {
    key: string;
    value: RFQ;
    indexes: { 'by-owner': string; 'by-status': string; 'by-vendor': string };
  };
  purchaseOrders: {
    key: string;
    value: PurchaseOrder;
    indexes: { 'by-vendor': string; 'by-status': string; 'by-buyer': string };
  };
  grns: {
    key: string;
    value: GoodsReceiptNote;
    indexes: { 'by-po': string; 'by-receiver': string; 'by-status': string };
  };
  invoices: {
    key: string;
    value: Invoice;
    indexes: { 'by-vendor': string; 'by-status': string; 'by-po': string };
  };
  payments: {
    key: string;
    value: Payment;
    indexes: { 'by-invoice': string; 'by-status': string; 'by-method': string };
  };
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string; 'by-role': string };
  };
  auditLogs: {
    key: string;
    value: AuditLog;
    indexes: { 'by-entity': string; 'by-actor': string; 'by-timestamp': number };
  };
  notifications: {
    key: string;
    value: Notification;
    indexes: { 'by-user': string; 'by-type': string; 'by-read': boolean };
  };
  settings: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<ProcurementDB>;

export const initDB = async (): Promise<IDBPDatabase<ProcurementDB>> => {
  if (db) return db;

  db = await openDB<ProcurementDB>('procurement-db', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Vendors
      if (!db.objectStoreNames.contains('vendors')) {
        const vendorStore = db.createObjectStore('vendors', { keyPath: 'id' });
        vendorStore.createIndex('by-name', 'name');
        vendorStore.createIndex('by-status', 'status');
      }

      // Products
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('by-name', 'name');
        productStore.createIndex('by-category', 'category');
        productStore.createIndex('by-sku', 'sku');
      }

      // Budgets
      if (!db.objectStoreNames.contains('budgets')) {
        const budgetStore = db.createObjectStore('budgets', { keyPath: 'id' });
        budgetStore.createIndex('by-costCenter', 'costCenterId');
        budgetStore.createIndex('by-period', 'periodStart');
      }

      // Cost Centers
      if (!db.objectStoreNames.contains('costCenters')) {
        const costCenterStore = db.createObjectStore('costCenters', { keyPath: 'id' });
        costCenterStore.createIndex('by-code', 'code');
        costCenterStore.createIndex('by-owner', 'ownerId');
      }

      // Requisitions
      if (!db.objectStoreNames.contains('requisitions')) {
        const requisitionStore = db.createObjectStore('requisitions', { keyPath: 'id' });
        requisitionStore.createIndex('by-requester', 'requesterId');
        requisitionStore.createIndex('by-status', 'status');
        requisitionStore.createIndex('by-costCenter', 'costCenterId');
      }

      // RFQs
      if (!db.objectStoreNames.contains('rfqs')) {
        const rfqStore = db.createObjectStore('rfqs', { keyPath: 'id' });
        rfqStore.createIndex('by-owner', 'ownerId');
        rfqStore.createIndex('by-status', 'status');
        rfqStore.createIndex('by-vendor', 'invitedVendors', { multiEntry: true });
      }

      // Purchase Orders
      if (!db.objectStoreNames.contains('purchaseOrders')) {
        const poStore = db.createObjectStore('purchaseOrders', { keyPath: 'id' });
        poStore.createIndex('by-vendor', 'vendorId');
        poStore.createIndex('by-status', 'status');
        poStore.createIndex('by-buyer', 'buyerId');
      }

      // GRNs
      if (!db.objectStoreNames.contains('grns')) {
        const grnStore = db.createObjectStore('grns', { keyPath: 'id' });
        grnStore.createIndex('by-po', 'poId');
        grnStore.createIndex('by-receiver', 'receiverId');
        grnStore.createIndex('by-status', 'status');
      }

      // Invoices
      if (!db.objectStoreNames.contains('invoices')) {
        const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id' });
        invoiceStore.createIndex('by-vendor', 'vendorId');
        invoiceStore.createIndex('by-status', 'status');
        invoiceStore.createIndex('by-po', 'poId');
      }

      // Payments
      if (!db.objectStoreNames.contains('payments')) {
        const paymentStore = db.createObjectStore('payments', { keyPath: 'id' });
        paymentStore.createIndex('by-invoice', 'invoiceId');
        paymentStore.createIndex('by-status', 'status');
        paymentStore.createIndex('by-method', 'method');
      }

      // Users
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email');
        userStore.createIndex('by-role', 'role');
      }

      // Audit Logs
      if (!db.objectStoreNames.contains('auditLogs')) {
        const auditStore = db.createObjectStore('auditLogs', { keyPath: 'id' });
        auditStore.createIndex('by-entity', ['entityType', 'entityId']);
        auditStore.createIndex('by-actor', 'actorId');
        auditStore.createIndex('by-timestamp', 'timestamp');
      }

      // Notifications
      if (!db.objectStoreNames.contains('notifications')) {
        const notificationStore = db.createObjectStore('notifications', { keyPath: 'id' });
        notificationStore.createIndex('by-user', 'userId');
        notificationStore.createIndex('by-type', 'type');
        notificationStore.createIndex('by-read', 'isRead');
      }

      // Settings
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });

  return db;
};

// Generic CRUD operations
export class DBService<T> {
  private storeName: string;

  constructor(storeName: keyof ProcurementDB) {
    this.storeName = storeName;
  }

  async getAll(): Promise<T[]> {
    const db = await initDB();
    return db.getAll(this.storeName);
  }

  async get(id: string): Promise<T | undefined> {
    const db = await initDB();
    return db.get(this.storeName, id);
  }

  async create(data: T): Promise<string> {
    const db = await initDB();
    return db.add(this.storeName, data);
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const db = await initDB();
    const existing = await db.get(this.storeName, id);
    if (existing) {
      const updated = { ...existing, ...data };
      await db.put(this.storeName, updated as T);
    }
  }

  async delete(id: string): Promise<void> {
    const db = await initDB();
    await db.delete(this.storeName, id);
  }

  async clear(): Promise<void> {
    const db = await initDB();
    await db.clear(this.storeName);
  }

  async getByIndex(indexName: string, key: any): Promise<T[]> {
    const db = await initDB();
    return db.getAllFromIndex(this.storeName, indexName, key);
  }

  async query(indexName: string, keyRange: IDBKeyRange): Promise<T[]> {
    const db = await initDB();
    return db.getAllFromIndex(this.storeName, indexName, keyRange);
  }
}

// Specific services for each entity
export const vendorService = new DBService<Vendor>('vendors');
export const productService = new DBService<Product>('products');
export const budgetService = new DBService<Budget>('budgets');
export const costCenterService = new DBService<CostCenter>('costCenters');
export const requisitionService = new DBService<Requisition>('requisitions');
export const rfqService = new DBService<RFQ>('rfqs');
export const purchaseOrderService = new DBService<PurchaseOrder>('purchaseOrders');
export const grnService = new DBService<GoodsReceiptNote>('grns');
export const invoiceService = new DBService<Invoice>('invoices');
export const paymentService = new DBService<Payment>('payments');
export const userService = new DBService<User>('users');
export const auditLogService = new DBService<AuditLog>('auditLogs');
export const notificationService = new DBService<Notification>('notifications');

// Settings service
export const settingsService = {
  async get(key: string): Promise<any> {
    const db = await initDB();
    return db.get('settings', key);
  },

  async set(key: string, value: any): Promise<void> {
    const db = await initDB();
    await db.put('settings', { key, value });
  },

  async delete(key: string): Promise<void> {
    const db = await initDB();
    await db.delete('settings', key);
  },
};

// Audit logging
export const logAudit = async (auditLog: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
  const db = await initDB();
  const fullAuditLog: AuditLog = {
    ...auditLog,
    id: `audit-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
  };
  await db.add('auditLogs', fullAuditLog);
};

// Data seeding
export const seedData = async (): Promise<void> => {
  const db = await initDB();
  
  // Check if data is already seeded
  const vendorCount = await db.count('vendors');
  if (vendorCount > 0) return;

  // Import mock data and seed
  // This would be called with the generated mock data
  console.log('Seeding initial data...');
};

// Data export/import
export const exportData = async (): Promise<string> => {
  const db = await initDB();
  const exportData: any = {};

  for (const storeName of db.objectStoreNames) {
    exportData[storeName] = await db.getAll(storeName);
  }

  return JSON.stringify(exportData, null, 2);
};

export const importData = async (jsonData: string): Promise<void> => {
  const data = JSON.parse(jsonData);
  const db = await initDB();

  for (const [storeName, records] of Object.entries(data)) {
    if (db.objectStoreNames.contains(storeName)) {
      await db.clear(storeName);
      for (const record of records as any[]) {
        await db.add(storeName, record);
      }
    }
  }
};