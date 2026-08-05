"use client";

import { FormEvent, useEffect, useState } from "react";
import { Repeat, Search } from "lucide-react";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionsByCustomerId,
  toErrorMessage,
} from "@/src/lib/api";
import type { Subscription } from "@/src/lib/types";
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

const EMPTY_FORM = { customerId: "", planId: "", status: "" };

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(
    null
  );
  const [listError, setListError] = useState<string | null>(null);
  const [filterCustomerId, setFilterCustomerId] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  function loadAll() {
    setListError(null);
    setSubscriptions(null);
    getSubscriptions()
      .then(setSubscriptions)
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
    setSubscriptions(null);
    try {
      setSubscriptions(await getSubscriptionsByCustomerId(filterCustomerId));
    } catch (err) {
      setListError(toErrorMessage(err));
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createSubscription({
        customerId: Number(form.customerId),
        planId: Number(form.planId),
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
        title="Abonelikler"
        description="Abonelikleri listeleyin, müşteriye göre filtreleyin ve yeni abonelik başlatın"
        icon={Repeat}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Abonelik Listesi
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
          {!listError && subscriptions === null && <Spinner />}
          {!listError && subscriptions !== null && subscriptions.length === 0 && (
            <EmptyState message="Kayıtlı abonelik bulunamadı." />
          )}
          {!listError && subscriptions !== null && subscriptions.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Müşteri</Th>
                  <Th>Plan</Th>
                  <Th>Durum</Th>
                  <Th>Başlangıç</Th>
                  <Th>Bitiş</Th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id}>
                    <Td>{s.id}</Td>
                    <Td>{s.customerId}</Td>
                    <Td>{s.planId}</Td>
                    <Td>
                      <StatusBadge status={s.status} />
                    </Td>
                    <Td>
                      {s.startDate
                        ? new Date(s.startDate).toLocaleString("tr-TR")
                        : "-"}
                    </Td>
                    <Td>
                      {s.endDate
                        ? new Date(s.endDate).toLocaleString("tr-TR")
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
            Yeni Abonelik
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
            <Field label="Plan ID">
              <Input
                required
                type="number"
                value={form.planId}
                onChange={(e) => setForm({ ...form, planId: e.target.value })}
              />
            </Field>
            <Field label="Durum (opsiyonel, varsayılan ACTIVE)">
              <Input
                placeholder="ACTIVE / CANCELLED / SUSPENDED"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
            </Field>
            {createError && <Alert kind="error">{createError}</Alert>}
            <Button type="submit" disabled={creating}>
              {creating ? "Oluşturuluyor..." : "Abonelik Oluştur"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
