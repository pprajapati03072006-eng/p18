
import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../Components/Navbar.jsx";
import ProductCard from "../Components/ProductCard.jsx";
import ProductForm from "../Components/ProductForm.jsx";

const API_URL = "https://dummyjson.com/products?limit=30";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  // Fetch products from the API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch products.");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Dynamic categories
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  // Search, filter and sort
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const text = [
        product.title,
        product.brand,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        text.includes(search.toLowerCase().trim()) &&
        (category === "all" || product.category === category)
      );
    });

    if (sortOrder === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, search, category, sortOrder]);

  // Dashboard statistics
  const inventoryValue = products.reduce(
    (total, p) => total + Number(p.price || 0) * Number(p.stock || 0),
    0
  );

  const outOfStock = products.filter((p) => p.stock <= 0).length;

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  ).length;

  // Update a product
  async function handleUpdate(updatedProduct) {
    setSaving(true);
    setNotice("");

    try {
      const response = await fetch(
        `https://dummyjson.com/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product.");
      }

      const result = await response.json();
      const savedProduct = { ...result, ...updatedProduct };

      setProducts((previous) =>
        previous.map((p) =>
          p.id === savedProduct.id ? savedProduct : p
        )
      );

      setSelectedProduct(null);
      setNotice(`✓ ${savedProduct.title} updated successfully!`);
    } catch (err) {
      setNotice(`⚠ ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setSortOrder("default");
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100 lg:flex">
      <Navbar />

      <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-10">
        {/* Header */}
        <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Workspace / Product Intelligence
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Product <span className="luxe-text">Studio.</span>
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Curate your catalog. Refine every detail.
            </p>
          </div>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="luxe-button px-5 py-3 text-sm"
          >
            ↻ {loading ? "Loading..." : "Refresh Catalog"}
          </button>
        </header>

        {/* Hero */}
        <section className="glass-panel relative mb-8 overflow-hidden rounded-3xl p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-violet-200">
              The Control Center
            </span>

            <h2 className="mt-5 text-2xl font-black text-white sm:text-4xl">
              Make every product{" "}
              <span className="luxe-text">count.</span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Explore your inventory, manage product details, and
              customize your collection in one beautiful workspace.
            </p>

            <button
              onClick={() =>
                document.getElementById("catalog")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="luxe-button mt-6 px-5 py-3 text-sm"
            >
              Explore Collection ↓
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-8 hidden text-[180px] font-black leading-none text-white/[0.03] sm:block">
            N
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total Products" value={products.length} icon="◈" color="violet" />
          <Stat label="Categories" value={categories.length} icon="▦" color="cyan" />
          <Stat label="Out of Stock" value={outOfStock} icon="⚠" color="rose" />
          <Stat
            label="Inventory Value"
            value={inventoryValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            })}
            icon="↗"
            color="emerald"
          />
        </section>

        {/* Stock alert */}
        {!loading && !error && lowStock > 0 && (
          <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-200">
            ⚠ {lowStock} products have 10 or fewer units remaining.
          </div>
        )}

        {/* Notification */}
        {notice && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-violet-400/20 bg-violet-400/[0.06] p-4 text-sm text-violet-200"
          >
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        {/* Search and filters */}
        <section
          id="catalog"
          className="glass-panel mb-6 scroll-mt-6 rounded-2xl p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_200px_200px]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="⌕  Search products, brands, categories..."
              className="luxe-input"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="luxe-input"
            >
              <option value="all">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="luxe-input"
            >
              <option value="default">Default Order</option>
              <option value="name">Name: A–Z</option>
              <option value="price-low">Price: Low–High</option>
              <option value="price-high">Price: High–Low</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <strong className="text-white">{filteredProducts.length}</strong>{" "}
              of <strong className="text-white">{products.length}</strong>{" "}
              products
            </p>

            {(search || category !== "all" || sortOrder !== "default") && (
              <button
                onClick={resetFilters}
                className="text-sm font-semibold text-violet-300 hover:text-cyan-300"
              >
                Reset filters ×
              </button>
            )}
          </div>
        </section>

        {/* Product grid heading */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300">
              Discover & Manage
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Curated Collection
            </h2>
          </div>
          {!loading && !error && (
            <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs text-violet-200">
              {filteredProducts.length} Items
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="h-52 bg-white/10" />
                <div className="space-y-4 p-5">
                  <div className="h-4 w-1/3 rounded bg-white/10" />
                  <div className="h-6 w-3/4 rounded bg-white/10" />
                  <div className="h-10 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="glass-panel rounded-2xl p-10 text-center">
            <p className="text-lg font-bold text-white">
              Unable to load products
            </p>
            <p className="mt-2 text-sm text-rose-300">{error}</p>
            <button
              onClick={fetchProducts}
              className="luxe-button mt-5 px-5 py-3"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-4xl text-violet-300">⌕</p>
            <h3 className="mt-4 font-bold text-white">No products found</h3>
            <p className="mt-2 text-sm text-slate-400">
              Try another search or clear the filters.
            </p>
            <button
              onClick={resetFilters}
              className="luxe-button mt-5 px-5 py-3"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={setSelectedProduct}
              />
            ))}
          </div>
        )}

        <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs tracking-widest text-slate-500">
          NEXUS STUDIO · PRODUCT MANAGEMENT
        </footer>
      </main>

      {/* Edit modal */}
      {selectedProduct && (
        <ProductForm
          key={selectedProduct.id}
          product={selectedProduct}
          saving={saving}
          onClose={() => {
            if (!saving) setSelectedProduct(null);
          }}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

function Stat({ label, value, icon, color }) {
  const colors = {
    violet: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  };

  return (
    <div className="glass-panel rounded-2xl p-5 transition duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-5 break-words text-2xl font-black text-white sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500">
        Live catalog metrics
      </p>
    </div>
  );
}
