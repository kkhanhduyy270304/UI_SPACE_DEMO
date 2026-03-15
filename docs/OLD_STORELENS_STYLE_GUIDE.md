StoreLens Frontend: Layout & UI Architecture Guide
1. Design Overview (The "Vibe")
The StoreLens UI is a high-tech, data-driven dashboard designed for store managers. It must feel Real-time, Intelligent, and Professional.

Theme: Primary Dark Mode (Slate-950) or Clean Light Mode (Slate-50) with Indigo accents.

Visual Style: Glassmorphism (backdrop-blur), subtle borders, and interactive data components.

Library Preferences: Tailwind CSS for styling, Lucide-React for icons, Framer Motion for transitions, and Recharts for data visualization.

2. Header: The Navigation & Control Hub
The Header is sticky and provides access to all core modules.

Functional Requirements:
Logo Area: Brand logo (StoreLens) linking to the root Dashboard.

Main Navigation (Center/Left):

Dashboard: Overview of store KPIs.

Heatmap: Visualization of customer density.

Analytics: Deep dive into Dwell Time and Zone performance.

Asset/Management: Dropdown for Camera Config, Product List, and User Management.

Status Indicators (Right):

Edge AI Status: A pulsing green/red dot indicating if the Edge AI module is currently broadcasting metadata.

Store Selector: A dropdown to switch between different physical store locations (if applicable).

User Profile: Avatar with a dropdown for Settings and Logout.

Copilot Instruction:
"Create a sticky Header with glassmorphism effect. Use NavLink from react-router-dom to handle active states with an underline transition. Ensure it is fully responsive with a mobile hamburger menu."

3. Main Dashboard: The Core Content
The Dashboard is a 12-column grid layout summarizing real-time store performance.

Layout Components:
KPI Row (Top): 4 Cards showing Total Traffic, Average Dwell Time, Total Revenue, and Conversion Rate. Use StoreSummary schema.

Visual Analytics (Middle):

Left (8 Cols): A TrafficChart (AreaChart) showing peak hours.

Right (4 Cols): TopProducts list based on zone performance.

Performance Detail (Bottom):

ZonePerformanceTable: Listing all ROIs (Entrance, Shelf A, etc.) with their specific Conversion Rates and Trends.

4. Footer: Minimal & Information-Dense
A clean footer to anchor the page.

Content:
Copyright: © 2026 StoreLens - C2SE.11 Team.

System Info: "Powered by Edge AI & OpenVINO | Version 2.0.1".

Utility Links: Privacy Policy and Technical Documentation.

5. Technical Implementation Details for Copilot
Data Fetching: Use Redux Slices (dashboardSlice, authSlice). Slices should match the MongoDB schemas (e.g., zonesSummary.model.js).

Responsive Design:

Mobile: Stacked 1-column layout.

Desktop: Grid-based multi-column layout.

Typescript Interfaces:

TypeScript
interface IStoreSummary {
  total_people_count: number;
  total_revenue: number;
  avg_dwell_time: number;
  conversion_rate: number;
}
6. Project "Old Style" Reference
To maintain consistency with the legacy StoreLens:

Use Corporate Blue (#1E40AF) for primary actions.

Use Monospaced Fonts for numerical counters to prevent layout shifting during real-time updates.

Keep the Heatmap Legend standard (Blue = Cold, Red = Hot).