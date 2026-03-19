# ðŸ› ï¸ SpaceLens Blueprint: Optimized Header & Filter Flow

## 1. Objective
Refactor the relationship between `Header.jsx` and `GlobalFilter.jsx`. To prevent overlapping text [Ref: image_fc9c09.png], we will keep the Header clean for System Actions and use the Global Filter as a high-visibility sub-banner.

## 2. Header Refactor (The Clean Up)
- **Action:** Remove any complex filters currently inside `Header.jsx`.
- **Content:** - Left: Dynamic Page Title (shrink-0).
  - Middle: Search Bar (max-w-xs or max-w-sm to avoid pushing other elements).
  - Right: Notification & User Profile (shrink-0).
- **Style:** `sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200`.

## 3. Global Filter Refactor (The Floating Banner)
- **Placement:** Positioned immediately below the Header.
- **Style:** - Use the `rounded-full` pill design from `@BLUEPRINT_GLOBAL_FILTER.md`.
  - Background: `bg-white/50 backdrop-blur-sm`.
  - Border: `border border-slate-200`.
  - Shadow: `shadow-lg shadow-black/20`.
- **Layout:** `flex items-center gap-6 px-6 py-2`.

## 4. Layout Integration (`MainLayout.jsx`)
Adjust the main container structure to ensure perfect vertical flow:
```jsx
<div className="flex flex-col flex-1">
  <Header />
  {/* Filter container with padding to make it 'float' over the dark background */}
  <div className="sticky top-16 z-40 px-6 py-4 bg-slate-50">
    <GlobalFilter />
  </div>
  <main className="flex-1 px-6 pb-6">
    <Outlet />
  </main>
</div>
