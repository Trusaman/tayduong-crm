# Product Requirements Document (PRD)
## Pharma CRM System

### 1. Project Overview

**Product Name:** PharmaCRM  
**Version:** 1.0  
**Date:** December 2024  
**Team:** TayDuong Development Team  

### 2. Executive Summary

PharmaCRM is a comprehensive Customer Relationship Management system designed specifically for pharmaceutical companies. The system manages the complete order lifecycle from initial order placement through delivery and potential returns, with integrated inventory management and financial controls.

### 3. Technology Stack

- **Frontend:** React 19+ (Latest), Next.js 15+ (App Router)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui

### 4. User Roles & Permissions

#### 4.1 Sales Representative
- Create new orders
- View order history
- Update customer information
- Track order status

#### 4.2 Inventory Manager
- Monitor stock levels
- Approve/reject orders based on inventory
- Update product availability
- Generate inventory reports

#### 4.3 Accountant
- Review and approve orders for financial processing
- Reject orders requiring corrections
- Generate financial reports
- Manage pricing and discounts

#### 4.4 Courier/Logistics
- View assigned deliveries
- Update delivery status
- Handle partial deliveries
- Process returns

#### 4.5 Admin
- Manage users and permissions
- System configuration
- Generate comprehensive reports

### 5. Core Features

#### 5.1 Order Management System

**Order Creation (Sales)**
- Customer selection/creation
- Product catalog browsing
- Quantity specification
- Special instructions
- Order total calculation
- Save as draft or submit

**Order Processing Workflow**
1. **Sales Input** → Order created with status "Pending Inventory"
2. **Inventory Check** → Status changes to "Inventory Approved" or "Inventory Rejected"
3. **Accounting Review** → Status changes to "Approved" or "Rejected"
4. **Courier Assignment** → Status changes to "In Transit"
5. **Delivery** → Status changes to "Delivered" or "Partially Delivered"
6. **Completion** → Status changes to "Completed"

#### 5.2 Inventory Management

**Stock Tracking**
- Real-time inventory levels
- Low stock alerts
- Product expiration tracking
- Batch/lot number management

**Inventory Operations**
- Stock adjustments
- Receiving new inventory
- Inventory audits
- Waste/expired product tracking

#### 5.3 Customer Management

**Customer Database**
- Contact information
- Order history
- Credit limits
- Special pricing agreements
- Delivery preferences

#### 5.4 Product Catalog

**Product Information**
- Medicine details (name, dosage, form)
- Pricing tiers
- Stock levels
- Regulatory information
- Supplier details

#### 5.5 Delivery Management

**Delivery Tracking**
- Route optimization
- Delivery scheduling
- Proof of delivery
- Partial delivery handling
- Return processing

#### 5.6 Returns Management

**Return Processing**
- Return authorization
- Reason tracking
- Quality inspection
- Refund/credit processing
- Inventory adjustment

### 6. Database Schema (Supabase)

#### 6.1 Core Tables

```sql
-- Users table (extends Supabase auth.users)
users (
  id UUID PRIMARY KEY,
  email TEXT,
  role TEXT CHECK (role IN ('sales', 'inventory', 'accountant', 'courier', 'admin')),
  full_name TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Customers table
customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address JSONB,
  credit_limit DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Products table
products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  price DECIMAL NOT NULL,
  category TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Inventory table
inventory (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  reserved_quantity INTEGER DEFAULT 0,
  batch_number TEXT,
  expiry_date DATE,
  location TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Orders table
orders (
  id UUID PRIMARY KEY,
  order_number TEXT UNIQUE,
  customer_id UUID REFERENCES customers(id),
  sales_rep_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('draft', 'pending_inventory', 'inventory_approved', 'inventory_rejected', 'pending_accounting', 'approved', 'rejected', 'in_transit', 'delivered', 'partially_delivered', 'completed', 'returned')),
  total_amount DECIMAL,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Order Items table
order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL,
  delivered_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP
)

-- Order Status History table
order_status_history (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP
)

-- Deliveries table
deliveries (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  courier_id UUID REFERENCES users(id),
  scheduled_date DATE,
  delivered_date TIMESTAMP,
  delivery_address JSONB,
  proof_of_delivery TEXT,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Returns table
returns (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  return_number TEXT UNIQUE,
  reason TEXT,
  status TEXT CHECK (status IN ('requested', 'approved', 'rejected', 'received', 'processed')),
  refund_amount DECIMAL,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Return Items table
return_items (
  id UUID PRIMARY KEY,
  return_id UUID REFERENCES returns(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  reason TEXT,
  condition TEXT CHECK (condition IN ('good', 'damaged', 'expired')),
  created_at TIMESTAMP
)
```

### 7. API Endpoints Structure

#### 7.1 Authentication
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/user`

#### 7.2 Orders
- `GET /api/orders` - List orders with filters
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `POST /api/orders/:id/approve` - Approve order (inventory/accounting)
- `POST /api/orders/:id/reject` - Reject order

#### 7.3 Products & Inventory
- `GET /api/products` - List products
- `GET /api/products/:id/inventory` - Get product inventory
- `PUT /api/inventory/:id` - Update inventory levels

#### 7.4 Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details

#### 7.5 Deliveries
- `GET /api/deliveries` - List deliveries
- `PUT /api/deliveries/:id/status` - Update delivery status

#### 7.6 Returns
- `POST /api/returns` - Create return request
- `GET /api/returns` - List returns
- `PUT /api/returns/:id/process` - Process return

### 8. User Interface Requirements

#### 8.1 Dashboard
- Role-based dashboard showing relevant metrics
- Quick actions based on user role
- Recent activity feed
- Key performance indicators

#### 8.2 Order Management Interface
- Order creation wizard
- Order list with advanced filtering
- Order detail view with status timeline
- Bulk actions for order processing

#### 8.3 Inventory Interface
- Stock level overview
- Low stock alerts
- Inventory adjustment forms
- Expiry date tracking

#### 8.4 Reporting Interface
- Sales reports
- Inventory reports
- Financial reports
- Custom report builder

### 9. Business Rules

#### 9.1 Order Processing Rules
- Orders cannot be modified once approved by accounting
- Inventory must be reserved when order is approved
- Partial deliveries require separate delivery records
- Returns must be processed within 30 days

#### 9.2 Inventory Rules
- Stock cannot go below zero
- Expired products cannot be sold
- Low stock alerts at 10% of reorder level
- FIFO (First In, First Out) for expiring products

#### 9.3 Financial Rules
- Orders require accounting approval above $10,000
- Credit limits must be checked before order approval
- Returns require manager approval above $5,000

### 10. Security Requirements

#### 10.1 Authentication & Authorization
- Role-based access control (RBAC)
- Session management
- Password policies
- Multi-factor authentication (future)

#### 10.2 Data Security
- Encryption at rest and in transit
- Audit logging for sensitive operations
- Data backup and recovery
- GDPR compliance for customer data

### 11. Performance Requirements

- Page load times < 2 seconds
- API response times < 500ms
- Support for 100+ concurrent users
- 99.9% uptime availability

### 12. Integration Requirements

#### 12.1 External Systems
- Accounting software integration (future)
- Shipping provider APIs (future)
- Payment gateway integration (future)
- Regulatory compliance systems (future)

### 13. Deployment & Infrastructure

- **Hosting:** Vercel (Frontend), Supabase (Backend/Database)
- **Environment:** Development, Staging, Production
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics, Supabase Monitoring

### 14. Success Metrics

#### 14.1 Business Metrics
- Order processing time reduction by 50%
- Inventory accuracy improvement to 99%+
- Customer satisfaction score > 4.5/5
- Return processing time < 24 hours

#### 14.2 Technical Metrics
- System uptime > 99.9%
- Page load speed < 2 seconds
- API response time < 500ms
- Zero critical security vulnerabilities

### 15. Timeline & Milestones

#### Phase 1 (Weeks 1-4): Foundation
- Project setup and configuration
- Database schema implementation
- Authentication system
- Basic UI components

#### Phase 2 (Weeks 5-8): Core Features
- Order management system
- Inventory management
- Customer management
- Basic reporting

#### Phase 3 (Weeks 9-12): Advanced Features
- Delivery management
- Returns processing
- Advanced reporting
- Role-based permissions

#### Phase 4 (Weeks 13-16): Polish & Launch
- Testing and bug fixes
- Performance optimization
- Documentation
- Production deployment

### 16. Risk Assessment

#### 16.1 Technical Risks
- **Database performance** - Mitigation: Proper indexing and query optimization
- **Third-party dependencies** - Mitigation: Regular updates and fallback plans
- **Data migration** - Mitigation: Comprehensive testing and rollback procedures

#### 16.2 Business Risks
- **User adoption** - Mitigation: User training and intuitive UI design
- **Regulatory compliance** - Mitigation: Regular compliance audits
- **Data security** - Mitigation: Security best practices and regular audits

### 17. Future Enhancements

- Mobile application
- Advanced analytics and AI insights
- Integration with external pharmacy systems
- Multi-language support
- Advanced workflow automation
- IoT integration for inventory tracking

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Next Review:** January 2025