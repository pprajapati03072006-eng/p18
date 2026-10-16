
export default function ProductCard({ product, onEdit }) {
  const image = product.thumbnail || product.images?.[0];

  return (
    <article className="product-card animate-fade-up">
      <div className="product-image-stage relative flex h-52 items-center justify-center overflow-hidden p-6">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition duration-500 hover:scale-110"
          />
        ) : (
          <span className="text-5xl">◈</span>
        )}

        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-200 backdrop-blur">
          PRODUCT #{product.id}
        </span>

        <span className="absolute bottom-4 right-4 rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold capitalize text-violet-200">
          {product.category || "General"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {product.brand || "NEXUS EDITION"}
          </p>

          {product.rating != null && (
            <span className="shrink-0 text-xs font-semibold text-amber-300">
              ★ {product.rating}
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-12 text-lg font-bold leading-6 text-white">
          {product.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">
          {product.description || "No description available."}
        </p>

        <div className="my-5 border-t border-white/[0.08]" />

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Price
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight luxe-text">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <span
            className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${
              product.stock > 0
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-rose-400/20 bg-rose-400/10 text-rose-300"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} IN STOCK`
              : "OUT OF STOCK"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onEdit(product)}
          className="luxe-button mt-5 flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"
        >
          <span>✳</span>
          Edit Product
          <span className="ml-auto">↗</span>
        </button>
      </div>
    </article>
  );
}
