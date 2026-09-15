# 📊 Enterprise Admin Dashboard

A modern, high-performance E-Commerce & Analytics Admin Dashboard built with **React**, **TypeScript**, **Redux Toolkit (RTK Query)**, **Material UI (MUI)**, and **Vite**.

Designed with an emphasis on strict type safety, modular state architecture, responsive side-by-side drawer workflows, and seamless theme switching.

---

## 🚀 Live Demo & Test Credentials

- **Frontend Deployment (Vercel):** [https://admin-dashboard-antrit0s.vercel.app](https://admin-dashboard-seven-mu-48.vercel.app/)
- **Mock REST API Backend (Render):** [https://admin-dashboard-api.onrender.com](https://admin-dashboard-api.onrender.com)

### 🔑 Demo Login Credentials
| Field | Value |
| :--- | :--- |
| **Username** | `admin` |
| **Password** | `admin` |

> **Note on Free-Tier Hosting:** On initial launch, the Render free-tier backend may take ~30–50 seconds to spin up from cold sleep. Subsequent API requests will be instantaneous.[cite: 10]

---

## ✨ Key Features & Highlights

- **🔐 Authentication & Route Protection (`ProtectedRoute.tsx`):**
  - Token-based login with persistent authentication via Redux Toolkit (`authSlice`).[cite: 12, 21, 22]
  - Form validation powered by **Zod** and **React Hook Form**.[cite: 21]
  - Secure path guarding with `ProtectedRoute` redirecting unauthenticated users while retaining target route memory (`location.state`).[cite: 21, 22]

- **📁 Category & Product Taxonomy Management (`Categories.tsx`, `viewCatProd.tsx`):**
  - Full CRUD lifecycle management for categories with dynamic slug generation.[cite: 18, 19]
  - Drill-down sub-views allowing administrators to inspect and filter all products linked to a target category.[cite: 18, 20]
  - Slide-out inline form drawers (`CategoryDrawer.tsx`) for seamless creation and inline editing without navigating away from data views.[cite: 18, 19]

- **👥 Customer Data Operations (`Customers.tsx`, `CustomerDrawer.tsx`):**
  - Search, filter, and paginate customer records in real time.[cite: 17]
  - Dedicated side-by-side drawer for editing customer details and reviewing registration dates and statuses.[cite: 16, 17]

- **📈 Business Analytics & Visualization (`Home.tsx`):**
  - High-level KPI metric cards covering total revenue, active orders, customer growth, and inventory counts.[cite: 15]
  - Responsive charts built with **Recharts** featuring custom time-series tick rendering tuned for mobile and desktop screens.[cite: 15]

- **🎨 Advanced Material UI (MUI) Theming & Responsive Layout:**
  - Integrated Light/Dark theme toggling using `@mui/material/styles` (`useColorScheme`).[cite: 13]
  - Fully responsive desktop/mobile navbar navigation (`Navbar.tsx`) with dynamic drawer controls (`useMediaQuery`).[cite: 12]

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology | Usage / Purpose |
| :--- | :--- | :--- |
| **Framework & Build** | `React 18` + `Vite` | Fast HMR, ESM bundling, and component composition |
| **Language** | `TypeScript` | Full type safety across components, RTK APIs, and forms |
| **UI Component System** | `Material UI v7` (`@mui/material`) | Data tables, layout grids, side drawers, popovers, icons |
| **State & Cache** | `Redux Toolkit` + `RTK Query` | Global state (`authSlice`), API caching, invalidation tags |
| **Forms & Validation** | `react-hook-form` + `zod` | Declarative form validation, error handling, and runtime safety |
| **Data Visualization** | `Recharts` | Interactive line, bar, and responsive metric performance charts |
| **Routing** | `React Router v6` | SPA routing, protected path guards, sub-view navigation |

---

## 📁 Project Structure

```text
src/
├── Components/
│   ├── ActionsMenu/
│   │   └── ActionsMenu.tsx        # Reusable table row actions menu (View, Edit, Delete)
│   ├── Auth/
│   │   ├── Login.tsx               # Login form view with Zod validation & visibility toggler
│   │   └── ProtectedRoute.tsx      # Auth route guard wrapper component
│   ├── Categories/
│   │   ├── Categories.tsx          # Category table view, search & pagination logic
│   │   ├── CategoryDrawer.tsx      # Slide-out drawer for adding/editing categories
│   │   └── viewCatProd.tsx         # Category-specific product drill-down list
│   ├── Customers/
│   │   ├── Customers.tsx           # Customer management table & filter tools
│   │   └── CustomerDrawer.tsx      # Customer edit drawer form
│   ├── Home/
│   │   └── Home.tsx                # Main dashboard analytics & summary charts
│   ├── Layout/
│   │   └── Layout.tsx              # Application layout container wrapper
│   ├── NavBar/
│   │   ├── Navbar.tsx              # Adaptive navigation drawer & top menu bar
│   │   └── ThemeToggleButton.tsx   # Light/Dark mode color scheme switcher
│   ├── NotFound/
│   │   └── NotFound.tsx            # 404 Not Found fallback view
│   └── Products/
│       └── ProductDrawer.tsx       # Form drawer for product creation/editing
├── Store/
│   ├── api/                        # RTK Query API slice definitions
│   │   ├── authApi.ts              # Authentication endpoints
│   │   ├── categoryApi.ts          # Category CRUD endpoints
│   │   ├── customersApi.ts         # Customer endpoints
│   │   └── productsApi.ts          # Product management endpoints
│   ├── Slices/
│   │   └── authSlice.ts            # Auth credentials & token state management
│   └── Store.ts                    # Redux root store configuration & custom hooks
├── App.tsx                         # Top-level application routes tree
└── main.tsx                        # Application entry point & provider wrappers
