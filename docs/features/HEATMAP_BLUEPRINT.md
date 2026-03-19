SpaceLens Blueprint Update: Heatmap Timeline & Playback
1. Objective
Add a Temporal Layer (Trục thời gian) to the Heatmap. This allows users to scrub through different hours of the day or "Play" an animation to see how foot traffic flows over time.

2. UI Component: The Range Slider Timeline
Placement: Bottom of the Heatmap container, spanning full width.

Style: - Track: bg-slate-800 h-1.5 rounded-full.

Handle (Thumb): bg-teal-500 w-4 h-4 rounded-full shadow-lg border-2 border-white.

Display: A floating tooltip above the handle showing the current time (e.g., 14:30).

3. Playback Controls
Next to the Timeline, add a control group:

Play/Pause Button: To auto-increment the timeline.

Speed Selector: (1x, 2x, 4x) to speed up the visual evolution of the heatmap.

Loop Toggle: To restart the animation automatically.

4. Implementation Logic (Tasks for AI)
Step 1: Data Integration
Instead of fetching a single heatmap_matrix, the API src/services/api/heatmapApi.js should now support fetching a Series of matrices for a time range (e.g., from 08:00 to 22:00).

State: Add currentTimeIndex to heatmapSlice.js.

Step 2: Canvas Animation Loop
When the user hits "Play", use requestAnimationFrame to transition between matrices.

Interpolation: (Advanced) If possible, smoothly fade the previous heatmap points into the new ones to avoid "flickering".

Step 3: Filter Sync
Ensure the Camera-only filter we discussed earlier remains, but it now acts as the anchor for this Timeline. When Camera is changed, the Timeline resets to the start of the day.

5. Implementation Prompt for Copilot/Cursor
Prompt:
"I need to add a Timeline Playback feature to Heatmap.jsx based on the @BLUEPRINT_UPDATE.

UI: Add a professional Range Slider at the bottom of the Heatmap canvas. Use bg-slate-800 for the bar and bg-teal-500 for the handle.

Controls: Add Play/Pause and Playback Speed (1x, 2x, 4x) buttons using Lucide-react icons.

Logic: >    - The timeline should represent hours of the day (e.g., 08:00 - 22:00).

As the user drags the slider, the Canvas should redraw the heatmap_matrix corresponding to that specific time.

When 'Play' is clicked, automatically advance the slider and update the heatmap every 500ms.