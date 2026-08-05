"use client";

import { FormEvent, useEffect, useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import {
  createOrder,
  getOrders,
  getOrdersByCustomerId,
  toErrorMessage,
} from "@/src/lib/api";
import type { Order } from "@/src/lib/types";
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Spinner,
  StatusBadge,
  Table,
  Td,
  Th,
} from "@/src/components/ui";

const EMPTY_FORM = {
  customerId: "",
  productId: "",
  quantity: "1",
  totalPrice: "",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [filterCustomerId, setFilterCustomerId] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  function loadAll() {
    setListError(null);
    setOrders(null);
    getOrders()
      .then(setOrders)
      .catch((err) => setListError(toErrorMessage(err)));
  }

  useEffect(loadAll, []);

  async function handleFilter(e: FormEvent) {
    e.preventDefault();
    if (!filterCustomerId) {
      loadAll();
      return;
    }
    setListError(null);
    setOrders(null);
    try {
      setOrders(await getOrdersByCustomerId(filterCustomerId));
    } catch (err) {
      setListError(toErrorMessage(err));
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createOrder({
        customerId: Number(form.customerId),
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        totalPrice: Number(form.totalPrice),
      });
      setForm(EMPTY_FORM);
      loadAll();
    } catch (err) {
      setCreateError(toErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Siparişler"
        description="Siparişleri listeleyin, müşteriye göre filtreleyin ve yeni sipariş oluşturun"
        icon={ShoppingCart}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Sipariş Listesi
            </h2>
            <form onSubmit={handleFilter} className="flex gap-2">
              <Input
                placeholder="Müşteri ID ile filtrele"
                value={filterCustomerId}
                onChange={(e) => setFilterCustomerId(e.target.value)}
                className="w-44"
              />
              <Button type="submit" variant="secondary">
                <Search size={16} />
              </Button>
            </form>
          </div>
          {listError && <Alert kind="error">{listError}</Alert>}
          {!listError && orders === null && <Spinner />}
          {!listError && orders !== null && orders.length === 0 && (
            <EmptyState message="Kayıtlı sipariş bulunamadı." />
          )}
          {!listError && orders !== null && orders.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Müşteri</Th>
                  <Th>Ürün</Th>
                  <Th>Adet</Th>
                  <Th>Tutar</Th>
                  <Th>Durum</Th>
                  <Th>Tarih</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <Td>{o.id}</Td>
                    <Td>{o.customerId}</Td>
                    <Td>{o.productId}</Td>
                    <Td>{o.quantity}</Td>
                    <Td>{o.totalPrice} ₺</Td>
                    <Td>
                      <StatusBadge status={o.status} />
                    </Td>
                    <Td>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString("tr-TR")
                        : "-"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Yeni Sipariş
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Field label="Müşteri ID">
              <Input
                required
                type="number"
                value={form.customerId}
                onChange={(e) =>
                  setForm({ ...form, customerId: e.target.value })
                }
              />
            </Field>
            <Field label="Ürün ID">
              <Input
                required
                type="number"
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: e.target.value })
                }
              />
            </Field>
            <Field label="Adet">
              <Input
                required
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            </Field>
            <Field label="Toplam Tutar">
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.totalPrice}
                onChange={(e) =>
                  setForm({ ...form, totalPrice: e.target.value })
                }
              />
            </Field>
            {createError && <Alert kind="error">{createError}</Alert>}
            <Button type="submit" disabled={creating}>
              {creating ? "Oluşturuluyor..." : "Sipariş Oluştur"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
