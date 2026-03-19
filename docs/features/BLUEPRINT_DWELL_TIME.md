# ðŸ› ï¸ SpaceLens Blueprint: Dwell Time Analysis Page

## 1. Objective
Build the "Dwell Time Analytics" page (`src/features/Analytics/DwellTimeAnalysis.jsx`). This page focuses exclusively on how long customers stay in the store and within specific zones. 
**CRITICAL REQUIREMENT:** This page MUST strictly reuse the premium, light-themed UI components and grid layout structure previously established in the `Dashboard.jsx` page (bg-slate-50 main background, bg-white cards, rounded-2xl, border-slate-200).

## 2. UI/UX & Theming Standards (Reuse Dashboard Vibe)
- **Theme:** Light Slate/Gray palette.
- **Page Container:** `bg-slate-50 min-h-screen p-6`.
- **Card Styling:** `bg-white rounded-2xl border border-slate-200 p-6`.
- **Typography:** `text-slate-900` for primary values, `text-slate-400` for subtitles/labels.
- **Icons:** `lucide-react` (Clock, Timer, UserCheck, TrendingUp) using `text-teal-400` or `text-indigo-400` for accents.

## 3. Technical Requirements
- **Stack:** React, Tailwind CSS, Redux Toolkit.
- **State Management:** Connect to the Global Filter state (`locationId`, `cameraId`, `date`) using `useSelector`. 
- **Charting:** Use `recharts` for all data visualizations.
- **Mock Data Source:** Based on the `InteractionLogs` (`duration_seconds`) and `ZoneStats` -> `Performance` -> `avg_dwell_time` database schemas.

---

## 4. Implementation Steps (Tasks for AI Assistant)

### Step 1: Page Setup & State
- Open or create `src/features/Analytics/DwellTimeAnalysis.jsx`.
- Wrap the content in the standard page container.
- Add a Page Header: Title "Dwell Time Analytics" (`text-2xl font-bold text-slate-900`) and a subtitle "Analyze customer engagement duration across zones."
- Import `useSelector` to pull `{ locationId, cameraId, date }` from `state.filter`. Include a `useEffect` to mock data fetching when these change.

### Step 2: Layout Row 1 - Dwell Time KPIs
Define a CSS Grid row: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6`.
Create 4 identical premium KPI cards (reusing the Dashboard card style):
1. **Average Store Dwell Time:** e.g., "24.5 mins" (Icon: `Clock`).
2. **Peak Zone Dwell Time:** e.g., "45 mins" (Icon: `Timer`, highlight the max time spent in a single zone).
3. **High Engagement Ratio:** e.g., "68%" (Icon: `UserCheck`, percentage of visitors staying > 15 mins).
4. **Total Tracked Sessions:** e.g., "1,245" (Icon: `Activity`).

### Step 3: Layout Row 2 - Distribution & Trend Charts
Define a CSS Grid row: `grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6`. Use a 50/50 split.

#### 3.1: Dwell Time Distribution (Left Card)
- **Chart Type:** `<BarChart />` from `recharts`.
- **Purpose:** Show how many customers fall into specific time buckets.
- **X-Axis:** Time Buckets ("0-5 min", "5-15 min", "15-30 min", "30+ min").
- **Y-Axis:** Number of Visitors.
- **Style:** Use teal (`#2dd4bf`) or indigo (`#818cf8`) for the bars, with `radius={[4, 4, 0, 0]}` for rounded top corners.

#### 3.2: Average Dwell Time by Hour (Right Card)
- **Chart Type:** `<AreaChart />` or `<LineChart />` from `recharts`.
- **Purpose:** Show if customers stay longer in the morning vs. evening.
- **X-Axis:** Hours (08:00, 10:00, ..., 22:00).
- **Y-Axis:** Average Minutes.
- **Style:** Smooth curve (`type="monotone"`), dashed grid lines (`strokeDasharray="3 3"`), and a soft gradient fill.

### Step 4: Layout Row 3 - Zone Table & AI Insights
Define a CSS Grid row: `grid grid-cols-1 lg:grid-cols-3 gap-6`. Use a 2/3 and 1/3 split.

#### 4.1: Zone Dwell Time Ranking Table (Left - col-span-2)
- **Title:** "Zone Engagement Ranking".
- **UI:** A clean, light-themed table.
- **Columns:** Rank, Zone Name, Avg Dwell Time, Trend (Arrow up/down), Status (e.g., "High", "Normal", "Low").
- **Style:** `border-b border-slate-200` for table rows, `text-slate-300` for text.



## 5. Development Rules
- **No White Backgrounds:** Ensure absolutely no default white backgrounds leak into the charts or tables. Use `fill="#0f172a"` (slate-950) or `transparent` for Recharts backgrounds.
- **Component Reusability:** If you created a reusable `<Card>` or `<KPICard>` component during the Dashboard build, import and use it here.
