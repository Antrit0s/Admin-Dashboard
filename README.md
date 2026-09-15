<div align="center">

# 📊 Enterprise Admin Dashboard

**A high-performance, responsive E-Commerce & Analytics Admin Dashboard built with React 18, TypeScript, Redux Toolkit (RTK Query), and Material UI (MUI v7).**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material UI](https://img.shields.io/badge/MUI_v7-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://admin-dashboard-seven-mu-48.vercel.app/)

[🚀 View Live Demo](https://admin-dashboard-seven-mu-48.vercel.app/) • [📡 Backend API](https://admin-dashboard-api.onrender.com) • [🐛 Report Bug](https://github.com/Antrit0s/Admin-Dashboard/issues)

</div>

---

## 🌐 Live Demo & Credentials

* **Frontend URL:** [admin-dashboard-seven-mu-48.vercel.app](https://admin-dashboard-seven-mu-48.vercel.app/)
* **Mock REST Backend:** [admin-dashboard-api.onrender.com](https://admin-dashboard-api.onrender.com)

### 🔑 Test Access

| Field | Value |
| :--- | :--- |
| **Username** | `admin` |
| **Password** | `admin` |

> ℹ️ **Hosting Note (Cold Starts):** The API is hosted on Render's free tier. The first request may experience a ~30–50 second delay while the server wakes from sleep. Subsequent requests will respond immediately.

---

## ✨ Key Features

### 📈 Business Analytics & Reporting (`Home.tsx`)
* **KPI Metrics:** Executive performance cards for Total Revenue, Active Orders, Customer Base, and Stock Levels.
* **Interactive Charts (Recharts):** Responsive time-series line, bar, and area charts with customized mobile-friendly axis tick rendering.
* **Excel Data Export:** One-click automated export of sales data into styled `.xlsx` spreadsheets (powered by SheetJS).

### 🔐 Authentication & Security (`ProtectedRoute.tsx`)
* Token-based session management managed through Redux Toolkit (`authSlice`).
* Strict schema validation powered by **Zod** and **React Hook Form**.
* Persistent route protection redirecting unauthenticated users while maintaining return path memory (`location.state`).

### 📦 Taxonomy & Category Management (`Categories.tsx`, `viewCatProd.tsx`)
* Full CRUD lifecycle with automatic slugification.
* Slide-out inline form drawer (`CategoryDrawer.tsx`) to avoid disruptive page reloads.
* Category-to-Product drill-down views displaying linked inventory per category.

### 👥 Customer Management (`Customers.tsx`)
* Search, real-time filtering, and paginated customer records.
* Dedicated edit drawer (`CustomerDrawer.tsx`) for customer profiles, registration dates, and account statuses.

### 🎨 Theming & Modern UI/UX
* **Light / Dark Mode:** Instant theme switching using MUI's `@mui/material/styles` (`useColorScheme`).
* **Responsive Layout:** Adaptive sidebar drawer navigation with collapse/expand support across mobile, tablet, and widescreen displays.

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Core** | `React 18` + `Vite` | Fast build toolchain, ESM support, and modular component hierarchy |
| **Type Safety** | `TypeScript` | End-to-end type integrity across APIs, state, and UI props |
| **UI Components** | `Material UI v7` (`@mui/material`) | System grids, surfaces, dialogs, drawers, and theme engine |
| **State & Cache** | `Redux Toolkit` + `RTK Query` | Global state slices, automatic caching, and tag invalidation |
| **Forms** | `react-hook-form` + `zod` | Performant form controls with declarative schema validation |
| **Visualization** | `Recharts` | Fluid SVG charts with responsive resize containers |
| **Spreadsheet Export**| `xlsx` (SheetJS) | Client-side Excel workbook and worksheet generation |
| **Routing** | `React Router DOM v6` | Declarative SPA routing and route guards |

---

## 📁 Repository Structure

```text
src/
├── Components/
│   ├── ActionsMenu/        # Reusable table row action dropdown (View, Edit, Delete)
│   ├── Auth/               # Login page & ProtectedRoute guard
│   ├── Categories/         # Category table, CategoryDrawer, and category product view
│   ├── Customers/          # Customer table & CustomerDrawer
│   ├── Home/               # Analytics cards, charts, and Excel export
│   ├── Layout/             # Dashboard shell and responsive sidebar
│   ├── NavBar/             # Header bar and Light/Dark theme toggle
│   ├── NotFound/           # 404 error boundary page
│   └── Products/           # Product edit/create drawer
├── Store/
│   ├── api/                # RTK Query API slice endpoints
│   │   ├── authApi.ts
│   │   ├── categoryApi.ts
│   │   ├── customersApi.ts
│   │   └── productsApi.ts
│   ├── Slices/
│   │   └── authSlice.ts    # Authentication token and user credentials state
│   └── Store.ts            # Central Redux store configuration
├── App.tsx                 # Route tree definitions
└── main.tsx                # Application bootstrap with providers