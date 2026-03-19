# 🛠️ SpaceLens Blueprint: Asset Management Module

## 1. Objective
Build the "Asset Management" page (`src/features/Settings/AssetManagement.jsx` or a standalone feature). This module manages the physical inventory within each zone (e.g., Exercise Machines, Product Racks, POS Terminals). It connects the physical asset to the database and defines its location for Heatmap/Zone Analysis.

## 2. UI/UX Standards (Consistent with Dashboard Vibe)
- **Theme:** Dark Slate (`bg-slate-950`).
- **Cards:** `bg-slate-900` with `border-slate-800` and `rounded-2xl`.
- **Interactions:** Use clear status badges (Active, Maintenance, Out of Stock).
- **Icons:** `lucide-react` (Package, Tool, MapPin, Plus, Trash2, Edit).

## 3. Data Schema Connection (DB Version 1)
This module directly interacts with the following tables:
- **Assets:** Core info (`name_product`, `brand`, `price`, `stock_quantity`, `status`).
- **Asset_Attributes:** Metadata (`maintenance_date`, `color`, `custom_note`).
- **Zones:** To link an asset to a specific area (`location_id`, `zone_id`).

---

## 4. Implementation Steps (Tasks for AI Assistant)

### Step 1: Page Layout & Asset Summary
- Create a grid of 3 Summary Cards at the top:
  1. **Total Assets:** Total count from `Assets` table.
  2. **Active Deployment:** Count where `status === true`.
  3. **Pending Maintenance:** Count based on `maintenance_date` in `Asset_Attributes`.

### Step 2: Asset Inventory Table (The Core)
- Build a premium dark table to list all assets.
- **Columns:**
  - **Asset Name & Brand:** Primary identifier.
  - **Zone:** Display the `zone_name` by joining with the `Zones` table.
  - **Price/Unit:** Financial data from `price` and `unit` fields.
  - **Stock:** `stock_quantity` with a progress bar if stock is low.
  - **Status:** Badge (Green for `Active`, Yellow for `Maintenance`, Red for `Inactive`).

### Step 3: "Add/Edit Asset" Modal
- Create a slide-over or center modal to input data.
- **Fields:**
  - Product Name, Brand, Category.
  - Deployment Zone (Dropdown fetching data from `Zones` table).
  - Price & Stock.
  - Maintenance Schedule (Date Picker).
  - Note/Attributes (TextArea).

### Step 4: Map Alignment (Mini-Map Tool)
- **Concept:** A small visual preview of the Zone's floor plan.
- **Feature:** Allow the user to "pin" the asset's location on a 2D grid. 
- **Output:** Save the `(x, y)` coordinates to be used for **Attention Score** calculation in the Zone Analysis module.

---

## 5. Development Constraints
- Use `framer-motion` for smooth modal transitions if available.
- Ensure the "Delete" action has a confirmation dialog to prevent data loss.
- Mock data should include varied categories (e.g., Gym Equipment, Retail Shelves, Electronics) to show versatility.