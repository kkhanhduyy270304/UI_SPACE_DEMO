1. Functional Objective
The Settings Page is the control center for both individual users and system-wide configurations.

Personal Settings: Profile update, password change.

System Settings (Admin Only): API Keys management, Global AI thresholds, Theme toggles.

Notification Settings: Webhook URLs for alerts (Zalo/SMS), email reports frequency.

2. Page Structure (Based on image_7b1026.png Vibe)
The layout should use a Sidebar Navigation within the settings page or a Vertical Tab system.

A. Profile Section
Avatar Upload: Circular preview with an "Edit" overlay.

Form Fields: Full Name, Email (Read-only for staff), Role Badge (Admin/Manager/Staff).

Security: "Change Password" button that opens a modal.

B. Store/Business Configuration (Admin Only)
Business Info: Name, Address, Contact details.

Working Hours: Set opening/closing times (used for filtering AI traffic data).

AI Sensitivity: A slider to adjust the "Dwell Time" threshold (e.g., 5s to 60s) for what counts as an "Interaction".

C. Integration & Alerts
Zalo/SMS Webhook: Input fields to connect with external messaging APIs.

Reporting Schedule: Select days/times to receive automated PDF reports via email.

3. UI Components & Styles (Tailwind CSS)
Setting Groups
Container: bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6.

Title: text-lg font-bold text-slate-100 mb-4 flex items-center gap-2.

Labels: text-xs font-semibold text-slate-400 uppercase tracking-wider.

Form Elements
Inputs: bg-slate-900/50 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-sm.

Toggle Switch: A smooth animated switch for "Dark Mode" or "Email Notifications".

4. Technical Logic for Copilot
Permissions Handling
Constraint: Wrap sensitive settings (API Keys, AI thresholds) in a check: auth.user.role === 'admin'.

State: Sync local form changes before calling the updateUser or updateStore thunks.

Prompt for Copilot
"Create the Settings page using a vertical tab layout (Profile, Security, System, Notifications).

Use the Glassmorphism style from the Dashboard: bg-white/5 border-white/10.

Ensure that only users with the admin role can see the 'System' and 'Store Config' tabs.

Implement a 'Change Password' modal with validation (match new password, minimum length).

Add a 'Danger Zone' at the bottom of the System tab for deleting or resetting data, styled with text-rose-500 and a ConfirmationModal."