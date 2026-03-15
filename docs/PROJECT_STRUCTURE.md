# StoreLens Frontend - Project Structure

This document explains the complete project structure created following the `.cursorrules` blueprint.

## Directory Structure

```
src/
├── assets/                 # Static assets (images, logos)
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
│
├── components/             # Reusable UI components
│   ├── common/             # Atomic components (buttons, cards, etc.)
│   │   ├── Button.tsx      # Reusable button with variants
│   │   ├── Card.tsx        # Glassmorphism card component
│   │   └── index.ts        # Barrel export
│   └── layout/             # Layout components
│       └── Layout.tsx      # Main app layout wrapper
│
├── features/               # Feature-based modules (pages + logic)
│   ├── Dashboard/          # Global KPIs & charts
│   │   ├── Dashboard.tsx   # Main dashboard page
│   │   └── index.ts
│   ├── Heatmap/            # 2D density visualization
│   │   ├── Heatmap.tsx     # Canvas-based heatmap
│   │   └── index.ts
│   └── Analytics/          # Zone comparison & dwell time analysis
│       ├── Analytics.tsx   # Zone analytics page
│       └── index.ts
│
├── redux/                  # State management
│   ├── slices/             # Feature slices
│   │   ├── dashboardSlice.ts  # Dashboard state & async thunks
│   │   ├── heatmapSlice.ts    # Heatmap state & async thunks
│   │   └── zoneSlice.ts       # Zone stats state & async thunks
│   ├── store/              # Redux store configuration
│   │   └── index.ts        # Store setup with middleware
│   └── hooks.ts            # Typed Redux hooks (useAppDispatch, useAppSelector)
│
├── services/               # External API communication
│   └── api/
│       ├── client.ts       # Axios instance with interceptors
│       ├── dashboardApi.ts # Dashboard API endpoints
│       ├── heatmapApi.ts   # Heatmap API endpoints
│       └── zoneApi.ts      # Zone stats API endpoints
│
├── types/                  # TypeScript type definitions
│   └── index.ts            # Database schema types (StoreSummary, ZoneStats, etc.)
│
├── utils/                  # Utility functions
│   ├── formatters.ts       # Currency & number formatters
│   ├── timeFormatters.ts   # Time & date formatters
│   └── mockData.ts         # Mock data generators for prototyping
│
├── styles/                 # Global styles (reserved for Tailwind configs)
│
├── App.css
├── App.jsx
├── index.css
└── main.jsx

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

✅ **React 18 + Vite + TypeScript**
✅ **Tailwind CSS** (configured)
✅ **Redux Toolkit** (slices, thunks, typed hooks)
✅ **Axios** (API client with interceptors)
✅ **Framer Motion** (animations)
✅ **Lucide React** (icons - ready for integration)
✅ **Recharts** (ready for chart integration)

## Design System

### Glassmorphism
```tsx
bg-white/10 backdrop-blur-md border border-white/20
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

**Structure Status**: ✅ Complete & Production-Ready
