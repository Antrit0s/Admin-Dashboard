# 📊 Enterprise Admin Dashboard

A modern, high-performance E-Commerce & Analytics Admin Dashboard built with **React**, **TypeScript**, **Redux Toolkit (RTK Query)**, and **Vite**. Designed with an emphasis on type safety, scalable state architecture, optimistic caching, and responsive UI components.

---

## 🚀 Live Demo & Test Credentials

- **Frontend Deployment (Vercel):** [https://admin-dashboard-antrit0s.vercel.app](https://admin-dashboard-antrit0s.vercel.app)
- **Mock REST API Backend (Render):** [https://admin-dashboard-api.onrender.com](https://admin-dashboard-api.onrender.com)

### 🔑 Demo Login Credentials
| Field | Value |
| :--- | :--- |
| **Username / Email** | `admin` |
| **Password** | `admin` |

> **Note on Free-Tier Hosting:** On initial launch, the Render free-tier backend may take ~30–50 seconds to spin up from sleep mode. Subsequent requests will be instantaneous.

---

## ✨ Features

- **🔐 Authentication & Session Flow:**
  - Token-based authentication stored in `localStorage`.
  - Automated `prepareHeaders` middleware injecting `Bearer <token>` on all outbound API requests.
  - Route guards preventing unauthorized navigation to protected dashboard paths.

- **📦 Comprehensive Product Management (CRUD):**
  - Interactive data tables with sorting, filtering, and pagination.
  - Slide-out drawer/modal workflows for real-time item creation and updates.
  - Cache invalidation and optimistic updates powered by RTK Query `tagTypes` (`Products`, `Categories`, `Orders`, `Users`, `Customers`, `Analytics`).

- **📈 Analytics & Business Insights:**
  - High-level metric KPI cards (Revenue, Orders, Conversion Rates).
  - Dynamic interactive charts and performance breakdown summaries.

- **🎨 UI & Theming System:**
  - Fully responsive, mobile-first administrative navigation and drawer layouts.
  - Centralized theme provider for consistent typography, colors, and elevations.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Runtime / Library** | `React` + `TypeScript` | Static type guarantees and component composition |
| **Build Tool** | `Vite` | Ultra-fast HMR and ESM bundling |
| **State Management** | `Redux Toolkit` | Centralized slices (`authSlice`, UI state) |
| **Data Fetching / Cache** | `RTK Query` (`apiSlice`) | Automated caching, background refetching, and tag-based invalidation |
| **Routing** | `React Router` | Dynamic routing with SPA fallback redirects via `vercel.json` |
| **Mock Backend** | `json-server` | Full REST API emulation serving relational mock data (`db.json`) |
| **Hosting & CI/CD** | `Vercel` + `Render` | Automated branch deployments via GitHub integrations |

---

## 📁 Project Structure

```text
Admin-Dashboard/
├── public/
├── src/
│   ├── assets/              # Static assets, vector icons, images
│   ├── Components/
│   │   ├── Auth/            # Sign-in / registration forms & guards
│   │   ├── Home/            # Dashboard analytics, KPI widgets, summary charts
│   │   ├── Layout/          # Master dashboard layout wrapper
│   │   ├── NavBar/          # Navigation, user profile menu, breadcrumbs
│   │   ├── NotFound/        # 404 fallback page
│   │   └── Products/        # Product list, item mutations, drawer forms
│   ├── Store/
│   │   ├── api/
│   │   │   └── apiSlice.ts  # Central RTK Query entry point & baseQuery setup
│   │   ├── Slices/
│   │   │   └── authSlice.ts # Redux auth state slice
│   │   └── Store.ts         # Root Redux store configuration
│   ├── App.tsx              # Application route tree
│   ├── main.tsx             # DOM mounting & Redux Provider injection
│   ├── Theme.tsx            # Theme provider definitions
│   └── vite-env.d.ts        # Ambient environment variable declarations
├── db.json                  # Relational mock database structure
├── vercel.json              # SPA rewrite rules for direct browser routing
├── tsconfig.json            # Base TypeScript configuration
├── tsconfig.app.json        # Frontend application compiler options & type refs
└── package.json             # Scripts & dependency definitions
```

---

## 🎬 Inspiration

This project was inspired by this YouTube tutorial series:
[https://youtu.be/wYpCWwD1oz0?list=PLEYW3pZS6IQ_a-iYAno4VsZonrikphq8L](https://youtu.be/wYpCWwD1oz0?list=PLEYW3pZS6IQ_a-iYAno4VsZonrikphq8L)
