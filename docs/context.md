# StoreLens Project Context & Knowledge Base

## 1. Project Essence
StoreLens is a real-time retail analytics platform.
- **Problem**: Physical stores have "data blind spots" compared to E-commerce.
- **Solution**: Use Edge AI (YOLOv8 + DeepSORT) to track behavior and link it with POS data.

## 2. Core Tech Stack (Vibe)
- **Frontend**: React, Vite, TypeScript, TailwindCSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express, MongoDB, Redis (Caching KPIs).
- **AI Layer**: Python, YOLOv8, DeepSORT, OpenVINO (Inference optimization).

## 3. Data Flow Architecture
1. **Edge AI**: RTSP Video -> YOLOv8 -> Metadata (ID, x, y, timestamp).
2. **Noise Reduction**: Filters out "ghost IDs" and short-duration flickers.
3. **Backend Enrichment**: Matches Tracking Data with POS Invoices via timestamp/zone.
4. **Daily Summarization**: Aggregates raw logs into `DailySummary` collections for instant FE loading.

## 4. Database Schema Mapping (Ground Truth)
- **StoreSummary**: Global KPIs (Total Traffic, Avg Dwell Time, Revenue).
- **ZoneStats**: Performance per ROI (Shelf A, Entrance, Checkout).
- **Heatmap**: 2D coordinate density logs for visualization.
- **InteractionLog**: Raw behavioral events (Entered zone, Stopped, Exited).

## 5. Coding Vibe & Standards
- **UI**: Modern, clean, glassmorphism, highly responsive.
- **State Management**: Redux Toolkit (Slices: `dashboard`, `heatmap`, `cameraZones`).
- **Logic**: Async thunks for API calls, Mock data first for UI prototyping.