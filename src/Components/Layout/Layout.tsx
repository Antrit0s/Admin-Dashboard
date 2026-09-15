import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Navbar from "../NavBar/Navbar.tsx";
import PagePdfExportButton from "../PagePdfExportButton/PagePdfExportButton.tsx";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainContentRef = useRef<HTMLElement>(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        minHeight: "100vh",
      }}
    >
      <Navbar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <Box
        ref={mainContentRef}
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

      <PagePdfExportButton targetRef={mainContentRef} />
    </Box>
  );
}
