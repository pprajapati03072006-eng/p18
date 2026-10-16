
import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
  description: "",
  thumbnail: "",
};

export default function ProductForm({
  product,
  onClose,
  onSave,
  saving,
}) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!product) return;

    setForm({
      title: product.title ?? "",
      price: String(product.price ?? ""),
      category: product.category ?? "",
      brand: product.brand ?? "",
      stock: String(product.stock ?? ""),
      description: product.description ?? "",
      thumbnail: product.thumbnail ?? product.images?.[0] ?? "",
    });

    setFormError("");
    setImageError(false);
  }, [product]);

  if (!product) return null;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "thumbnail") {
      setImageError(false);
    }

    if (formError) {
      setFormError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const title = form.title.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!title) {
      setFormError("Please enter a product name.");
      return;
    }

    if (
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setFormError("Please enter a valid, non-negative price.");
      return;
    }

    if (
      form.stock.trim() === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setFormError("Stock must be a non-negative whole number.");
      return;
    }

    if (!form.category.trim()) {
      setFormError("Please enter a product category.");
      return;
    }

    const thumbnail = form.thumbnail.trim();

    if (thumbnail) {
      try {
        const parsedUrl = new URL(thumbnail);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          setFormError("The image URL must start with HTTP or HTTPS.");
          return;
        }
      } catch {
        setFormError("Please enter a valid image URL.");
        return;
      }
    }

    onSave({
      ...product,
      ...form,
      title,
      price,
      stock,
      category: form.category.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
      thumbnail,
      images: thumbnail ? [thumbnail] : product.images,
    });
  }

  const labelClass =
    "block text-sm font-semibold text-slate-200";

  const inputClass = "luxe-input mt-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        className="my-auto w-full max-w-3xl animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-[#111421] text-white shadow-2xl shadow-violet-950/30"
      >
        {/* Modal header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-violet-600/20 via-indigo-500/10 to-cyan-400/10 px-5 py-6 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
                  Catalog Editor
                </span>

                <span className="text-xs text-slate-500">
                  ID #{product.id}
                </span>
              </div>

              <h2
                id="edit-product-title"
                className="mt-4 text-2xl font-black tracking-tight sm:text-3xl"
              >
                Edit <span className="luxe-text">Product.</span>
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-400">
                Refine your product details and save your changes.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Close edit form"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="custom-scrollbar max-h-[65vh] space-y-6 overflow-y-auto p-5 sm:p-8">
            {/* Live preview */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                Live Preview
              </p>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="product-image-stage flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 p-4 sm:h-32 sm:w-32">
                  {form.thumbnail && !imageError ? (
                    <img
                      key={form.thumbnail}
                      src={form.thumbnail}
                      alt={form.title || "Product preview"}
                      className="h-full w-full object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl">◈</span>
                      <p className="mt-2 text-[10px] text-slate-500">
                        {imageError ? "Image unavailable" : "No image"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {form.brand || "NEXUS EDITION"}
                  </p>

                  <h3 className="mt-2 break-words text-lg font-bold text-white">
                    {form.title || "Untitled Product"}
                  </h3>

                  <p className="mt-1 text-sm capitalize text-slate-400">
                    {form.category || "No category selected"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="text-2xl font-black luxe-text">
                      ${Number(form.price || 0).toFixed(2)}
                    </p>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1 text-xs text-cyan-200">
                      Stock: {form.stock || "0"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Validation error */}
            {formError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-300"
              >
                <span className="mr-2">⚠</span>
                {formError}
              </div>
            )}

            {/* Product name */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Product Name <span className="text-violet-300">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter product name"
                maxLength={150}
                required
              />
            </div>

            {/* Price and stock */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (USD) <span className="text-violet-300">*</span>
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-violet-300">
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="luxe-input pl-9"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stock" className={labelClass}>
                  Stock Quantity <span className="text-violet-300">*</span>
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Category and brand */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category <span className="text-violet-300">*</span>
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. beauty"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className={labelClass}>
                  Brand
                </label>

                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={form.brand}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter brand name"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="thumbnail" className={labelClass}>
                Product Image URL
              </label>

              <input
                id="thumbnail"
                name="thumbnail"
                type="url"
                value={form.thumbnail}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.com/product.jpg"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Use a direct image URL. The preview updates as you edit
                the URL.
              </p>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="description" className={labelClass}>
                  Product Description
                </label>

                <span className="text-xs text-slate-500">
                  {form.description.length}/2000
                </span>
              </div>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                className={`${inputClass} resize-y`}
                placeholder="Describe your product..."
              />
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="luxe-button inline-flex items-center justify-center gap-2 px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="inline-block animate-spin">↻</span>
                  Saving Changes...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Save Changes
                  <span className="ml-1">↗</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
