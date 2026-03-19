# ðŸ› ï¸ SpaceLens Blueprint: Premium Dark-Theme Dashboard (v2)

## 1. Objective
Refactor the main Dashboard page (`src/features/Dashboard/Dashboard.jsx`) to implement a specific premium, light-themed grid layout. This revision splits the top analytical bar, integrates two distinct chart types (hourly traffic and daily revenue), and adds detailed zone ranking and performance tables. The entire UI must strictly mirror the aesthetic "Vibe" of the provided reference image (dark slate, high contrast, clean card borders).

## 2. UI/UX Guidelines & Theming (Replicating the Vibe)
- **Theme:** Light Slate/Gray palette (SaaS Premium aesthetic).
- **Background:** `bg-slate-50` or `bg-gray-950`.
- **Card Styling:** All component containers must be distinct "cards" with `rounded-2xl`, `bg-white` or `bg-gray-900`, and a subtle, crisp border `border border-slate-200`. Large internal padding (`p-6` or `p-8`).
- **Layout:** Standard CSS Grid or 12-column grid system with large gaps (`gap-6`) between cards.
- **Typography:** DM Sans (implied premium font). High contrast: `text-slate-900` for values, `text-slate-400` for titles. For numerical data in tables/charts, use a mono font like DM Mono.
- **Icons:** Use `lucide-react` (white or faded accent colors).

## 3. Technical Requirements
- **Stack:** React, Tailwind CSS, Redux (for filters).
- **State Management:** Connect to the Global Filter state (`locationId`, `cameraId`, `date`) using `useSelector`. Use `useEffect` to simulate fetching new data when filters change.
- **Charting:** `recharts` (MANDATORY).

---

## 4. Implementation Steps (Tasks for AI Assistant)

### Step 0: Dashboard Container Setup (Theming)
- Open or create `src/features/Dashboard/Dashboard.jsx`.
- Wrap the entire content in a main container using `bg-slate-50 p-6 min-h-screen`.
- Integrate Redux filter selectors (`const { locationId, cameraId, date } = useSelector((state) => state.filter);`). Add mock `useEffect` fetch logic.

### Step 1: Layout Row 1 - Analysis & Real-time Status (Split Bar)
Define a CSS Grid row: `grid grid-cols-5 gap-6 mb-6`.

#### 1.1: Standard KPI Cards (Left 3/5 Columns)
- Within this row, create a nested grid or flex container to hold 3 or 4 standard KPI Cards.
- Each KPI Card structure: Lucide icon (e.g., green `emerald-400` accent), title (`text-slate-400`), prominent value (`text-5xl text-slate-900 font-bold`), and a small percentage trend indicator.
- Mock KPI Types: Total Visitors (People Count), Avg Transaction Value, Conversion Rate, etc.

#### 1.2: Real-time Status Card (Right 2/5 Columns)
- Create a distinct card focused on live data.
- Use a live glowing indicator (like the pulsing effect from image reference) with `animate-ping` utility, colored `emerald-400` (green for "Live").
- Metrics to display: "Visitors Currently Inside Store" (count) and "Waiting in Checkout Queue" (count). Accentuate these live counts. Reference schema: `Realtime` collection.

### Step 2: Layout Row 2 - Deep Dive Charts
Define a CSS Grid row: `grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6`. Use 50/50 split or 60/40 split (Left wider).

#### 2.1: Hourly Visitor Traffic Chart (Left)
- Chart Type: Smooth `<AreaChart />` ( smoothed curve).
- Axis: X-axis shows hourly timestamps (08:00, 10:00... 22:00). Y-axis shows "People Count".
- Title: "Visitor Traffic by Hour (Smoothed)".
- Style: Use a teal (`teal-400`) gradient fill under the curve. Data source: Mocked `Chart_Data` array structure.

#### 2.2: Daily Revenue Chart (Right)
- Chart Type: Simple `<BarChart />`.
- Axis: X-axis shows Dates ('14 Mar', '15 Mar', '16 Mar'). Y-axis shows "Currency (VNÄ)".
- Title: "Daily Revenue Trend (Last 7 Days)". SourcePOS data (Mocked `KPIs` collection total revenue).
- Style: Solid amber (`amber-400`) or teal columns.

### Step 3: Layout Row 3 - Zone Performance Tables
Define a CSS Grid row: `grid grid-cols-1 lg:grid-cols-2 gap-6`.

#### 3.1: Top Zones Ranking by Traffic (Left)
- Title: "Top Performing Zones (People Count)". Source: Aggregated `InteractionLogs`.
- UI: Simple, high-contrast table structure. Columns: Rank, Zone Name, Total People Count.
- Style: Clean dark rows with light dividers. Highlight Zone Name. Accent color: Teal.

#### 3.2: Detailed Zone Performance Metrics (Right)
- Title: "Zone Performance Deep Dive (Operational Metrics)". Source: `ZoneStats` performance embeds.
- UI: A complex table displaying different KPIs per zone. Columns: Zone Name, Avg Dwell Time (minutes), Staff Interaction Hits, Conversion Ratio indicator.
- Style: Use progress bars or small simplified visual indicators within cells to denote high/low performance. Accent color: Amber.

---

## 5. Summary of Key Elements to Match Reference Vibe:
- Rounded corners (`rounded-2xl` for cards, `rounded-md` for buttons/selectors).
- Distinct `border border-slate-200` on every card block.
- Standardized gaps (`gap-6`).
- Dark background (`slate-950`) contrasting with slightly lighter cards (`slate-900`).
- Faded teal or green icons and accent lines.
