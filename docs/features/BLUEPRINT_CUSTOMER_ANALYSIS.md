# ðŸ› ï¸ SpaceLens Blueprint: Zone Analysis Page

## 1. Objective
Build the "Zone Performance Analysis" page (`src/features/Analytics/ZoneAnalysis.jsx`). This page acts as a microscope for specific physical areas within the store. It must **NOT** duplicate store-wide metrics (Dashboard) or user demographics (Customer Analysis). Instead, it strictly focuses on spatial utilization, zone-specific conversion, and traffic flow between zones based on `ZoneStats` and `FlowPatterns` data.

**CRITICAL REQUIREMENT:** Strict adherence to the professional light-themed layout (`bg-slate-50` main, `bg-white` cards, `rounded-2xl`, `border-slate-200`).

## 2. Tech Stack & Libraries
- **Stack:** React, Tailwind CSS, Redux Toolkit (for Global Filter).
- **Charting:** `recharts` (ComposedChart, AreaChart, BarChart).
- **Icons:** `lucide-react` (Map, Target, TrendingUp, ArrowRightLeft, Crosshair).

---

## 3. Implementation Steps (Tasks for AI Assistant)

### Step 1: Page Setup, State & Local Context
- Open/Create `src/features/Analytics/ZoneAnalysis.jsx`.
- Container: `<div className="bg-slate-50 min-h-screen p-6">`.
- Import `useSelector` for the Global Filter (`locationId`, `date`).
- **CRITICAL - Add Local State:** Create a `selectedZone` state (e.g., using `useState`). 
  - Add a sub-header or a row of "Tab Pills" (e.g., "All Zones", "Cashier", "Cosmetics", "Fashion") right below the page title. This allows the user to deep-dive into one specific zone.

### Step 2: Layout Row 1 - Zone-Specific KPIs (The Microscope)
Define a CSS Grid row: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6`.
If a specific zone is selected, these KPIs reflect *only* that zone (Source: `ZoneStats.Performance`):
1. **Zone Traffic:** `people_count` in this zone (Icon: `Map`, Color: `teal-400`).
2. **Zone Revenue / Value:** `total_sales_value` generated from assets in this zone (Icon: `Target`, Color: `emerald-400`).
3. **Zone Conversion Rate:** `conversion_rate` (Engaged vs. Just passed by) (Icon: `Crosshair`, Color: `indigo-400`).
4. **Peak Hour:** The busiest hour for this specific zone, e.g., "18:00 - 19:00" (Icon: `TrendingUp`, Color: `amber-400`).

### Step 3: Layout Row 2 - Spatial Performance Charts
Define a CSS Grid row: `grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6`.

#### 3.1: Traffic vs. Conversion by Zone (Left Card)
- **Title:** "Zone Efficiency Comparison".
- **Concept:** Compare all zones side-by-side to find the "dead zones" vs. "hot zones".
- **Chart Type:** `<ComposedChart />` from `recharts`.
- **Data Plot:** X-axis = Zone Names. 
  - Y-axis (Left) = Traffic Volume (Render as `<Bar dataKey="traffic" fill="#6366f1" radius={[4,4,0,0]} />`).
  - Y-axis (Right) = Conversion % (Render as `<Line dataKey="conversion" stroke="#10b981" type="monotone" />`).

#### 3.2: Hourly Utilization of Selected Zone (Right Card)
- **Title:** "Hourly Zone Utilization".
- **Concept:** Shows when the selected zone gets crowded.
- **Chart Type:** `<AreaChart />` from `recharts`.
- **Data Plot:** X-axis = Hours (08:00 - 22:00). Y-axis = People Count.
- **Style:** Teal (`#2dd4bf`) gradient fill, smooth curve.

### Step 4: Layout Row 3 - Flow Patterns & Assets (The Actionable Data)
Define a CSS Grid row: `grid grid-cols-1 lg:grid-cols-2 gap-6`.

#### 4.1: Zone Transition Flow (Left Card)
- **Title:** "Where do they go next?" (Luá»“ng di chuyá»ƒn tiáº¿p theo).
- **Concept:** Based on the `FlowPatterns` table, if the user is looking at "Cosmetics", where do customers typically go after leaving Cosmetics?
- **UI Structure:** A clean list/table.
  - Column 1: Next Destination Zone (e.g., "Cashier").
  - Column 2: Probability/Percentage (e.g., a progress bar showing 65%).
  - Column 3: Trend (Up/Down arrow).

#### 4.2: Top Engaging Assets within Zone (Right Card)
- **Title:** "Top Assets in Zone".
- **Concept:** Drill down from the Zone to the physical items inside it (Source: `ZoneStats.Performance.top_asset_id` and `InteractionLogs`).
- **UI Structure:** A light-themed table (`w-full text-left`).
  - Column 1: Asset Name (e.g., "Chanel Display Shelf").
  - Column 2: Total Interactions (Hits).
  - Column 3: Status Badge (e.g., `bg-teal-500/20 text-teal-500` for "High Engagement").

---

## 4. Development Constraints
- Ensure the UI components exactly match the existing `Dashboard.jsx` cards (`bg-white`, `border-slate-200`).
- The charts MUST respond to the `selectedZone` state. If "All Zones" is selected, the KPIs should aggregate, and the hourly chart should show the average across all zones.
- Provide comprehensive mock data representing `ZoneStats` and `FlowPatterns` to bring the visual to life immediately.
