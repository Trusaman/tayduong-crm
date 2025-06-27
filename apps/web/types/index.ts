// User types
export interface User {
  id: string
  email: string
  role: 'sales' | 'inventory' | 'accountant' | 'courier' | 'admin'
  full_name: string
  created_at: string
  updated_at: string
}

// Customer types
export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  credit_limit?: number
  created_at: string
  updated_at: string
}

// Product types
export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  price: number
  category?: string
  requires_prescription: boolean
  created_at: string
  updated_at: string
}

// Inventory types
export interface Inventory {
  id: string
  product_id: string
  product?: Product
  quantity: number
  reserved_quantity: number
  batch_number?: string
  expiry_date?: string
  location?: string
  created_at: string
  updated_at: string
}

// Order types
export type OrderStatus = 
  | 'draft'
  | 'pending_inventory'
  | 'inventory_approved'
  | 'inventory_rejected'
  | 'pending_accounting'
  | 'approved'
  | 'rejected'
  | 'in_transit'
  | 'delivered'
  | 'partially_delivered'
  | 'completed'
  | 'returned'

export interface Order {
  id: string
  order_number: string
  customer_id: string
  customer?: Customer
  sales_rep_id: string
  sales_rep?: User
  status: OrderStatus
  total_amount: number
  notes?: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  total_price: number
  delivered_quantity: number
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: OrderStatus
  changed_by: string
  changed_by_user?: User
  notes?: string
  created_at: string
}

// Delivery types
export interface Delivery {
  id: string
  order_id: string
  order?: Order
  courier_id: string
  courier?: User
  scheduled_date?: string
  delivered_date?: string
  delivery_address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  proof_of_delivery?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Return types
export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'received' | 'processed'
export type ReturnItemCondition = 'good' | 'damaged' | 'expired'

export interface Return {
  id: string
  order_id: string
  order?: Order
  return_number: string
  reason?: string
  status: ReturnStatus
  refund_amount?: number
  processed_by?: string
  processed_by_user?: User
  created_at: string
  updated_at: string
  return_items?: ReturnItem[]
}

export interface ReturnItem {
  id: string
  return_id: string
  product_id: string
  product?: Product
  quantity: number
  reason?: string
  condition: ReturnItemCondition
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface CreateOrderForm {
  customer_id: string
  notes?: string
  order_items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
}

export interface UpdateOrderForm {
  customer_id?: string
  status?: OrderStatus
  notes?: string
}

export interface CreateCustomerForm {
  name: string
  email?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  credit_limit?: number
}

export interface UpdateInventoryForm {
  quantity: number
  batch_number?: string
  expiry_date?: string
  location?: string
}
