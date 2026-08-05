"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Repeat,
  Receipt,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/customers", label: "Müşteriler", icon: Users },
  { href: "/products", label: "Ürünler", icon: Package },
  { href: "/orders", label: "Siparişler", icon: ShoppingCart },
  { href: "/subscriptions", label: "Abonelikler", icon: Repeat },
  { href: "/invoices", label: "Faturalar", icon: Receipt },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-5 dark:border-zinc-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          T
        </span>
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Telco CRM
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
