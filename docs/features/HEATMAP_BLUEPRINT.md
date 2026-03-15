Zone Management System (SVG Drawing Engine)
Prompt:

"Reconstruct the CameraZoneManager component based on the legacy source code.

Visuals: Use a relative container holding a camera snapshot image with an SVG layer exactly on top.

Drawing Logic: Implement polygon drawing using normalized coordinates (0-1). Points must be calculated as clientX / imageWidth and clientY / imageHeight to ensure responsiveness.

Legacy Styles:

Vertices must be small draggable circles (6px, white fill, indigo stroke).

Polygons should have a semi-transparent fill (fill-opacity="0.3") using the color property from the zone data.

Active/Selected zones must have a dashed stroke-array border.

Tools: Include the ToolDrawZone bar with modes: 'Select', 'Draw', 'Delete'.

State: Sync with cameraZonesSlice using Redux. Each zone must have name, type, points[], and color."

2. Heatmap Analysis Interface
Prompt:

"Recreate the Heatmap feature following the legacy CanvaHeatmap.jsx logic.

Layering:

Bottom: Static image from camera_id.

Middle: A <canvas> element for the heatmap density.

Top: Static SVG polygons of configured ROIs.

Heatmap Algorithm: Use the legacy point-radius method. Each point from the heatmap.model.js schema (x, y, intensity) should be rendered with a radial gradient.

Controls: Reconstruct the LeftSidebar with sliders for:

Radius: Controls the spread of heat.

Opacity: Controls the transparency of the canvas layer.

Intensity: Scales the 'value' of each data point.

Time Range: Ensure the date-time picker filters the data points correctly via the heatmap.thunk.js."

3. Global Styling & Layout (The "Vibe")
Prompt:

"Apply the legacy styling system to the MainLayout.

Typography: Use 'DM Sans' for general text and 'DM Mono' for numeric data (KPIs/Coordinates).

Cards: Use the .card class with specific left-border accents (Indigo for general, Teal for active zones).

Sidebar: Implement the legacy Navbar with the glassmorphism effect (bg-white/10 backdrop-blur-md).

Components: Ensure all buttons use the legacy transition (transition: all .15s) and hover scales."