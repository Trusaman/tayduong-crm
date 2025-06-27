# PharmaCRM - Pharmaceutical Customer Relationship Management System

A comprehensive CRM system designed specifically for pharmaceutical companies to manage the complete order lifecycle from initial order placement through delivery and potential returns, with integrated inventory management and financial controls.

## 🚀 Features

### Core Functionality
- **Order Management**: Complete order lifecycle management with approval workflows
- **Inventory Management**: Real-time stock tracking with low stock alerts and expiry date monitoring
- **Customer Management**: Comprehensive customer database with order history and credit limits
- **Delivery Tracking**: Route optimization and delivery status management
- **Returns Processing**: Streamlined return authorization and refund processing
- **Role-based Access Control**: Different permissions for Sales, Inventory, Accounting, Courier, and Admin roles

### Technical Features
- **Modern UI**: Built with React 19, Next.js 14+ (App Router), and Tailwind CSS
- **Component Library**: Custom UI components based on Shadcn/ui design system
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Responsive Design**: Mobile-first responsive design for all screen sizes
- **Error Handling**: Comprehensive error boundaries and loading states
- **Mock Data**: Complete mock data implementation for demonstration

## 🛠️ Technology Stack

- **Frontend**: React 19, Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom Shadcn/ui components
- **Icons**: Lucide React
- **Typography**: Geist font family
- **State Management**: Ready for Zustand integration
- **Data Fetching**: Ready for TanStack Query integration
- **HTTP Client**: Ready for Axios integration
- **Database**: Ready for Supabase (PostgreSQL) integration
- **Authentication**: Ready for Supabase Auth integration

## 📁 Project Structure

```
tayduong-crm/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # App Router pages
│       │   ├── orders/         # Orders management
│       │   ├── products/       # Products & Inventory
│       │   ├── customers/      # Customer management
│       │   ├── deliveries/     # Delivery tracking
│       │   ├── returns/        # Returns processing
│       │   └── settings/       # Application settings
│       ├── components/         # React components
│       │   ├── layout/         # Layout components
│       │   ├── orders/         # Order-specific components
│       │   ├── products/       # Product-specific components
│       │   └── ui/             # Utility UI components
│       ├── lib/                # Utility functions and API clients
│       └── types/              # TypeScript type definitions
├── packages/
│   ├── ui/                     # Shared UI component library
│   │   └── src/
│   │       ├── components/     # Reusable UI components
│   │       ├── lib/            # Utility functions
│   │       └── styles/         # Global styles
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configuration
└── docs/
    └── PRD.md                  # Product Requirements Document
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tayduong-crm
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Additional Dependencies (Optional)

For full functionality, you may want to install these additional packages:

```bash
# State management and data fetching
pnpm add zustand @tanstack/react-query axios

# Form handling and validation
pnpm add react-hook-form @hookform/resolvers zod

# Date handling
pnpm add date-fns

# Additional UI components
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
```

## 📱 Pages and Features

### Dashboard
- **Overview**: Key metrics and statistics
- **Recent Orders**: Quick access to latest orders
- **Low Stock Alerts**: Inventory warnings
- **Revenue Tracking**: Financial overview

### Orders Management (`/orders`)
- **Order List**: Comprehensive order table with filtering and search
- **Order Creation**: Multi-step order creation with product selection
- **Order Details**: Detailed view with status history and customer information
- **Approval Workflow**: Inventory and accounting approval processes
- **Status Tracking**: Real-time order status updates

### Products & Inventory (`/products`)
- **Product Catalog**: Complete product listing with search and filters
- **Inventory Levels**: Real-time stock tracking
- **Low Stock Alerts**: Automated alerts for products running low
- **Expiry Tracking**: Monitor product expiration dates
- **Inventory Updates**: Easy stock level adjustments
- **Batch Management**: Track batch numbers and locations

### Customer Management (`/customers`)
- **Customer Database**: Complete customer information
- **Order History**: Track customer purchase patterns
- **Credit Limits**: Monitor and manage customer credit
- **Contact Management**: Comprehensive contact information

### Delivery Tracking (`/deliveries`)
- **Delivery Schedule**: Track all scheduled deliveries
- **Route Planning**: Optimize delivery routes
- **Status Updates**: Real-time delivery status tracking
- **Courier Management**: Assign and track courier activities

### Returns Processing (`/returns`)
- **Return Requests**: Manage return authorization
- **Refund Processing**: Handle refund calculations
- **Quality Control**: Track return reasons and conditions
- **Inventory Adjustments**: Update stock levels for returns

## 🎨 UI Components

The application includes a comprehensive set of custom UI components:

### Form Components
- `Input` - Text input with validation states
- `Select` - Dropdown selection with search
- `Textarea` - Multi-line text input
- `Label` - Form field labels
- `Button` - Various button styles and sizes

### Data Display
- `Table` - Responsive data tables with sorting
- `Card` - Content containers with headers and footers
- `Badge` - Status indicators and labels
- `Dialog` - Modal dialogs and overlays

### Layout Components
- `MainLayout` - Application shell with sidebar and header
- `Sidebar` - Navigation sidebar with role-based menu items
- `Header` - Top navigation with search and user actions

### Utility Components
- `LoadingSpinner` - Loading states and indicators
- `ErrorBoundary` - Error handling and recovery
- `ErrorDisplay` - User-friendly error messages

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm typecheck    # Run TypeScript checks

# Package management
pnpm install      # Install dependencies
pnpm clean        # Clean node_modules and build artifacts
```

### Adding New Components

To add new UI components to the shared library:

```bash
# Add to the UI package
cd packages/ui/src/components
# Create your component file
# Export it from the main index
```

### Code Style

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (if configured)
- **Tailwind CSS**: Utility-first CSS framework

## 🚀 Deployment

### Production Build

```bash
pnpm build
```

### Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Platforms

This application is ready to deploy on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Docker** containers

## 📚 Documentation

- **PRD**: See `docs/PRD.md` for detailed product requirements
- **API Documentation**: API endpoints are documented in `apps/web/lib/api.ts`
- **Component Documentation**: Each component includes TypeScript interfaces and JSDoc comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the excellent component library foundation
- **Tailwind CSS** for the utility-first CSS framework
- **Next.js** for the React framework
- **Lucide** for the beautiful icons
