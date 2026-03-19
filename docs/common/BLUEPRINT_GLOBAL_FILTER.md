# 🛠️ SpaceLens Refactoring Blueprint: Refactoring Global Filter UI

## 1. Objective
Refactor the existing `GlobalFilter.jsx` component to adopt a premium, self-contained, light-gray banner aesthetic. Instead of a basic border-b container, this revision implements a soft-shadowed, `rounded-full` "card" layout inspired by the provided reference image. It creates a high-contrast relationship with the surrounding dark page background, focusing purely on UI aesthetics while preserving the existing Redux state logic.

## 2. UI/UX & Theming Standards (Replicating the Vibe)
- **Background Context:** The main page background must be defined as dark slate (`bg-slate-950` or `bg-gray-950`).
- **Filter Container (Card):** This must be a self-contained "banner" sitting within the page, not a borderless bar.
  - Tailwind Classes: `p-3 px-6`, `bg-slate-50`, `border border-slate-100`, `rounded-full`, `shadow-md`.
- **Horizontal Alignment:** `flex`, `items-center`, `gap-8` (larger gaps between groups).
- **Typography:** DM Sans (implied premium font).
  - **Labels:** (`Gym Center:`, `Devices:`, `Timeline:`) must be `text-sm font-normal text-slate-500`.
  - **Values (Select/Input):** (`Hồ Chí Minh Center`, `Main Camera 01`, `14 Mar 2024`) must be `text-sm font-semibold text-slate-900`.
- **Icons:** Use faded, teal (`text-teal-500` or `text-teal-400`) accent colors from lucide-react.

---

## 3. Technical Implementation Steps (Tasks for AI Assistant)

### Step 1: Update Store & Slice Confirmation
- Ensure `src/redux/slices/filterSlice.js` and `src/redux/store/index.js` remain unchanged. The logic (`locationId`, `cameraId`, `date` state and `setLocation`, `setCamera`, `setDate` actions) is preserved.

### Step 2: MainLayout Container Setup (Theming Context)
- Open `src/components/layout/MainLayout.jsx`.
- Ensure the main content area (`<main>`) has a dark background: `bg-slate-950` (or the equivalent dark slate color used for the sidebar).
- Wrap the `<GlobalFilter />` component inside the main layout with padding, so it sits within the dark page context: `<div className="p-6"><GlobalFilter /></div>`. This creates the card-like relationship.

### Step 3: Refactor Component Structure (`GlobalFilter.jsx`)
Rewrite the component with the new HTML and Tailwind structure.

#### 3.1: Outer Container (The rounded banner)
```jsx
// src/components/layout/GlobalFilter.jsx (Refactored structure)
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Video, Calendar } from 'lucide-react';
import { setLocation, setCamera, setDate } from '../../redux/slices/filterSlice';

const GlobalFilter = () => {
  const dispatch = useDispatch();
  const { locationId, cameraId, date } = useSelector((state) => state.filter);

  return (
    // MAIN CONTAINER: Light background, rounded-full, subtle border, shadow.
    <div className="bg-slate-50 border border-slate-100 rounded-full shadow-md px-6 py-3 flex items-center gap-8 sticky top-6 z-40">
      
      {/* Group 1: Location (Gym Center) */}
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-teal-500 shrink-0" />
        <div className="flex items-center gap-2">
          {/* Label: Normal weight, slate-500 */}
          <span className="text-sm font-normal text-slate-500">Gym Center:</span>
          {/* Value/Select: Semibold weight, slate-900, border-none, transparent bg */}
          <select 
            value={locationId}
            onChange={(e) => dispatch(setLocation(e.target.value))}
            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 cursor-pointer w-full p-0"
          >
            <option value="loc_all">Tất cả cơ sở</option>
            <option value="loc_01">Hồ Chí Minh Center</option>
            <option value="loc_02">Gym Quận 7</option>
          </select>
        </div>
      </div>

      {/* Group 2: Camera (Devices) */}
      {/* ... Add subtle separator line before Group 2 using: <div className="w-px h-6 bg-slate-300 mx-1"></div> */}
      <div className="w-px h-6 bg-slate-200 mx-1 shrink-0"></div>

      <div className="flex items-center gap-3">
        <Video className="w-5 h-5 text-teal-500 shrink-0" />
        <div className="flex items-center gap-2">
          {/* Label: Devices: */}
          <span className="text-sm font-normal text-slate-500">Devices:</span>
          {/* Value/Select: Semibold weight, slate-900, Main Camera 01 */}
          <select 
            value={cameraId}
            onChange={(e) => dispatch(setCamera(e.target.value))}
            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 cursor-pointer w-full p-0"
          >
            <option value="cam_all">Tất cả Camera</option>
            <option value="cam_01">Main Camera 01</option>
            <option value="cam_02">Camera Khu Tạ</option>
          </select>
        </div>
      </div>

      {/* Group 3: Date (Timeline) */}
      {/* ... Add subtle separator line before Group 3 using: <div className="w-px h-6 bg-slate-300 mx-1"></div> */}
      <div className="w-px h-6 bg-slate-200 mx-1 shrink-0"></div>

      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-teal-500 shrink-0" />
        <div className="flex items-center gap-2">
          {/* Label: Timeline: */}
          <span className="text-sm font-normal text-slate-500">Timeline:</span>
          {/* Value/Input date: Semibold weight, slate-900, styled like text. 14 Mar 2024. */}
          {/* Note: Standard <input type="date"> must be styled in Tailwind to look like text by removing outlines and borders, and forcing font properties. */}
          <input 
            type="date" 
            value={date}
            onChange={(e) => dispatch(setDate(e.target.value))}
            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 cursor-pointer w-full p-0"
          />
        </div>
      </div>

    </div>
  );
};

export default GlobalFilter;