import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Tooltip from "@mui/material/Tooltip";
export function ThemeToggleButton() {
  const { mode, systemMode, setMode } = useColorScheme();
  if (!mode) return null;
  const currentMode = mode === "system" ? systemMode : mode;
  const isDark = currentMode === "dark";
  const handleToggle = () => {
    setMode(isDark ? "light" : "dark");
  };
  return (
    <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
      <IconButton
        onClick={handleToggle}
        size="small"
        sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
      >
        {isDark ? (
          <LightModeOutlinedIcon fontSize="small" />
        ) : (
          <DarkModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
