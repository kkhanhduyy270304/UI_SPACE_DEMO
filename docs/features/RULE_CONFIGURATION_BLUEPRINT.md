# ðŸ› ï¸ SpaceLens Blueprint: Rule Configuration System UI Refactor

## 1. Objective
Refactor the UI of the Rule Configuration page (`RuleConfiguration.jsx`) to match the **Professional Light Theme** established in the Dashboard. The goal is to improve visual hierarchy and input ergonomics without altering the existing state logic (`upG`, `upZ`, `upR`).

## 2. Global Styling & Layout
- **Container:** `bg-slate-50 min-h-screen p-6`.
- **Typography:** Titles in `DM Sans` (text-slate-900), numeric units in `DM Mono` (text-slate-500).
- **Section Headers:** Use a subtle subtle `uppercase tracking-widest text-xs font-semibold text-slate-500 mb-4`.

## 3. UI Component Specifications (Replication Guide)

### A. Rule Cards (The Container)
- **Style:** `bg-white border border-slate-200 rounded-2xl p-6 mb-6 relative overflow-hidden`.
- **Color Coding (Left Border):** Add a 4px solid left border:
    - **Retention:** `border-l-indigo-500`
    - **Zones:** `border-l-teal-500`
    - **Revenue:** `border-l-amber-500`
- **Animations:** Apply `animate-fade-in-up` (Tailwind transition) for newly added rows.

### B. Input Primitives (The Controls)
Refactor all standard inputs into these custom Tailwind-styled components:
1. **SI (Standard Input):** `bg-slate-50 border-slate-200 rounded-lg text-slate-700 focus:ring-1 focus:ring-teal-500/50`.
2. **SE (Custom Select):** Use a custom arrow icon. `appearance-none bg-slate-50 border-slate-200 rounded-lg px-4 py-2 pr-8`.
3. **NL (Numeric with Suffix):** - Wrap in a `relative` div.
    - Suffix (e.g., "ngÃ y", "â‚«"): `absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono`.
    - Input: `pr-12` padding to avoid text overlap.

### C. PrevRow (Natural Language Preview)
- **Style:** A dedicated block at the bottom of each rule row.
- **Visuals:** `mt-4 p-3 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-400 italic`.
- **Logic:** Must dynamically stringify the current row state (e.g., "If [Condition] then [Action]").

### D. Sticky Footer (Global Actions)
- **Style:** `fixed bottom-0 right-0 left-sidebar-width bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex justify-between items-center z-50`.
- **Left Side:** Active rule counter (`text-slate-400 text-sm`).
- **Right Side:** Primary "Save Configuration" button (`bg-teal-600 hover:bg-teal-500`) and secondary "Cancel".

---

## 4. Implementation Steps (Tasks for Copilot)

### Step 1: Component Refactor
- Rewrite the `RuleRow` component for each category (Retention, Zone, Revenue).
- Ensure the `onChange` events still call the original `upG`, `upZ`, `upR` functions. 
- **CRITICAL:** Do not rename the state variables or modify the logic for adding/deleting IDs.

### Step 2: Lucide Icon Integration
- **Retention Section:** Use `Users`.
- **Zone Section:** Use `MapPin`.
- **Revenue Section:** Use `BarChart3`.
- **Action Triggers:** Use `Zap` for notifications/alerts.

### Step 3: Layout Spacing
- Use a `flex flex-wrap items-center gap-4` for each rule row to ensure it wraps correctly on smaller screens.
- Use a Trash icon (`lucide-react`) with `text-rose-500/50 hover:text-rose-500` for the delete action.

---

## 5. Development Constraints
- Use strictly **Tailwind CSS**. Remove any remaining inline `<style>` tags or manual CSS strings.
- Currency Display: For Revenue rules, ensure any displayed values use short notation (e.g., `10,000,000 â‚«`).
