// src/lib/api.ts
import axios from "axios";
import type {
  Customer,
  CustomerCreateRequest,
  Product,
  ProductCreateRequest,
  Order,
  CreateOrderRequest,
  Subscription,
  SubscriptionCreateRequest,
  Invoice,
  InvoiceCreateRequest,
} from "./types";

// Not: her servisin kendi controller'ındaki @RequestMapping yolu esas alınmıştır.
export const API_ENDPOINTS = {
  CUSTOMER_SERVICE: "http://localhost:9002/api/v1/customers",
  PRODUCT_CATALOG: "http://localhost:9003/api/products",
  ORDER_SERVICE: "http://localhost:9004/api/orders",
  SUBSCRIPTION_SERVICE: "http://localhost:9005/api/v1/subscriptions",
  BILLING_SERVICE: "http://localhost:9006/api/v1/invoices",
};

const client = axios.create({
  timeout: 8000,
});

// ---- Customer Service ----
export const createCustomer = (data: CustomerCreateRequest) =>
  client
    .post<Customer>(API_ENDPOINTS.CUSTOMER_SERVICE, data)
    .then((r) => r.data);

export const getCustomerById = (id: number | string) =>
  client
    .get<Customer>(`${API_ENDPOINTS.CUSTOMER_SERVICE}/${id}`)
    .then((r) => r.data);

export const approveCustomerKyc = (id: number | string) =>
  client
    .post<Customer>(`${API_ENDPOINTS.CUSTOMER_SERVICE}/${id}/kyc/approve`)
    .then((r) => r.data);

// ---- Product Catalog Service ----
export const getProducts = () =>
  client.get<Product[]>(API_ENDPOINTS.PRODUCT_CATALOG).then((r) => r.data);

export const getProductById = (id: number | string) =>
  client
    .get<Product>(`${API_ENDPOINTS.PRODUCT_CATALOG}/${id}`)
    .then((r) => r.data);

export const createProduct = (data: ProductCreateRequest) =>
  client
    .post<Product>(API_ENDPOINTS.PRODUCT_CATALOG, data)
    .then((r) => r.data);

// ---- Order Service ----
export const getOrders = () =>
  client.get<Order[]>(API_ENDPOINTS.ORDER_SERVICE).then((r) => r.data);

export const getOrdersByCustomerId = (customerId: number | string) =>
  client
    .get<Order[]>(`${API_ENDPOINTS.ORDER_SERVICE}/customer/${customerId}`)
    .then((r) => r.data);

export const createOrder = (data: CreateOrderRequest) =>
  client.post<Order>(API_ENDPOINTS.ORDER_SERVICE, data).then((r) => r.data);

// ---- Subscription Service ----
export const getSubscriptions = () =>
  client
    .get<Subscription[]>(API_ENDPOINTS.SUBSCRIPTION_SERVICE)
    .then((r) => r.data);

export const getSubscriptionById = (id: number | string) =>
  client
    .get<Subscription>(`${API_ENDPOINTS.SUBSCRIPTION_SERVICE}/${id}`)
    .then((r) => r.data);

export const getSubscriptionsByCustomerId = (customerId: number | string) =>
  client
    .get<Subscription[]>(
      `${API_ENDPOINTS.SUBSCRIPTION_SERVICE}/customer/${customerId}`
    )
    .then((r) => r.data);

export const createSubscription = (data: SubscriptionCreateRequest) =>
  client
    .post<Subscription>(API_ENDPOINTS.SUBSCRIPTION_SERVICE, data)
    .then((r) => r.data);

// ---- Billing Service ----
export const getInvoices = () =>
  client.get<Invoice[]>(API_ENDPOINTS.BILLING_SERVICE).then((r) => r.data);

export const getInvoiceById = (id: number | string) =>
  client
    .get<Invoice>(`${API_ENDPOINTS.BILLING_SERVICE}/${id}`)
    .then((r) => r.data);

export const getInvoicesByCustomerId = (customerId: number | string) =>
  client
    .get<Invoice[]>(`${API_ENDPOINTS.BILLING_SERVICE}/customer/${customerId}`)
    .then((r) => r.data);

export const createInvoice = (data: InvoiceCreateRequest) =>
  client
    .post<Invoice>(API_ENDPOINTS.BILLING_SERVICE, data)
    .then((r) => r.data);

// Axios/network hatalarını arayüzde gösterilebilir tek satırlık bir mesaja çevirir.
export function toErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const data = err.response.data as
        | { message?: string; error?: string }
        | undefined;
      return (
        data?.message ||
        data?.error ||
        `İstek başarısız oldu (HTTP ${err.response.status}).`
      );
    }
    return "Servise ulaşılamadı. Servisin çalıştığından ve CORS ayarlarından emin olun.";
  }
  return "Beklenmeyen bir hata oluştu.";
}
