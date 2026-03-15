StoreLens UI Blueprint: Layout, Header & Footer
1. Context & Design Vibe
Objective: Create a seamless, high-tech dashboard container.

Style: Glassmorphism (backdrop-blur), Dark theme primary (Indigo/Slate), sticky navigation, and smooth transitions using Framer Motion.

Structure: MainLayout wraps all protected routes.

2. Header Component (The Command Center)
The Header must act as the primary navigation and status bar.

Features to Include:
Brand Logo: StoreLens/SpaceLens logo (link to Dashboard).

Primary Navigation:

Dashboard: Overview KPIs (/).

Heatmap: Visual density analysis (/heatmap).

Analytics: Dwell-time & Zone performance (/analytics).

Management: Dropdown for Camera Config, Zone Setup, Product Management.

Real-time Status: A "Live" indicator (Green dot) showing AI Edge connection status.

User Profile: Avatar with dropdown (Settings, Logout).

Technical Requirements for Copilot:
Use lucide-react for icons: LayoutDashboard, Flame, BarChart3, Settings, Camera.

Style: sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md.

Active Link State: Highlight the current path with a subtle bottom border or color change.

3. Footer Component (The Info Bar)
The Footer should be minimal and clean.

Contents:
Copyright: © 2026 StoreLens - C2SE.11 Team.

System Version: v2.0 (Edge AI Optimized).

Quick Links: Privacy Policy, Documentation.

4. Main Layout (The Wrapper)
A functional wrapper that ensures consistency across all pages.

Structure:
JavaScript
<div className="min-h-screen bg-slate-900 text-slate-100">
  <Header />
  <main className="container mx-auto px-4 py-6">
    {/* Page Content goes here */}
    <Outlet /> 
  </main>
  <Footer />
</div>
5. Copilot Implementation Logic (Strict Guidelines)
State Check: Before rendering Header navigation, check auth.isAuthenticated from Redux state.

Responsive: On mobile, the Header navigation should collapse into a Hamburger menu.

Animations: Use Framer Motion for the Header dropdowns (initial={{ opacity: 0, y: -10 }}).