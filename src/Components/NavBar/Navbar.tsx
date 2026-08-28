import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  BarChartOutlined,
  ChevronLeft,
  ChevronRight,
  DashboardOutlined,
  Inventory2Outlined,
  LocalOfferOutlined,
  Logout,
  PeopleAltOutlined,
  SettingsOutlined,
  ShoppingBag,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggleButton } from "./ThemeToggleButton.tsx";
import { useAppDispatch } from "../../Store/Store.ts";
import { logout } from "../../Store/Slices/authSlice.ts";
const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: DashboardOutlined },
  { label: "Products", path: "/products", icon: Inventory2Outlined },
  { label: "Orders", path: "/orders", icon: ShoppingCartOutlined },
  { label: "Customers", path: "/customers", icon: PeopleAltOutlined },
  { label: "Categories", path: "/categories", icon: LocalOfferOutlined },
  { label: "Analytics", path: "/analytics", icon: BarChartOutlined },
  { label: "Settings", path: "/settings", icon: SettingsOutlined },
];

interface Navbarprops {
  open: boolean;
  onToggle: () => void;
}
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function Navbar({ open, onToggle }: Navbarprops) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  return (
    <Box
      sx={{
        width: open ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        minWidth: open ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        height: "100vh",
        bgcolor: "background.paper",
        color: "text.secondary",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        p: 2,
        transition: "width 0.2s ease",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        boxSizing: "border-box",
      }}
    >
      {/* brand logo and collapse toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          mb: 3,
          minHeight: 40,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            overflow: "hidden",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              width: 36,
              height: 36,
              flexShrink: 0,
            }}
          >
            <ShoppingBag fontSize="small" />
          </Avatar>
          {open && (
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              Store Admin
            </Typography>
          )}
        </Box>
        {open && (
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, p: 0 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            // making sure that home root not styled permenantly and nested path are also making it active
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Tooltip
              key={item.path}
              title={!open ? item.label : ""}
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  px: open ? 2 : 1.5,
                  justifyContent: open ? "initial" : "center",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                  "&:hover:not(.Mui-selected)": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                    "& .MuiListItemIcon-root": { color: "text.primary" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>

                {open && (
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 600 : 500,
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
      {/* sign out */}
      <Tooltip title={!open ? "sign out" : ""} placement="right" arrow>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            flex: "0 0 auto",
            height: "auto",
            borderRadius: 1.5,
            mb: 1,
            px: open ? 2 : 1.5,
            justifyContent: open ? "initial" : "center",
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
              color: "error.main",
              "& .MuiListItemIcon-root": { color: "error.main" },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : "auto",
              justifyContent: "center",
              color: "inherit",
            }}
          >
            <Logout fontSize="small" />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  sign out
                </Typography>
              }
            />
          )}
        </ListItemButton>
      </Tooltip>

      {/* themtoggler */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          pt: 1,
        }}
      >
        <ThemeToggleButton />
        {!open && (
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
