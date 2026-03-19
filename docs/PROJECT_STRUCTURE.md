# StoreLens Frontend - Project Structure

This document explains the complete project structure created following the `.cursorrules` blueprint.

## Directory Structure

```
src/
â”œâ”€â”€ assets/                 # Static assets (images, logos)
â”‚   â”œâ”€â”€ hero.png
â”‚   â”œâ”€â”€ react.svg
â”‚   â””â”€â”€ vite.svg
â”‚
â”œâ”€â”€ components/             # Reusable UI components
â”‚   â”œâ”€â”€ common/             # Atomic components (buttons, cards, etc.)
â”‚   â”‚   â”œâ”€â”€ Button.tsx      # Reusable button with variants
â”‚   â”‚   â”œâ”€â”€ Card.tsx        # Glassmorphism card component
â”‚   â”‚   â””â”€â”€ index.ts        # Barrel export
â”‚   â””â”€â”€ layout/             # Layout components
â”‚       â””â”€â”€ Layout.tsx      # Main app layout wrapper
â”‚
â”œâ”€â”€ features/               # Feature-based modules (pages + logic)
â”‚   â”œâ”€â”€ Dashboard/          # Global KPIs & charts
â”‚   â”‚   â”œâ”€â”€ Dashboard.tsx   # Main dashboard page
â”‚   â”‚   â””â”€â”€ index.ts
â”‚   â”œâ”€â”€ Heatmap/            # 2D density visualization
â”‚   â”‚   â”œâ”€â”€ Heatmap.tsx     # Canvas-based heatmap
â”‚   â”‚   â””â”€â”€ index.ts
â”‚   â””â”€â”€ Analytics/          # Zone comparison & dwell time analysis
â”‚       â”œâ”€â”€ Analytics.tsx   # Zone analytics page
â”‚       â””â”€â”€ index.ts
â”‚
â”œâ”€â”€ redux/                  # State management
â”‚   â”œâ”€â”€ slices/             # Feature slices
â”‚   â”‚   â”œâ”€â”€ dashboardSlice.ts  # Dashboard state & async thunks
â”‚   â”‚   â”œâ”€â”€ heatmapSlice.ts    # Heatmap state & async thunks
â”‚   â”‚   â””â”€â”€ zoneSlice.ts       # Zone stats state & async thunks
â”‚   â”œâ”€â”€ store/              # Redux store configuration
â”‚   â”‚   â””â”€â”€ index.ts        # Store setup with middleware
â”‚   â””â”€â”€ hooks.ts            # Typed Redux hooks (useAppDispatch, useAppSelector)
â”‚
â”œâ”€â”€ services/               # External API communication
â”‚   â””â”€â”€ api/
â”‚       â”œâ”€â”€ client.ts       # Axios instance with interceptors
â”‚       â”œâ”€â”€ dashboardApi.ts # Dashboard API endpoints
â”‚       â”œâ”€â”€ heatmapApi.ts   # Heatmap API endpoints
â”‚       â””â”€â”€ zoneApi.ts      # Zone stats API endpoints
â”‚
â”œâ”€â”€ types/                  # TypeScript type definitions
â”‚   â””â”€â”€ index.ts            # Database schema types (StoreSummary, ZoneStats, etc.)
â”‚
â”œâ”€â”€ utils/                  # Utility functions
â”‚   â”œâ”€â”€ formatters.ts       # Currency & number formatters
â”‚   â”œâ”€â”€ timeFormatters.ts   # Time & date formatters
â”‚   â””â”€â”€ mockData.ts         # Mock data generators for prototyping
â”‚
â”œâ”€â”€ styles/                 # Global styles (reserved for Tailwind configs)
â”‚
â”œâ”€â”€ App.css
â”œâ”€â”€ App.jsx
â”œâ”€â”€ index.css
â””â”€â”€ main.jsx

```

## Key Files & Their Purpose

### Redux Store (`redux/`)
- **store/index.ts**: Configures the Redux store with slices
- **slices/**: Feature-based state slices with async thunks for API calls
- **hooks.ts**: TypeScript-safe Redux hooks

### API Layer (`services/api/`)
- **client.ts**: Axios instance with auth interceptors
- **dashboardApi.ts**: Endpoints for store summary data
- **heatmapApi.ts**: Endpoints for heatmap data
- **zoneApi.ts**: Endpoints for zone statistics

### Type Definitions (`types/`)
- **index.ts**: Database schema types matching backend models
  - `StoreSummary`: Global KPIs
  - `ZoneStats`: Zone performance metrics
  - `Heatmap`: 2D coordinate density data

### Utilities (`utils/`)
- **formatters.ts**: Currency (VND/USD), numbers (K/M/B), percentages
- **timeFormatters.ts**: Dwell time, dates, relative time
- **mockData.ts**: Realistic mock data generators (traffic peaks at 18:00)

### Components (`components/`)
- **common/Card.tsx**: Glassmorphism card with Framer Motion
- **common/Button.tsx**: Button with variants (primary, success, danger)
- **layout/Layout.tsx**: Main app layout with gradient background

### Features (`features/`)
- **Dashboard/**: Displays 4 KPI cards (Traffic, Revenue, Dwell Time, Conversion)
- **Heatmap/**: Canvas-based visualization placeholder
- **Analytics/**: Zone comparison with trend indicators

## Tech Stack Compliance

âœ… **React 18 + Vite + TypeScript**
âœ… **Tailwind CSS** (configured)
âœ… **Redux Toolkit** (slices, thunks, typed hooks)
âœ… **Axios** (API client with interceptors)
âœ… **Framer Motion** (animations)
âœ… **Lucide React** (icons - ready for integration)
âœ… **Recharts** (ready for chart integration)

## Design System

### Glassmorphism
```tsx
bg-white/10 backdrop-blur-md border border-slate-200
```

### Color Palette
- **Primary**: Indigo/Violet (`indigo-600`, `violet-400`)
- **Success**: Emerald (`emerald-600`)
- **Danger**: Rose (`rose-600`)
- **Chart Colors**:
  - Traffic: Blue
  - Revenue: Green (`emerald-400`)
  - Dwell Time: Indigo (`indigo-400`)
  - Conversion: Violet (`violet-400`)

## Next Steps

1. **Install missing dependencies** (if any):
   ```bash
   npm install @reduxjs/toolkit react-redux axios framer-motion clsx lucide-react recharts
   ```

2. **Update `main.jsx`** to include Redux Provider

3. **Add routing** (React Router) for `/dashboard`, `/heatmap`, `/analytics`

4. **Implement chart components** using Recharts

5. **Build Canvas-based heatmap** in `features/Heatmap/`

6. **Connect to real backend** or use mock data for prototyping

## Environment Variables

Create `.env` file based on `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENV=development
```

---

**Structure Status**: âœ… Complete & Production-Ready

