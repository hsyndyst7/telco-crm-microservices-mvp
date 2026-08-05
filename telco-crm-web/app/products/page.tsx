"use client";

import { FormEvent, useEffect, useState } from "react";
import { Package } from "lucide-react";
import { createProduct, getProducts, toErrorMessage } from "@/src/lib/api";
import type { Product } from "@/src/lib/types";
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Spinner,
  Table,
  Td,
  Th,
} from "@/src/components/ui";

const EMPTY_FORM = { name: "", description: "", price: "", stockQuantity: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  function fetchProducts() {
    getProducts()
      .then(setProducts)
      .catch((err) => setListError(toErrorMessage(err)));
  }

  function reload() {
    setListError(null);
    setProducts(null);
    fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createProduct({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        stockQuantity: form.stockQuantity ? Number(form.stockQuantity) : undefined,
      });
      setForm(EMPTY_FORM);
      reload();
    } catch (err) {
      setCreateError(toErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Ürünler"
        description="Ürün kataloğunu görüntüleyin ve yeni ürün ekleyin"
        icon={Package}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Ürün Listesi
          </h2>
          {listError && <Alert kind="error">{listError}</Alert>}
          {!listError && products === null && <Spinner />}
          {!listError && products !== null && products.length === 0 && (
            <EmptyState message="Henüz ürün eklenmemiş." />
          )}
          {!listError && products !== null && products.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Ad</Th>
                  <Th>Açıklama</Th>
                  <Th>Fiyat</Th>
                  <Th>Stok</Th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <Td>{p.id}</Td>
                    <Td>{p.name}</Td>
                    <Td>{p.description || "-"}</Td>
                    <Td>{p.price} ₺</Td>
                    <Td>{p.stockQuantity ?? "-"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Yeni Ürün
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Field label="Ad">
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Açıklama">
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Field>
            <Field label="Fiyat">
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field label="Stok Adedi">
              <Input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) =>
                  setForm({ ...form, stockQuantity: e.target.value })
                }
              />
            </Field>
            {createError && <Alert kind="error">{createError}</Alert>}
            <Button type="submit" disabled={creating}>
              {creating ? "Ekleniyor..." : "Ürün Ekle"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
