StoreLens Blueprint: Rule Configuration System
1. Functional Objective
The Rule Configuration page allows store managers to define automation logic based on Edge AI insights and POS data. It transforms raw metrics into actionable business events.

Goal: Automate operations (e.g., notifying staff, flagging churn, tracking revenue goals).

Scope: Covers three main categories: Member Retention, Zone Performance, and Revenue Targets.

2. Technical Stack Context
Icons: lucide-react (Zap, Settings, Users, BarChart3, MapPin, etc.).

Font: 'DM Sans' for UI, 'DM Mono' for numerical data.

State Management: Local React useState for prototyping, intended for Redux persistence in production.

Styling: Tailwind CSS (Current code uses inline CSS + Global Styles tag, convert to pure Tailwind for new components).

3. Data Schema & Rule Types
A. Global Retention Rules (Member Behavior)
Logic: If customer violates check-in frequency -> Trigger Marketing Action.

Conditions: no_checkin (No visit), low_visit (Rare visit), no_pt_session (No personal training).

Actions: send_zalo, send_sms, alert_staff, flag_churn.

B. Zone & Category Rules (Spatial Analytics)
Logic: If Zone metric crosses threshold -> Trigger Operational Action.

Metrics: avg_duration (minutes), peak_count (people count), idle_time (wait time).

Zones: Cardio, Weights, Yoga, Pool, Functional, Locker.

Actions: alert_pt, notify_manager, redistribute (flow suggestion).

C. Revenue & Conversion Rules (Business Goals)
Logic: If Revenue targets are not met -> Trigger Financial Alert.

Metrics: daily_total, monthly_total, pt_sales, new_member_fee.

Operators: >, <, >=, <=.

4. UI Components to Replicate
Card Layout: Use a vertical color-coded border on the left (Indigo for Retention, Teal for Zones, Amber for Revenue).

Input Primitives:

SI: Standard text input.

SE: Custom select with arrow icon.

NL: Numeric input with a unit suffix (e.g., "ngày", "phút", "₫") pinned to the right inside the input.

Preview Row (PrevRow): A natural language sentence summary generated below each row (e.g., "If Zone Cardio Avg Duration > 45 mins -> Alert PT").

Sticky Footer: A status bar displaying total active rules and global actions (Save/Cancel).

5. Implementation Rules for Copilot
Formatting: Format currency for Revenue using a short notation (e.g., 1e9 -> 1 tỷ).

Dynamic Rows: Support adding/deleting rows in all three sections using unique IDs (Date.now()).

Animations: Implement fadeUp entry animation for new rule rows.

State Logic:

upG, upZ, upR: Update functions for each specific rule type.

Ensure all select options are mapped correctly from the provided constant arrays