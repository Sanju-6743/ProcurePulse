# ProcureFlow - Enterprise Procurement SaaS Platform

A comprehensive, production-ready procurement management system built with modern web technologies. This pure-frontend application demonstrates a full-featured procurement SaaS with mock APIs and client-side persistence.

## 🚀 Features

### Core Procurement Modules
- **Vendor Management**: Complete vendor onboarding, risk scoring, SLA tracking, and compliance management
- **Product Catalog & Pricing**: Comprehensive product management with price tiers and preferred vendors
- **Budgets & Cost Centers**: Budget allocation, encumbrance tracking, and spend monitoring
- **Requisitions**: Multi-level approval workflows with dynamic routing based on amount/category
- **RFQ & Bidding**: Electronic bidding with vendor comparison and award management
- **Purchase Orders**: PO lifecycle management with change orders and version control
- **Goods Receipt (GRN)**: Receipt processing with QA status and lot/serial tracking
- **Invoices & 3-Way Match**: Automated invoice matching with exception handling
- **Payments**: Payment processing with remittance advice (stub implementation)
- **Exceptions & Approvals**: Centralized approval center with sequential/parallel workflows

### Analytics & Reporting
- **Dashboards**: Real-time KPIs with interactive charts and cross-filtering
- **Global Search**: Full-text search across all entities with advanced filters
- **Export Capabilities**: CSV/XLSX, PDF, and PNG export functionality
- **Audit Trail**: Complete audit logging for compliance and traceability

### User Experience
- **Role-Based Access Control (RBAC)**: 6 distinct user roles with granular permissions
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: WCAG 2.2 AA compliant with keyboard navigation
- **Real-time Notifications**: In-app alerts with email/Teams integration (mock)
- **Dark/Light/High-Contrast Themes**: Multiple theme options with performance toggles

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **State Management**: Zustand (client state), TanStack Query (server state)
- **Data Persistence**: IndexedDB with full CRUD operations
- **Mock APIs**: MSW (Mock Service Worker) for realistic API simulation
- **Charts**: Chart.js + ECharts for interactive visualizations
- **Tables**: TanStack Table with virtualization for large datasets
- **Internationalization**: i18next with en-IN default
- **Testing**: Vitest + React Testing Library + Cypress E2E
- **PWA**: Workbox for offline capabilities and background sync

### Data Model
The application implements a comprehensive procurement data model with entities for:
- Users, Vendors, Products, Cost Centers, Budgets
- Requisitions, RFQs, Bids, Purchase Orders
- Goods Receipt Notes, Invoices, Payments
- Approvals, Audit Logs, Notifications

### State Management
- **Zustand Stores**: Auth, UI, Procurement data management
- **TanStack Query**: API state management with caching and optimistic updates
- **IndexedDB**: Client-side persistence for offline functionality

## 🎯 User Roles & Permissions

1. **Requester (Employee)**
   - Create and manage requisitions
   - View purchase orders and invoices
   - Access product catalog

2. **Buyer (Procurement)**
   - Manage vendors and product catalog
   - Create RFQs and manage bidding process
   - Create and manage purchase orders
   - Process goods receipts

3. **Approver (Line Manager/Budget Owner)**
   - Approve/reject requisitions and change orders
   - Monitor budget utilization
   - View spending analytics

4. **Vendor (Supplier)**
   - Limited portal view for RFQ responses
   - Submit bids and upload invoices
   - View payment status

5. **Finance (AP/AR)**
   - Process invoices and payments
   - Manage 3-way matching
   - Financial reporting and analytics

6. **Admin (System)**
   - Full system access
   - User management and system configuration
   - Audit trail monitoring

7. **Auditor (Read-only)**
   - Read-only access to all modules
   - Audit trail and compliance monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd procureflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Use demo credentials to log in:
     - requester@company.com / password
     - buyer@company.com / password
     - approver@company.com / password
     - finance@company.com / password
     - admin@company.com / password

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema (Prisma)
- `npm run db:generate` - Generate Prisma client

## 📊 Key Workflows

### 1. Procurement-to-Pay Cycle
```
Requisition → Approval → RFQ → Bidding → PO Award → Goods Receipt → Invoice → 3-Way Match → Payment
```

### 2. Vendor Management
```
Onboarding → Risk Assessment → Compliance → Performance Monitoring → SLA Tracking
```

### 3. Budget Management
```
Budget Allocation → Encumbrance Tracking → Spend Monitoring → Variance Analysis
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Accessibility Testing
```bash
npm run test:a11y
```

## 🎨 Design System

### Themes
- **Light Theme**: Default modern interface
- **Dark Theme**: Reduced eye strain in low-light environments
- **High-Contrast Theme**: Accessibility-focused design

### Components
Built with shadcn/ui components following:
- Consistent spacing and typography
- Responsive design patterns
- Accessibility best practices
- Keyboard navigation support

## 📱 Responsive Design

### Breakpoints
- **sm**: 360px - 640px (Mobile)
- **md**: 641px - 768px (Tablet)
- **lg**: 769px - 1024px (Desktop)
- **xl**: 1025px - 1280px (Large Desktop)
- **2xl**: 1281px+ (Extra Large Desktop)

### Adaptive Patterns
- Tables transform to cards on mobile
- Collapsible navigation and toolbars
- Touch-friendly interactive elements
- Progressive disclosure of information

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### Customization
- **Theme Colors**: Modify Tailwind CSS configuration
- **Business Rules**: Update validation logic in form components
- **Approval Workflows**: Configure approval matrices in stores
- **Mock Data**: Adjust seed data generators for different scenarios

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure accessibility compliance
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **TanStack** for excellent state management and table solutions
- **MSW** for powerful API mocking capabilities
- **Chart.js & ECharts** for interactive data visualization

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the demo videos and tutorials

---

Built with ❤️ using modern web technologies for enterprise procurement management.