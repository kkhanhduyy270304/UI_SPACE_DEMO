1. Functional Overview
The Camera Management page is the administrative hub for handling all hardware inputs (IP Cameras).

Goal: List, add, edit, and monitor the connection status of RTSP streams.

Key Indicators: Stream URL validation, active/inactive status, and assigned store location.

2. Visual Structure (Based on image_7aee9a.png)
The page follows a Header-Stats-Table layout:

A. Top Stats Row
Total Cameras: Total count of registered devices.

Active Streams: Number of cameras currently sending data (Status: Active).

Issues/Offline: Number of cameras with connection failures.

Style: Use the StatCard component from your source with backdrop-blur-md and unique icon colors (Indigo, Emerald, Rose).

B. Camera List (Table/Grid)
Based on camera.schema.js, the list must display:

Camera Name: Friendly name (e.g., "Front Entrance").

RTSP URL: The stream address (masked for security, showing only the IP/Port).

Assigned Store: Which physical store this camera belongs to.

Status: A badge indicating Active (Green) or Inactive (Gray/Red).

Actions: Edit (Pen icon), Delete (Trash icon), and Preview (Play icon to test the stream).

3. UI Components & Styles (Tailwind CSS)
The Add/Edit Modal
Form Fields: name, rtsp_url, store_id (Dropdown), description.

Style: bg-slate-900/90 border border-white/20 shadow-2xl rounded-xl.

Button: Use the "Save Configuration" style with linear-gradient(135deg, #6366f1, #4f46e5).

Connection Badge
Logic: Use a pulsing animation for the "Live" status.

Class: relative flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse.

4. Technical Logic for Copilot
Data Fetching & State
Thunk: cameraManagement.js (Ensure the getAllCameras and addCamera functions are mapped to the UI).

Validation: RTSP URL must start with rtsp://.

Implementation Prompt:
"Reconstruct the ManagerCameras page using the provided source code and image_7aee9a.png.

Use the StatCard components for the top metrics.

Implement a responsive table for the camera list with a 'Glassmorphism' feel: bg-white/5 border border-white/10 rounded-lg.

Map the 'Status' column to the status field in camera.model.js.

Add a 'Preview' button that opens a small modal to check the camera's snapshot (using the Edge AI metadata endpoint)."