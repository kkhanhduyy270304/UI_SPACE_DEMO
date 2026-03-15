1. Overview Dashboard (Based on image_7b1026.png)
The dashboard must follow a strictly structured grid.

KPI Row (Top)
Style: 4 cards with glassmorphism (bg-white/10 backdrop-blur-md).

Indicators: Each card has a small Sparkline chart (mini area chart) at the bottom to show 24h trends.

Color Accents:

Total Traffic: Blue/Indigo.

Avg Dwell Time: Teal/Cyan.

Conversion Rate: Emerald/Green.

Revenue: Amber/Orange.

Middle Section (Main Charts)
Traffic Analysis: A large Area Chart using Recharts. X-axis: Time (00:00 - 23:00), Y-axis: People count. Use a gradient fill under the line.

Top Products: A list or vertical bar chart showing the most interacted items.

2. Heatmap Visuals (Based on image_7b1061.png)
This is a layered visualization over a camera background.

Background: Desaturated (grayscale) or dimmed camera snapshot to make the heat stand out.

Heat Layer:

Use a Gaussian Blur algorithm for the points.

Color Map: Blue (0.1) -> Cyan (0.3) -> Green (0.5) -> Yellow (0.7) -> Red (1.0).

Zone Overlay: Polygons must have thin, white, dashed borders with labels (e.g., "Zone A - 45 people") appearing only on hover.

3. Zone Configuration & Drawing (Based on image_7b107f.png)
The "Studio" vibe for drawing ROIs.

Canvas Interaction:

Crosshair Cursor: When in Draw Mode.

Visual Nodes: Each vertex is a white square with a 1px border.

Active Line: A blue-neon line connecting the last point to the mouse cursor before clicking.

Sidebar: A list of zones with Color Swatches. Each zone can be toggled (eye icon) or locked.

4. Analytical Tables (Based on image_7b1045.jpg)
Clean, corporate data presentation.

Header: Sticky, all caps, muted text (text-slate-400 text-xs font-bold).

Rows:

Subtle hover effect (hover:bg-indigo-500/5).

Trend Column: Use icons (ArrowUp, ArrowDown) with conditional colors.

Progress Bars: For "Target vs Actual" revenue, use thin horizontal bars inside the table cells.

5. Specific Prompt for Copilot (Copy & Paste)
"Implement the UI based on the attached images.

Use Tailwind CSS for the 'Glassmorphism' effect: backdrop-blur-md bg-opacity-10 border border-white/20.

For charts, use Recharts with custom Tooltips that match the dark theme.

Ensure the Heatmap Canvas scale matches the natural aspect ratio of the background image to prevent coordinate drifting.

Use DM Sans as the primary font and DM Mono for numerical counters to ensure they don't jump during real-time updates."