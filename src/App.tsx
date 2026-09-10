import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Components/Layout/Layout.tsx";
import Home from "./Components/Home/Home.tsx";
import ProtectedRoute from "./Components/Auth/ProtectedRoute.tsx";
import NotFound from "./Components/NotFound/NotFound.tsx";
import Login from "./Components/Auth/Login.tsx";

import Products from "./Components/Products/Products.tsx";
import ProductDetails from "./Components/Products/ProductDetails.tsx";

import Orders from "./Components/Orders/Orders.tsx";
import CreateOrder from "./Components/Orders/CreateOrder.tsx";
import EditOrder from "./Components/Orders/EditOrder.tsx";

import Categories from "./Components/Categories/Categories.tsx";
import Customers from "./Components/Customers/Customers.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: "products", element: <Products /> },
          { path: "products/:id", element: <ProductDetails /> },
          { path: "orders", element: <Orders /> },
          { path: "orders/new", element: <CreateOrder /> },
          { path: "orders/:id/edit", element: <EditOrder /> },
          { path: "categories", element: <Categories /> },
          { path: "customers", element: <Customers /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
