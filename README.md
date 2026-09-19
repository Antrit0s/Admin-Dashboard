# 📊 Enterprise Admin Dashboard

A modern E-Commerce & Analytics admin dashboard built with **React 19**, **TypeScript**, **Material UI**, **Redux Toolkit (RTK Query)** and **Vite**. Focus: type safety, scalable state architecture, cached data fetching, and a responsive UI.

---

## 🚀 Live Demo

- **Frontend (Vercel):** <https://admin-dashboard-seven-mu-48.vercel.app>
- **Mock REST API (Render):** <https://admin-dashboard-api.onrender.com>

### 🔑 Demo Login

| Field                | Value   |
| -------------------- | ------- |
| **Username / Email** | `admin` |
| **Password**         | `admin` |

> **Free-tier note:** the Render backend sleeps when idle. First request can take ~30–50 seconds. After that it is fast.

---

## ✨ Features

- **🔐 Authentication**
  - Token-based auth stored in `localStorage`
  - `prepareHeaders` injects `Bearer <token>` into every API request
  - Route guards protect dashboard pages

- **📦 Product Management (CRUD)**
  - Data tables with sorting, filtering and pagination
  - Drawer/modal forms to create and update items
  - Form validation with React Hook Form + Zod
  - Cache invalidation via RTK Query `tagTypes` (`Products`, `Categories`, `Orders`, `Users`, `Customers`, `Analytics`)

- **📈 Analytics**
  - KPI cards (revenue, orders, conversion rate)
  - Interactive charts and summary breakdowns

- **🧾 Invoice PDF Export**
  - Export an order invoice as a PDF (`jspdf`, `jspdf-autotable`)
  - Line items rendered as a table inside the PDF

- **🖼️ Product Image Export**
  - Capture a product card/view as an image (`html-to-image`, `html2canvas`)
  - Download the generated image directly from the browser

- **📊 Excel Export**
  - Export table data to `.xlsx` (`xlsx`)

- **🎨 UI & Theming**
  - Responsive, mobile-first layout and navigation drawer
  - Central theme provider for consistent typography, colors, elevation

---

## 🛠️ Tech Stack

| Layer                | Technology                                   | Purpose                                          |
| -------------------- | -------------------------------------------- | ------------------------------------------------ |
| UI library           | `React 19` + `TypeScript`                    | Typed component composition                      |
| Components           | `MUI` (`@mui/material`, Data Grid, X Charts) | Layout, tables, charts, icons                    |
| Build tool           | `Vite`                                       | Fast HMR and bundling                            |
| State                | `Redux Toolkit`                              | Slices (`authSlice`, UI state)                   |
| Data fetching        | `RTK Query` (`apiSlice`)                     | Caching, refetching, tag-based invalidation      |
| Routing              | `React Router` v7                            | Client-side routing, SPA fallback via `vercel.json` |
| Forms & validation   | `React Hook Form` + `Zod`                    | Typed forms and schema validation                |
| Charts               | `MUI X Charts` + `Recharts`                  | Dashboard visualizations                         |
| Mock backend         | `json-server`                                | REST API served from `db.json`                   |
| Hosting              | `Vercel` + `Render`                          | Frontend + mock API deployment                   |

---

## 📁 Project Structure

```
Admin-Dashboard/
├── public/
├── src/
│   ├── assets/              # Static assets, icons, images
│   ├── Components/
│   │   ├── Auth/            # Sign-in forms & route guards
│   │   ├── Home/            # Dashboard KPIs and charts
│   │   ├── Layout/          # Main dashboard layout wrapper
│   │   ├── NavBar/          # Navigation, profile menu, breadcrumbs
│   │   ├── NotFound/        # 404 page
│   │   └── Products/        # Product list, mutations, drawer forms
│   ├── Store/
│   │   ├── api/
│   │   │   └── apiSlice.ts  # RTK Query entry point & baseQuery
│   │   ├── Slices/
│   │   │   └── authSlice.ts # Auth state slice
│   │   └── Store.ts         # Root Redux store
│   ├── App.tsx              # Route tree
│   ├── main.tsx             # DOM mount + Redux Provider
│   ├── Theme.tsx            # Theme provider
│   └── vite-env.d.ts        # Env variable typings
├── db.json                  # Mock database
├── vercel.json              # SPA rewrite rules
├── tsconfig*.json           # TypeScript configs
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ (latest LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/Antrit0s/Admin-Dashboard.git
cd Admin-Dashboard
npm install
```

### Run locally

Start frontend and mock API together:

```bash
npm run dev:all
```

Or run them separately:

```bash
npm run dev      # Vite dev server
npm run server   # json-server on db.json
```

Log in with `admin` / `admin`.

### Scripts

| Script            | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start Vite dev server                        |
| `npm run server`  | Start `json-server` using `db.json`          |
| `npm run dev:all` | Run dev server and mock API concurrently     |
| `npm run build`   | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build                 |
| `npm run lint`    | Run ESLint                                   |

---

## 🌐 Deployment

- **Frontend:** Vercel. `vercel.json` rewrites all routes to `index.html` so direct URLs and refreshes work with React Router.
- **Mock API:** Render, running `json-server` against `db.json`.

---

## 🎬 Inspiration

Inspired by this YouTube tutorial series: <https://youtu.be/wYpCWwD1oz0?list=PLEYW3pZS6IQ_a-iYAno4VsZonrikphq8L>

---
