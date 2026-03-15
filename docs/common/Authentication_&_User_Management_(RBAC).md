Blueprint: Authentication & User Management (RBAC)
1. Functional Context
StoreLens uses a Role-Based Access Control (RBAC) system.

Login: Publicly accessible for registered users.

Registration (SignUp): Restricted. Only users with the admin role can access the "Add User" form to create accounts for manager or staff.

Logic: Based on authController.js and user.model.js from the backend source.

2. Authentication Flow (Login)
Visuals (Based on image_7b1026.png style)
Layout: Centered card with glassmorphism (bg-white/10 backdrop-blur-xl).

Fields: Email, Password (with eye-toggle icon).

Vibe: High-tech, dark background with indigo glow.

Technical Requirements
Use authen.thunk.js to handle the login action.

Store the JWT Token in localStorage and update the authenSlice state.

Redirect to /dashboard upon successful login.

3. Restricted Registration (The Admin "Add User" Feature)
Since business admins create accounts for others, the "SignUp" UI is actually part of the User Management module (ManagerUsers.jsx).

Visuals (Based on image_7aee9a.png & UserTable)
Add User Button: Only visible to admins.

Creation Modal:

Fields: Full Name, Email, Password, Role (Select: manager, staff), Assigned Store.

Style: Matching the legacy SignIn.jsx but wrapped in a modal.

Logic (Based on auth.routes.js)
The endpoint POST /api/auth/register must be protected by an isAdmin middleware.

Only an authenticated Admin can "Invite" or "Create" a new user profile.

4. Implementation Rules for Copilot
TypeScript Interfaces
TypeScript
interface IUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  storeId?: string;
}
Prompt for Copilot
"Implement the Login and User Creation system based on the legacy source code.

Create a SignIn component with a high-tech glassmorphism design.

Implement the ManagerUsers page where an Admin can view a UserTable and click 'Add User'.

The 'Add User' form must include a dropdown for 'Role' (Manager, Staff) and 'Store'.

Ensure all API calls go through authen.api.js and use the auth.middleware.js logic to restrict non-admin users from creating accounts."