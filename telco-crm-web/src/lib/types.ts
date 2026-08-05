// src/lib/types.ts
// Backend servislerindeki DTO/entity sözleşmeleriyle birebir eşleşen tipler.

export type CustomerStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  identityNumber: string;
  email: string;
  phoneNumber: string | null;
  status: CustomerStatus;
  createdAt: string;
}

export interface CustomerCreateRequest {
  firstName: string;
  lastName: string;
  identityNumber: string;
  email: string;
  phoneNumber?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number | null;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity?: number;
}

export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "COMPLETED"
  | "CANCELLED"
  | "CREATED";

export interface Order {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderRequest {
  customerId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
}

export interface Subscription {
  id: number;
  customerId: number;
  planId: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

export interface SubscriptionCreateRequest {
  customerId: number;
  planId: number;
  status?: string;
}

export interface Invoice {
  id: number;
  customerId: number;
  orderId: number | null;
  amount: number;
  status: string;
  issueDate: string | null;
  dueDate: string | null;
}

export interface InvoiceCreateRequest {
  customerId: number;
  orderId?: number;
  amount: number;
  status?: string;
}
