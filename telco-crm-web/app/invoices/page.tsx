"use client";

import { FormEvent, useEffect, useState } from "react";
import { Receipt, Search } from "lucide-react";
import {
  createInvoice,
  getInvoices,
  getInvoicesByCustomerId,
  toErrorMessage,
} from "@/src/lib/api";
import type { Invoice } from "@/src/lib/types";
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

const EMPTY_FORM = { customerId: "", orderId: "", amount: "", status: "" };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [filterCustomerId, setFilterCustomerId] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  function loadAll() {
    setListError(null);
    setInvoices(null);
    getInvoices()
      .then(setInvoices)
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
    setInvoices(null);
    try {
      setInvoices(await getInvoicesByCustomerId(filterCustomerId));
    } catch (err) {
      setListError(toErrorMessage(err));
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createInvoice({
        customerId: Number(form.customerId),
        orderId: form.orderId ? Number(form.orderId) : undefined,
        amount: Number(form.amount),
        status: form.status || undefined,
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
        title="Faturalar"
        description="Faturaları listeleyin, müşteriye göre filtreleyin ve yeni fatura kesin"
        icon={Receipt}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Fatura Listesi
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
          {!listError && invoices === null && <Spinner />}
          {!listError && invoices !== null && invoices.length === 0 && (
            <EmptyState message="Kayıtlı fatura bulunamadı." />
          )}
          {!listError && invoices !== null && invoices.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Müşteri</Th>
                  <Th>Sipariş</Th>
                  <Th>Tutar</Th>
                  <Th>Durum</Th>
                  <Th>Kesim Tarihi</Th>
                  <Th>Son Ödeme</Th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <Td>{i.id}</Td>
                    <Td>{i.customerId}</Td>
                    <Td>{i.orderId ?? "-"}</Td>
                    <Td>{i.amount} ₺</Td>
                    <Td>
                      <StatusBadge status={i.status} />
                    </Td>
                    <Td>
                      {i.issueDate
                        ? new Date(i.issueDate).toLocaleString("tr-TR")
                        : "-"}
                    </Td>
                    <Td>
                      {i.dueDate
                        ? new Date(i.dueDate).toLocaleString("tr-TR")
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
            Yeni Fatura
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
            <Field label="Sipariş ID (opsiyonel)">
              <Input
                type="number"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
              />
            </Field>
            <Field label="Tutar">
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </Field>
            <Field label="Durum (opsiyonel, varsayılan UNPAID)">
              <Input
                placeholder="PAID / UNPAID / CANCELLED"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
            </Field>
            {createError && <Alert kind="error">{createError}</Alert>}
            <Button type="submit" disabled={creating}>
              {creating ? "Kesiliyor..." : "Fatura Oluştur"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
