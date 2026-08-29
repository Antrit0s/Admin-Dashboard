import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout.tsx";
import Home from "./Components/Home/Home.tsx";
import ProtectedRoute from "./Components/Auth/ProtectedRoute.tsx";
import NotFound from "./Components/NotFound/NotFound.tsx";
import Login from "./Components/Auth/Login.tsx";
import Products from "./Components/Products/Products.tsx";
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        path: "",
        children: [
          { index: true, element: <Home /> },
          { path: "products", element: <Products /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    
      <RouterProvider router={router} />
    
  );
}

export default App;
