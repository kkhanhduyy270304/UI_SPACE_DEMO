# 🧭 Breadcrumb Navigation System

## Overview
A dynamic breadcrumb navigation system that automatically generates navigation paths based on the current URL. Replaces static page titles with contextual breadcrumb trails.

## Features

### ✅ Dynamic Path Generation
- Automatically extracts URL segments
- Maps routes to Vietnamese labels
- Updates in real-time with page navigation

### ✅ Light Theme Styling
- **Parent Links**: `text-slate-500` with hover effect
- **Current Page**: `text-slate-900 font-bold` 
- **Separator**: ChevronRight icon (`text-slate-300`)
- **Background**: White (matches header)

### ✅ Home Link
- Home icon at the start
- Links to Dashboard (`/`)
- Hidden on home page to avoid redundancy

### ✅ Responsive Design
- Hidden on mobile devices (breakpoint: lg)
- Desktop-only display in header

## Usage

### File Structure
```
src/components/layout/
├── Breadcrumbs.jsx    (New component)
├── Header.jsx         (Updated)
└── index.js          (Updated with export)
```

### Integration
The Breadcrumbs component is automatically integrated into the Header's left section:

```jsx
<div className="hidden lg:flex items-center min-w-0 flex-1 px-4 border-l border-slate-200">
  <Breadcrumbs />
</div>
```

## Route Label Mapping

| URL Segment | Display Label |
|------------|----------------|
| heatmap | Bản đồ nhiệt |
| analytics | Phân tích |
| dwell-time | Phân tích thời gian dừng |
| customer | Phân tích khách hàng |
| zone | Phân tích khu vực |
| management | Quản lý |
| cameras | Cấu hình camera |
| zones | Cấu hình zone |
| users | Người dùng |
| customers | Quản lý khách hàng |
| products | Quản lý tài sản |
| rules | Cấu hình rule |
| settings | Cài đặt |

## Examples

### Dashboard (Home Page)
```
[No breadcrumb displayed]
```

### Heatmap Page
```
🏠 > Bản đồ nhiệt
     (current page - bold)
```

### Analytics Sub-page
```
🏠 > Phân tích > Phân tích thời gian dừng
                 (current page - bold)
```

### Multi-level Management Route
```
🏠 > Quản lý > Cấu hình Camera
              (current page - bold)
```

## Component API

### Breadcrumbs Component

**Location**: `src/components/layout/Breadcrumbs.jsx`

**Props**: None (uses `useLocation` hook)

**Behavior**:
- Returns `null` on home page (`/`)
- Generates breadcrumb array from URL path
- Maps segments to Vietnamese labels via `segmentLabels` object
- Renders interactive navigation

## Styling Details

### Color Scheme
- **Active Breadcrumb Text**: `text-slate-900 font-bold` (14px)
- **Inactive Breadcrumb Links**: `text-slate-500` hover→`text-slate-700`
- **Separators**: `text-slate-300` (ChevronRight icon)
- **Background**: White (inherited from header)

### Accessibility
- Uses semantic `<nav>` element with `role="navigation"`
- `aria-label="breadcrumb"` for screen readers
- Home link has `aria-label="Home"`
- Links maintain proper contrast ratio (WCAG AA compliant)

## Future Enhancements

### Potential Features
1. **Breadcrumb Configuration Object** - Centralized route mapping
2. **Custom Separators** - Allow different icon/style separators
3. **Mobile Breadcrumbs** - Simplified breadcrumb for mobile
4. **Click Event Tracking** - Analytics on breadcrumb navigation
5. **Structured Data** - Add Schema.org breadcrumb markup

### Performance Notes
- Component uses `useLocation` from React Router (no external hooks)
- No unnecessary re-renders (only updates on location change)
- Path parsing is efficient (single split and filter operation)
