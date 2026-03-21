# 🏋️ SpaceLens Blueprint: Gym Asset Management (Timesoft Integrated)

## 1. Objective
Refactor `AssetManagement.jsx` to manage specialized gym assets that sync with a management system like **TimeGym**. The UI must be professional, light-themed, and focus on high-value equipment and IoT devices (Check-in gates, POS).

## 2. Integration Data Points (Timesoft Schema)
Instead of generic products, focus on:
- **IoT Devices:** Turnstiles (Cổng từ), FaceID/Fingerprint readers, POS Terminals.
- **Gym Equipment:** Treadmills, Strength Machines, Free Weights (Dumbbells).
- **Consumables:** Supplements, uniforms, water (integrated with Stock quantity).

## 3. UI Refactor (Light Professional)
- **Layout:** Use the **Excel-Hybrid Layout** (Form on left, Table on right).
- **Summary Cards:**
    1. **Device Status:** Connection status of IoT devices (Online/Offline).
    2. **Equipment Health:** Count of machines needing maintenance.
    3. **Inventory Value:** Total value of supplements/retail stock.

## 4. Simplified Table Columns
- **Asset ID & Name:** (e.g., TG-102: Treadmill Matrix V7).
- **Category:** (IoT Device / Cardio / Strength / Retail).
- **Assigned Zone:** (e.g., Khu vực Cardio, Lối vào).
- **Last Maintenance:** Date field.
- **Stock/Status:** Badge-based status (Active, Service Required).
- **Action:** Quick edit/delete.

---

## 5. Implementation Steps for AI
- **Header:** Ensure the component doesn't have an internal H1. Let the Breadcrumbs (`Home > Assets`) handle the title.
- **Form:** Simplify inputs to match typical Timesoft entry fields (Code, Name, Category, Price, Stock).
- **Mapping:** In the table, ensure IDs are displayed in a clean, mono-spaced font (`DM Mono`).