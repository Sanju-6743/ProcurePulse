import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
  SearchResult,
  SearchFilter,
} from '@/lib/types';

interface ProcurementState {
  // Data
  vendors: Vendor[];
  products: Product[];
  budgets: Budget[];
  costCenters: CostCenter[];
  requisitions: Requisition[];
  rfqs: RFQ[];
  purchaseOrders: PurchaseOrder[];
  grns: GoodsReceiptNote[];
  invoices: Invoice[];
  payments: Payment[];
  
  // Loading states
  loading: {
    vendors: boolean;
    products: boolean;
    budgets: boolean;
    costCenters: boolean;
    requisitions: boolean;
    rfqs: boolean;
    purchaseOrders: boolean;
    grns: boolean;
    invoices: boolean;
    payments: boolean;
  };
  
  // Search
  searchResults: SearchResult[];
  searchLoading: boolean;
  searchFilters: SearchFilter;
  
  // Actions
  // Vendors
  setVendors: (vendors: Vendor[]) => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  
  // Products
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Budgets
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Cost Centers
  setCostCenters: (costCenters: CostCenter[]) => void;
  addCostCenter: (costCenter: CostCenter) => void;
  updateCostCenter: (id: string, costCenter: Partial<CostCenter>) => void;
  deleteCostCenter: (id: string) => void;
  
  // Requisitions
  setRequisitions: (requisitions: Requisition[]) => void;
  addRequisition: (requisition: Requisition) => void;
  updateRequisition: (id: string, requisition: Partial<Requisition>) => void;
  deleteRequisition: (id: string) => void;
  
  // RFQs
  setRFQs: (rfqs: RFQ[]) => void;
  addRFQ: (rfq: RFQ) => void;
  updateRFQ: (id: string, rfq: Partial<RFQ>) => void;
  deleteRFQ: (id: string) => void;
  
  // Purchase Orders
  setPurchaseOrders: (purchaseOrders: PurchaseOrder[]) => void;
  addPurchaseOrder: (purchaseOrder: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, purchaseOrder: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  
  // GRNs
  setGRNs: (grns: GoodsReceiptNote[]) => void;
  addGRN: (grn: GoodsReceiptNote) => void;
  updateGRN: (id: string, grn: Partial<GoodsReceiptNote>) => void;
  deleteGRN: (id: string) => void;
  
  // Invoices
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Payments
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  
  // Loading
  setLoading: (entity: keyof typeof loading, loading: boolean) => void;
  
  // Search
  setSearchResults: (results: SearchResult[]) => void;
  setSearchLoading: (loading: boolean) => void;
  setSearchFilters: (filters: SearchFilter) => void;
  
  // Utility
  reset: () => void;
}

const initialState = {
  vendors: [],
  products: [],
  budgets: [],
  costCenters: [],
  requisitions: [],
  rfqs: [],
  purchaseOrders: [],
  grns: [],
  invoices: [],
  payments: [],
  loading: {
    vendors: false,
    products: false,
    budgets: false,
    costCenters: false,
    requisitions: false,
    rfqs: false,
    purchaseOrders: false,
    grns: false,
    invoices: false,
    payments: false,
  },
  searchResults: [],
  searchLoading: false,
  searchFilters: {},
};

export const useProcurementStore = create<ProcurementState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Vendors
      setVendors: (vendors) => set({ vendors }),
      addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
      updateVendor: (id, vendor) =>
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...vendor } : v)),
        })),
      deleteVendor: (id) =>
        set((state) => ({ vendors: state.vendors.filter((v) => v.id !== id) })),
      
      // Products
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      
      // Budgets
      setBudgets: (budgets) => set({ budgets }),
      addBudget: (budget) => set((state) => ({ budgets: [...state.budgets, budget] })),
      updateBudget: (id, budget) =>
        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)),
        })),
      deleteBudget: (id) =>
        set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) })),
      
      // Cost Centers
      setCostCenters: (costCenters) => set({ costCenters }),
      addCostCenter: (costCenter) =>
        set((state) => ({ costCenters: [...state.costCenters, costCenter] })),
      updateCostCenter: (id, costCenter) =>
        set((state) => ({
          costCenters: state.costCenters.map((cc) => (cc.id === id ? { ...cc, ...costCenter } : cc)),
        })),
      deleteCostCenter: (id) =>
        set((state) => ({ costCenters: state.costCenters.filter((cc) => cc.id !== id) })),
      
      // Requisitions
      setRequisitions: (requisitions) => set({ requisitions }),
      addRequisition: (requisition) =>
        set((state) => ({ requisitions: [...state.requisitions, requisition] })),
      updateRequisition: (id, requisition) =>
        set((state) => ({
          requisitions: state.requisitions.map((r) => (r.id === id ? { ...r, ...requisition } : r)),
        })),
      deleteRequisition: (id) =>
        set((state) => ({ requisitions: state.requisitions.filter((r) => r.id !== id) })),
      
      // RFQs
      setRFQs: (rfqs) => set({ rfqs }),
      addRFQ: (rfq) => set((state) => ({ rfqs: [...state.rfqs, rfq] })),
      updateRFQ: (id, rfq) =>
        set((state) => ({ rfqs: state.rfqs.map((r) => (r.id === id ? { ...r, ...rfq } : r)) })),
      deleteRFQ: (id) => set((state) => ({ rfqs: state.rfqs.filter((r) => r.id !== id) })),
      
      // Purchase Orders
      setPurchaseOrders: (purchaseOrders) => set({ purchaseOrders }),
      addPurchaseOrder: (purchaseOrder) =>
        set((state) => ({ purchaseOrders: [...state.purchaseOrders, purchaseOrder] })),
      updatePurchaseOrder: (id, purchaseOrder) =>
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((po) =>
            po.id === id ? { ...po, ...purchaseOrder } : po
          ),
        })),
      deletePurchaseOrder: (id) =>
        set((state) => ({ purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id) })),
      
      // GRNs
      setGRNs: (grns) => set({ grns }),
      addGRN: (grn) => set((state) => ({ grns: [...state.grns, grn] })),
      updateGRN: (id, grn) =>
        set((state) => ({ grns: state.grns.map((g) => (g.id === id ? { ...g, ...grn } : g)) })),
      deleteGRN: (id) => set((state) => ({ grns: state.grns.filter((g) => g.id !== id) })),
      
      // Invoices
      setInvoices: (invoices) => set({ invoices }),
      addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
      updateInvoice: (id, invoice) =>
        set((state) => ({
          invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...invoice } : i)),
        })),
      deleteInvoice: (id) =>
        set((state) => ({ invoices: state.invoices.filter((i) => i.id !== id) })),
      
      // Payments
      setPayments: (payments) => set({ payments }),
      addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
      updatePayment: (id, payment) =>
        set((state) => ({
          payments: state.payments.map((p) => (p.id === id ? { ...p, ...payment } : p)),
        })),
      deletePayment: (id) =>
        set((state) => ({ payments: state.payments.filter((p) => p.id !== id) })),
      
      // Loading
      setLoading: (entity, loading) =>
        set((state) => ({
          loading: { ...state.loading, [entity]: loading },
        })),
      
      // Search
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchLoading: (loading) => set({ searchLoading: loading }),
      setSearchFilters: (filters) => set({ searchFilters: filters }),
      
      // Utility
      reset: () => set(initialState),
    }),
    { name: 'procurement-store' }
  )
);