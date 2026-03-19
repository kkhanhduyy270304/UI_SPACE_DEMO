# 🍞 SpaceLens Blueprint: Breadcrumb Navigation System (Light Theme)

## 1. Objective
Replace the static Page Titles in the Header with a dynamic **Breadcrumb Navigation** (e.g., `Home > Analytics > Heatmap`). This improves user orientation and aligns with the new **Light Professional Theme**.

## 2. Visual Standards (Light Mode)
- **Separator:** Use a forward slash `/` or a chevron `>` with `text-slate-300`.
- **Root Link:** The "Home" or "Dashboard" link should be clickable.
- **Active Page:** The last item in the breadcrumb should be `text-slate-900` and `font-semibold`.
- **Inactive Links:** Previous levels should be `text-slate-500` and hoverable (`hover:text-teal-600`).

## 3. Dynamic Logic (Implementation)
- **Library:** Use `useLocation` and `Link` from `react-router-dom`.
- **Mapping:** Create a dictionary to map path segments to readable names:
    - `analytics` -> `Analytics`
    - `heatmap` -> `Heatmap`
    - `customers` -> `Customers`
    - `assets` -> `Assets`
    - `rules` -> `Rule Configuration`

## 4. Layout Integration
- **Header.jsx:** Remove the `h1` tag that displays the single page title.
- **New Component:** Insert a `<Breadcrumbs />` component in the Left Section of the Header.