# 📊 SpaceLens Blueprint: Rule Manager (Excel-Hybrid Edition)

## 1. Objective
Refactor `RuleConfiguration.jsx` into a **Split-Screen Hybrid Layout** designed for users familiar with Excel. 
- **Goal:** One side for structured input, one side for a clear data overview.
- **Theme:** Professional Light (Clean white, thin borders, high legibility).

## 2. Layout Structure (2-Column Grid)
For each category (Retention, Zone, Revenue), use a `grid-cols-12` layout:

### A. The "Entry Form" (Column Span: 4) - Left Side
- **Concept:** A "Fixed" sidebar form to add or edit a rule.
- **Style:** `bg-white border border-slate-200 rounded-xl p-6 sticky top-28 shadow-sm`.
- **Elements:** - Vertical stack of labeled inputs (Condition, Threshold, Action).
    - **Natural Language Tooltip:** A box showing the logic in a sentence: *"Nếu khách không đến 15 ngày thì Gửi Zalo"*.
    - **Primary CTA:** A large "Add to Table" button.

### B. The "Spreadsheet View" (Column Span: 8) - Right Side
- **Concept:** A clean, multi-column table showing all active rules.
- **Style:** `bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm`.
- **Table Specs:**
    - **Header:** `bg-slate-50 text-slate-500 font-bold text-[11px] uppercase border-b`.
    - **Rows:** `hover:bg-blue-50/30 transition-colors border-b last:border-0`.
    - **Columns:** Status (Toggle), Rule Summary (Text), Value, Action Type, Actions (Edit/Delete).

## 3. Input Primitives (Excel Style)
- **Selects/Inputs:** Use a "Flat" design. White background, `border-slate-300`, focus with a subtle teal glow.
- **Suffixes:** Units like "ngày", "phút", "₫" must be pinned inside the input field.

## 4. Logic Constraints
- **State Management:** Keep all existing functions (`upG`, `upZ`, `upR`, `addRule`, `deleteRule`).
- **Data Mapping:** The Table must map the numeric/ID values into human-readable Vietnamese labels (e.g., `send_zalo` -> `Gửi Zalo`).