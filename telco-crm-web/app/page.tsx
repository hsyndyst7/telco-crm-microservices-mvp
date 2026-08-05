"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Package, ShoppingCart, Repeat, Receipt } from "lucide-react";
import { getProducts, getOrders, getSubscriptions, getInvoices } from "@/src/lib/api";
import { Card, PageHeader } from "@/src/components/ui";

const MODULES = [
  {
    href: "/customers",
    label: "Müşteriler",
    icon: Users,
    description: "Müşteri kaydı oluştur, sorgula ve KYC onayla.",
  },
  {
    href: "/products",
    label: "Ürünler",
    icon: Package,
    description: "Ürün kataloğunu görüntüle ve yeni ürün ekle.",
  },
  {
    href: "/orders",
    label: "Siparişler",
    icon: ShoppingCart,
    description: "Siparişleri listele ve yeni sipariş oluştur.",
  },
  {
    href: "/subscriptions",
    label: "Abonelikler",
    icon: Repeat,
    description: "Abonelikleri listele ve yeni abonelik başlat.",
  },
  {
    href: "/invoices",
    label: "Faturalar",
    icon: Receipt,
    description: "Faturaları listele ve yeni fatura kes.",
  },
];

type Counts = Partial<Record<"products" | "orders" | "subscriptions" | "invoices", number>>;

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({});

  useEffect(() => {
    getProducts().then((v) => setCounts((c) => ({ ...c, products: v.length }))).catch(() => {});
    getOrders().then((v) => setCounts((c) => ({ ...c, orders: v.length }))).catch(() => {});
    getSubscriptions().then((v) => setCounts((c) => ({ ...c, subscriptions: v.length }))).catch(() => {});
    getInvoices().then((v) => setCounts((c) => ({ ...c, invoices: v.length }))).catch(() => {});
  }, []);

  const countByHref: Record<string, number | undefined> = {
    "/products": counts.products,
    "/orders": counts.orders,
    "/subscriptions": counts.subscriptions,
    "/invoices": counts.invoices,
  };

  return (
    <div>
      <PageHeader
        title="Genel Bakış"
        description="Telco CRM mikroservislerine hızlı erişim"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ href, label, icon: Icon, description }) => {
          const count = countByHref[href];
          return (
            <Link key={href} href={href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                    <Icon size={20} />
                  </span>
                  {count !== undefined && (
                    <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {count}
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {label}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {description}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
