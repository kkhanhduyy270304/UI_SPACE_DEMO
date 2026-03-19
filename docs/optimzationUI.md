# ðŸ› ï¸ SpaceLens Optimization: Interface & Database Alignment Fixes

## 1. Objective
Refactor and optimize the current UI components in `ui_space_demo` to eliminate data-mismatch errors, improve performance using Redux, and ensure all features (Dashboard, Customer Analysis, Asset Management) strictly consume the correct fields from the `NCKH_DB` schema.

## 2. Identified Issues & Required Fixes

### Fix A: Global Filter & API Integration Sync
- **Issue:** Currently, some components might be using local state for filtering, causing a "desync" when navigating between Dashboard and Heatmap.
- **Fix:** - Centralize all data fetching in `src/services/api/`.
  - Ensure `Dashboard.jsx`, `ZoneAnalysis.jsx`, and `CustomerAnalysis.jsx` use the `useSelector` hook to listen to `filter.locationId`, `filter.cameraId`, and `filter.date`.
  - **Constraint:** Every API call MUST include these 3 parameters as query strings to match backend expectations.

### Fix B: Data Mapping for "Customer Analysis"
- **Issue:** The `Sessions` table uses `customer_type` ('new' vs 'returning'), but the UI might still be using old logic.
- **Fix:** Update `CustomerAnalysis.jsx` to map `customer_type` directly to the "New vs Returning" AreaChart. 
- **DB Match:** Use `entry_time` to calculate "Time of Day" traffic instead of hardcoded mock arrays.

### Fix C: Asset Management - Spatial Coordinates
- **Issue:** Assets are currently treated as a simple list. They lack the $(x, y)$ coordinate data required for "Attention Score" logic.
- **Fix:** - Update the Asset Table in `AssetManagement.jsx` to include a "Map Coordinate" column.
  - Add a "Coordinate Picker" modal: When adding an asset, allow clicking on a grid to save $(x, y)$ values into the `Assets` collection.

---

## 3. Optimization Tasks (Tasks for Copilot)

### Task 1: Refactor `Dashboard.jsx` (Grid & Performance)
- **Action:** Implement a "Loading Skeleton" for KPI cards and Charts.
- **UI Enhancement:** Use the split-bar layout (3 KPIs + 1 Real-time pulse) as per the previous blueprint.
- **Logic:** Ensure the `Realtime` data (Current Visitors/Queue) is fetched on a shorter interval (e.g., every 30s) than the historical charts.

### Task 2: Refactor `CustomerAnalysis.jsx` (Member Directory)
- **Action:** Implement "Infinite Scroll" or "Pagination" for the Recent Members table.
- **UI Enhancement:** Add a "Tier" badge system based on the frequency of `person_id` appearances in the `Sessions` table.
  - > 5 visits = `Gold/VIP`
  - > 2 visits = `Silver`
  - 1 visit = `New Member`

### Task 3: Chart Component Standardization
- **Action:** Create a reusable `StandardChartCard` wrapper in `src/components/common/`.
- **Properties:** It should handle the `bg-white`, `border-slate-200`, `rounded-2xl` styling, and provide a standard "Export CSV/PNG" button in the top right corner.

---

## 4. Database Field Mapping Checklist (Reference NCKH_DB)
Ensure Copilot uses these exact field names:
- **Locations:** `location_code`, `address`
- **Assets:** `name_product`, `brand`, `price`, `stock_quantity`
- **Sessions:** `session_uuid`, `customer_type`, `total_dwell_time_seconds`
- **KPIs:** `total_visitors`, `total_revenue`, `conversion_rate`

## 5. Deployment Step
1. Feed this file to Copilot.
2. Run: `npm install recharts lucide-react framer-motion` to ensure all necessary libraries are ready for the refactor.
