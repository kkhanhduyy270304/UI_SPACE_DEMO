# ðŸ› ï¸ SpaceLens Blueprint: Advanced Notification System & Header Layout Fix

## 1. Objective
Refactor the notification icon in `src/components/layout/Header.jsx` into an interactive **Notification Popover**. Simultaneously, fix the layout bug where the Search Bar overlaps the Page Title and Right Actions [Ref: image_fc9c09.png].

## 2. Header Layout Optimization (Immediate Fix)
To prevent the overlapping issue seen in current UI:
- **Left Section (Title):** Wrap in a container with `shrink-0` and `min-w-max`.
- **Middle Section (Search):** - Use `flex-1` with `flex justify-center`.
    - Apply `max-w-md` (max 448px) to the search input to ensure whitespace between elements.
- **Right Section (Actions):** Wrap the Notification and Profile in a `flex` container with `shrink-0`.

## 3. Notification Center Specifications (`NotificationPopover.jsx`)

### A. Visual Standards (Professional Light Theme)
- **Container:** Floating dropdown with `bg-white/95`, `backdrop-blur-xl`, `border border-slate-200`, and `shadow-2xl`.
- **Placement:** Positioned exactly under the Bell icon with `z-[100]`.
- **Empty State:** Minimalist placeholder with a "No new alerts" message.

### B. Functional Requirements
- **Categories:**
    - ðŸ”´ **Critical:** Camera disconnects, security breaches (Icon: `XCircle`, Color: `text-rose-500`).
    - ðŸŸ  **Warning:** High crowd density, long queues (Icon: `AlertTriangle`, Color: `text-amber-500`).
    - ðŸ”µ **Info:** Daily reports ready, system updates (Icon: `Info`, Color: `text-teal-500`).
- **Features:**
    - "Mark all as read" button at the top.
    - Click-away listener to close the popover.
    - Relative timestamps (e.g., "2m ago").
    - Scrollable list (max height: 400px) with a custom thin scrollbar.

## 4. Implementation Steps (Tasks for AI Assistant)

### Step 1: Component Refactor
Create `src/components/layout/NotificationPopover.jsx`. Use `framer-motion` for a smooth "Slide-Down" entrance effect.

### Step 2: Header Integration
Update `src/components/layout/Header.jsx`:
1. Import and place `<NotificationPopover />` where the old Bell icon was.
2. Apply `shrink-0` to the surrounding `div` containers as described in Section 2 to fix the overlapping text bug.
3. Ensure the Redux `authSlice` data is still correctly mapped for the profile section.

### Step 3: Notification Logic
- Implement a local state `isOpen` to toggle visibility.
- Map the provided Mock Data to the notification items.
- If there are unread items, add a pulsing red dot to the trigger icon.

## 5. Mock Data Structure
```javascript
const notifications = [
  {
    id: "n1",
    type: "critical",
    title: "Camera Entrance Offline",
    description: "Connection lost with Main Entrance camera at 10:15 AM.",
    time: "2m ago",
    isRead: false
  },
  {
    id: "n2",
    type: "warning",
    title: "High Density Alert",
    description: "Zone B exceeded the capacity limit (25 people).",
    time: "15m ago",
    isRead: false
  }
];
