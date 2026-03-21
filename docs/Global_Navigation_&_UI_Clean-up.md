# 🛠️ SpaceLens Blueprint: Global UI Clean-up & Breadcrumb Transition

## 1. Objective
Remove all static, large Page Titles and Subtitles (e.g., "Cấu hình quy tắc", "Thiết lập logic...") from the top of every feature page. Transition to a dynamic **Breadcrumb System** located in the Header for a cleaner, professional "Light Theme" SaaS aesthetic.

## 2. Visual & Structural Changes
- **Header.jsx:** Remove any logic that renders a large `h1` page title or a description `p` tag.
- **Breadcrumb Logic:** - Position: Far left of the Header.
    - Path Mapping: 
        - `analytics` -> `Phân tích`
        - `heatmap` -> `Bản đồ nhiệt`
        - `rules` -> `Cấu hình quy tắc`
        - `dashboard` -> `Tổng quan`
- **Page Content:** Feature pages (like `RuleConfiguration.jsx`) must start directly with their functional components (Form/Table) without a "Header Section" inside the page itself.

## 3. Style Guide (Light Mode)
- **Background:** `bg-slate-50`.
- **Header & Sidebar:** `bg-white border-slate-200`.
- **Text:** Primary `text-slate-900`, Breadcrumb separators `text-slate-300`.