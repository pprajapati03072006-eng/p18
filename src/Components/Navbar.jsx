
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <aside className="flex w-full flex-col justify-between border-b border-white/10 bg-[#0d0f19]/95 p-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-white/10 lg:p-6">
      <div>
        <NavLink to="/products" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl luxe-gradient text-2xl font-black text-slate-950 shadow-lg shadow-violet-500/20">
            N
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.2em]">
              NEXUS
            </h1>
            <p className="text-xs tracking-wider text-slate-500">
              OBISIDAN LUXE
            </p>
          </div>
        </NavLink>

        <p className="mb-3 mt-10 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Workspace
        </p>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? "border-violet-400/20 bg-violet-500/15 text-violet-200"
                : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <span className="text-lg">◈</span>
          Product Catalog
        </NavLink>

        <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400">
          <span className="text-lg">✳</span>
          Inventory Updates
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
          <span className="text-xs font-semibold text-slate-200">
            API CONNECTION
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Connected to the product demo service.
        </p>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-3/4 rounded-full luxe-gradient" />
        </div>
      </div>
    </aside>
  );
}
