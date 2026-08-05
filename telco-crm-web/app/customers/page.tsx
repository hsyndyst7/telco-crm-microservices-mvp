"use client";

import { FormEvent, useState } from "react";
import { Users, Search, ShieldCheck } from "lucide-react";
import {
  approveCustomerKyc,
  createCustomer,
  getCustomerById,
  toErrorMessage,
} from "@/src/lib/api";
import type { Customer } from "@/src/lib/types";
import {
  Alert,
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  StatusBadge,
} from "@/src/components/ui";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  identityNumber: "",
  email: "",
  phoneNumber: "",
};

export default function CustomersPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [created, setCreated] = useState<Customer | null>(null);

  const [lookupId, setLookupId] = useState("");
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [approving, setApproving] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    setCreated(null);
    try {
      const result = await createCustomer({
        ...form,
        phoneNumber: form.phoneNumber || undefined,
      });
      setCreated(result);
      setForm(EMPTY_FORM);
    } catch (err) {
      setCreateError(toErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    if (!lookupId) return;
    setLooking(true);
    setLookupError(null);
    setCustomer(null);
    try {
      const result = await getCustomerById(lookupId);
      setCustomer(result);
    } catch (err) {
      setLookupError(toErrorMessage(err));
    } finally {
      setLooking(false);
    }
  }

  async function handleApproveKyc() {
    if (!customer) return;
    setApproving(true);
    setLookupError(null);
    try {
      const result = await approveCustomerKyc(customer.id);
      setCustomer(result);
    } catch (err) {
      setLookupError(toErrorMessage(err));
    } finally {
      setApproving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Müşteriler"
        description="Yeni müşteri oluşturun veya mevcut bir müşteriyi kimlikle sorgulayın"
        icon={Users}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Yeni Müşteri
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ad">
                <Input
                  required
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </Field>
              <Field label="Soyad">
                <Input
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="TCKN (11 hane)">
              <Input
                required
                maxLength={11}
                pattern="[0-9]{11}"
                value={form.identityNumber}
                onChange={(e) =>
                  setForm({ ...form, identityNumber: e.target.value })
                }
              />
            </Field>
            <Field label="E-posta">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Telefon (opsiyonel)">
              <Input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </Field>
            {createError && <Alert kind="error">{createError}</Alert>}
            {created && (
              <Alert kind="success">
                Müşteri oluşturuldu — ID: {created.id} (durum: {created.status})
              </Alert>
            )}
            <Button type="submit" disabled={creating}>
              {creating ? "Oluşturuluyor..." : "Müşteri Oluştur"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Müşteri Sorgula
          </h2>
          <form onSubmit={handleLookup} className="mb-4 flex gap-2">
            <Input
              placeholder="Müşteri ID"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
            />
            <Button type="submit" variant="secondary" disabled={looking}>
              <Search size={16} />
              {looking ? "Aranıyor..." : "Ara"}
            </Button>
          </form>

          {lookupError && <Alert kind="error">{lookupError}</Alert>}

          {customer && (
            <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {customer.firstName} {customer.lastName}
                </span>
                <StatusBadge status={customer.status} />
              </div>
              <dl className="grid grid-cols-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                <dt>ID</dt>
                <dd>{customer.id}</dd>
                <dt>TCKN</dt>
                <dd>{customer.identityNumber}</dd>
                <dt>E-posta</dt>
                <dd>{customer.email}</dd>
                <dt>Telefon</dt>
                <dd>{customer.phoneNumber || "-"}</dd>
                <dt>Kayıt Tarihi</dt>
                <dd>
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleString("tr-TR")
                    : "-"}
                </dd>
              </dl>
              {customer.status === "PENDING" && (
                <Button
                  variant="secondary"
                  onClick={handleApproveKyc}
                  disabled={approving}
                >
                  <ShieldCheck size={16} />
                  {approving ? "Onaylanıyor..." : "KYC Onayla"}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
