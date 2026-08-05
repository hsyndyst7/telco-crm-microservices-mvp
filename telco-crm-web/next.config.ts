// next.config.ts
import type { NextConfig } from "next";

// Backend microservice base URLs. Overridable via env for non-local setups.
const CUSTOMER_SERVICE_URL =
  process.env.CUSTOMER_SERVICE_URL ?? "http://localhost:9002";
const PRODUCT_CATALOG_URL =
  process.env.PRODUCT_CATALOG_URL ?? "http://localhost:9003";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL ?? "http://localhost:9004";
const SUBSCRIPTION_SERVICE_URL =
  process.env.SUBSCRIPTION_SERVICE_URL ?? "http://localhost:9005";
const BILLING_SERVICE_URL =
  process.env.BILLING_SERVICE_URL ?? "http://localhost:9006";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/customers", destination: `${CUSTOMER_SERVICE_URL}/api/v1/customers` },
      { source: "/api/customers/:path*", destination: `${CUSTOMER_SERVICE_URL}/api/v1/customers/:path*` },

      { source: "/api/products", destination: `${PRODUCT_CATALOG_URL}/api/products` },
      { source: "/api/products/:path*", destination: `${PRODUCT_CATALOG_URL}/api/products/:path*` },

      { source: "/api/orders", destination: `${ORDER_SERVICE_URL}/api/orders` },
      { source: "/api/orders/:path*", destination: `${ORDER_SERVICE_URL}/api/orders/:path*` },

      { source: "/api/subscriptions", destination: `${SUBSCRIPTION_SERVICE_URL}/api/v1/subscriptions` },
      { source: "/api/subscriptions/:path*", destination: `${SUBSCRIPTION_SERVICE_URL}/api/v1/subscriptions/:path*` },

      { source: "/api/invoices", destination: `${BILLING_SERVICE_URL}/api/v1/invoices` },
      { source: "/api/invoices/:path*", destination: `${BILLING_SERVICE_URL}/api/v1/invoices/:path*` },
    ];
  },
};

export default nextConfig;
