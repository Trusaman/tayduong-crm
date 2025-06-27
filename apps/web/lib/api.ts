// API client utilities for PharmaCRM
// Note: This is a mock implementation. In a real application, you would:
// 1. Install axios: npm install axios
// 2. Install @tanstack/react-query: npm install @tanstack/react-query
// 3. Install zustand: npm install zustand
// 4. Set up proper API endpoints with Supabase

import type { 
  Order, 
  Product, 
  Inventory, 
  Customer, 
  CreateOrderForm, 
  UpdateOrderForm,
  UpdateInventoryForm,
  ApiResponse,
  PaginatedResponse 
} from "@/types"

// Mock API base URL - replace with actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Mock API client - replace with actual HTTP client (axios)
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Mock implementation - replace with actual HTTP requests
    console.log(`API Request: ${options.method || 'GET'} ${this.baseURL}${endpoint}`)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock successful response
    return {
      success: true,
      data: {} as T,
      message: "Mock response"
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

const apiClient = new ApiClient(API_BASE_URL)

// Orders API
export const ordersApi = {
  // GET /api/orders - List orders with filters
  getOrders: async (params?: {
    page?: number
    limit?: number
    status?: string
    customer_id?: string
    date_from?: string
    date_to?: string
  }): Promise<PaginatedResponse<Order>> => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/orders?${queryParams.toString()}`
    )
    return response.data
  },

  // POST /api/orders - Create new order
  createOrder: async (orderData: CreateOrderForm): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', orderData)
    return response.data
  },

  // GET /api/orders/:id - Get order details
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`)
    return response.data
  },

  // PUT /api/orders/:id - Update order
  updateOrder: async (orderId: string, updates: UpdateOrderForm): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${orderId}`, updates)
    return response.data
  },

  // POST /api/orders/:id/approve - Approve order
  approveOrder: async (orderId: string, notes?: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${orderId}/approve`, { notes })
    return response.data
  },

  // POST /api/orders/:id/reject - Reject order
  rejectOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${orderId}/reject`, { reason })
    return response.data
  }
}

// Products & Inventory API
export const productsApi = {
  // GET /api/products - List products
  getProducts: async (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    requires_prescription?: boolean
  }): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products?${queryParams.toString()}`
    )
    return response.data
  },

  // GET /api/products/:id/inventory - Get product inventory
  getProductInventory: async (productId: string): Promise<Inventory[]> => {
    const response = await apiClient.get<Inventory[]>(`/products/${productId}/inventory`)
    return response.data
  }
}

export const inventoryApi = {
  // PUT /api/inventory/:id - Update inventory levels
  updateInventory: async (inventoryId: string, updates: UpdateInventoryForm): Promise<Inventory> => {
    const response = await apiClient.put<Inventory>(`/inventory/${inventoryId}`, updates)
    return response.data
  },

  // GET /api/inventory - List all inventory with filters
  getInventory: async (params?: {
    page?: number
    limit?: number
    product_id?: string
    location?: string
    low_stock?: boolean
    expiring_soon?: boolean
  }): Promise<PaginatedResponse<Inventory>> => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const response = await apiClient.get<PaginatedResponse<Inventory>>(
      `/inventory?${queryParams.toString()}`
    )
    return response.data
  }
}

// Customers API
export const customersApi = {
  // GET /api/customers - List customers
  getCustomers: async (params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<Customer>> => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const response = await apiClient.get<PaginatedResponse<Customer>>(
      `/customers?${queryParams.toString()}`
    )
    return response.data
  },

  // POST /api/customers - Create customer
  createCustomer: async (customerData: any): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/customers', customerData)
    return response.data
  },

  // GET /api/customers/:id - Get customer details
  getCustomer: async (customerId: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${customerId}`)
    return response.data
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Response interceptor for error handling
export const handleApiError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    throw new ApiError(
      error.response.data?.message || 'An error occurred',
      error.response.status,
      error.response.data?.code
    )
  } else if (error.request) {
    // Network error
    throw new ApiError('Network error - please check your connection', 0)
  } else {
    // Other error
    throw new ApiError(error.message || 'An unexpected error occurred', 0)
  }
}

// Utility functions for common operations
export const formatApiDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const parseApiDate = (dateString: string): Date => {
  return new Date(dateString)
}

export default apiClient
