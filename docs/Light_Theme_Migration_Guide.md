# âšª SpaceLens Blueprint: Light Professional Theme Migration

## 1. Objective
Transform the entire StoreLens/SpaceLens UI from a Light Theme to a **Light Professional Theme**. The goal is to achieve a clean, airy, and high-contrast interface suitable for enterprise business analytics.

## 2. Global Color Palette Replacement
- **Main Background:** `bg-slate-50` -> `bg-slate-50` (or `bg-gray-50`).
- **Card Background:** `bg-white` -> `bg-white`.
- **Primary Text:** `text-slate-900` -> `text-slate-900`.
- **Secondary Text:** `text-slate-400` -> `text-slate-500`.
- **Borders:** `border-slate-200` -> `border-slate-200`.
- **Glassmorphism:** `bg-white/40 backdrop-blur-md` -> `bg-white/70 backdrop-blur-md shadow-sm`.

## 3. UI Component Adjustments
- **Cards:** Add subtle shadows (`shadow-sm` or `shadow-md`) to distinguish white cards from the light gray background.
- **Charts (Recharts):** Update `stroke` and `fill` colors. Grid lines should be `slate-100`. Tooltips must have a white background with dark text.
- **Sidebar:** Change from dark glassmorphism to `bg-white border-r border-slate-200`.
- **Inputs & Selects:** Use `bg-white border-slate-300 text-slate-900`. Focus state remains `ring-teal-500/50`.

## 4. Specific Page Refactors
- **Heatmap:** Ensure the SVG polygons and Canvas heatmap are still visible over a light-colored camera snapshot. May need to increase the `globalAlpha`.
- **Rule Configuration:** Keep the left-border accents (Indigo, Teal, Amber) but ensure they pop against the white card background.
- **Global Filter:** Transition from a dark pill to a `bg-white shadow-sm border border-slate-200` pill.
