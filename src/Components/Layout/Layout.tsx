import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Navbar from "../NavBar/Navbar.tsx";
import { useState } from "react";
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      {/* main content of website  */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: 3,
          bgcolor: "background.default",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
