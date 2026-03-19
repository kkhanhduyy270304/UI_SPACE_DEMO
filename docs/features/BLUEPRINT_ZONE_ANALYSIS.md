# 🛠️ Zone Analysis Feature

## 1. Objective
Provide real-time and historical analysis of customer movement, dwell time patterns, and zone performance across the store. Display key metrics, traffic trends, and movement paths for data-driven store optimization.

## 2. Core Components

### 2.1 Summary Cards
Display key performance indicators:
- **Total Daily Traffic**: Cumulative customer count for the day with growth percentage comparison
- **Live Customers**: Current number of customers in-store with real-time growth trend
- **Average Dwell Time**: Mean time customers spend in the store (in minutes)
- **Zone Performance**: Overall store efficiency metric (as percentage)

Each card includes:
- Descriptive label and current value
- Growth trend indicator (up/down arrow with percentage)
- Color-coded metrics (blue for traffic, emerald for activity, amber for time, violet for performance)

### 2.2 Hourly Traffic Chart
Interactive area chart showing traffic volume patterns across the day:
- **X-Axis**: Hour of day (0-23)
- **Y-Axis**: Customer count
- **Toggle Options**: Today | Last 7 Days
- **Visual**: Gradient area fill for emphasis

### 2.3 Movement Paths Section
Displays customer navigation patterns between zones:
- Shows "From Zone" → "To Zone" transitions
- Includes confidence percentage for each path
- Scrollable list for multiple paths
- Uses border styling to highlight interesting patterns

### 2.4 Zone Status Table
Detailed breakdown of performance by individual zone:
- **Zone**: Zone name (Entrance, Checkout, Discount Area, etc.)
- **Sensor ID**: Unique identifier for the monitoring device
- **Today Count**: Customer count for current day
- **Change %**: Comparison with previous day (green for up, red for down)
- **Live**: Current active customers in that zone
- **Avg Dwell**: Average time spent in the zone
- **Recommendation**: System suggestion badge (Normal, Open Counter, Promotion)