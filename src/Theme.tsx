import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#4f46e5" },
        secondary: { main: "#34d399" },
        background: { default: "#f8fafc", paper: "#ffffff" },
        text: { primary: "#1e293b", secondary: "#64748b" },
        divider: "#e2e8f0",
      },
    },
    dark: {
      palette: {
        primary: { main: "#4f46e5" },
        secondary: { main: "#34d399" },
        background: { default: "#0b1220", paper: "#0f172a" },
        text: { primary: "#e2e8f0", secondary: "#94a3b8" },
        divider: "#ffffff14",
      },
    },
  },
  shape: { borderRadius: 8 },
});
export default theme;
