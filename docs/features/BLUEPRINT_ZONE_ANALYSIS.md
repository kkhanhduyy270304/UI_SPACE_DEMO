# 🛠️ SpaceLens Blueprint: Zone Assets Analysis (Refactored)

## 1. Objective
Refactor the "Top Assets in Zone" section to "Top Areas of Interest (AoI)". Since direct physical interaction with objects is not being measured, this section will now represent the **dwell time and foot traffic density** specifically at the coordinates where key assets (racks, displays, machines) are located.

## 2. Refactored Logic (Data Mapping)
Instead of "Interactions," we will use **"Presence Density"**:
- **Source Data:** `Heatmap` collection (`heatmap_matrix`).
- **Logic:** We map the `(x, y)` coordinates of an Asset from the `Assets` table to the corresponding grid in the `heatmap_matrix`.
- **Metric:** The value will now be **"Attention Score"** (Based on how long and how many people stayed at that specific asset's coordinate).

---

## 3. Implementation Steps (Tasks for AI Assistant)

### Step 1: Update Table UI (`ZoneAnalysis.jsx`)
Change the "Top Assets" table to **"Top Attraction Points (AoI)"**.
- **Column 1: Asset/Point Name** (e.g., "Premium Rack A", "Promotion Table 1").
- **Column 2: Attention Score** (Replace "Hits"). Use a scale of 0-100 or a duration (e.g., "12.5 hrs total").
- **Column 3: Occupancy Rate** (Percentage of time this specific spot was occupied).
- **Column 4: Status** (Use badges: `Hot Spot`, `Normal`, `Dead Spot`).

### Step 2: Visual Representation
- **Requirement:** Add a small "Mini-map" or a "Thumbnail" next to the table.
- **Visual:** Use a simple SVG grid representing the zone. Highlight the coordinates of the Top 3 Assets with glowing pulses (matching the Dashboard's Emerald-400 theme).

---

## 4. Why this Change? (Business Justification)
- **Feasibility:** It uses existing `Heatmap` data which is already being collected by your AI.
- **Accuracy:** It removes the need for complex "Hand-object interaction" AI models, focusing on reliable "Presence" data.
- **Actionable Insight:** The manager still knows which display is effective. If "Rack A" has a high "Attention Score" but low sales in `BusinessEvents`, the product display might be attractive but the price is too high.

## 5. Mock Data Structure (for Copilot)
```javascript
const topAoIData = [
  { 
    name: "Cardio Machine Group A", 
    attentionScore: 92, 
    avgStay: "18 mins", 
    status: "Hot Spot",
    color: "text-emerald-400" 
  },
  { 
    name: "Supplement Display Shelf", 
    attentionScore: 45, 
    avgStay: "2 mins", 
    status: "Dead Spot",
    color: "text-rose-400" 
  }
];