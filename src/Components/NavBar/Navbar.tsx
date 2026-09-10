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
  useMediaQuery,
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
import theme from "../../Theme.tsx";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: DashboardOutlined },
  { label: "Products", path: "/products", icon: Inventory2Outlined },
  { label: "Orders", path: "/orders", icon: ShoppingCartOutlined },
  { label: "Customers", path: "/customers", icon: PeopleAltOutlined },
  { label: "Categories", path: "/categories", icon: LocalOfferOutlined },
  // { label: "Analytics", path: "/analytics", icon: BarChartOutlined },
  // { label: "Settings", path: "/settings", icon: SettingsOutlined },
];

interface NavbarProps {
  open: boolean;
  onToggle: () => void;
}

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function Navbar({ open, onToggle }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const isActivePath = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  // Use a compact horizontal navigation on smaller screens.
  if (!isDesktop) {
    return (
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          height: 56,
          px: 1.5,
          bgcolor: "background.paper",
          color: "text.secondary",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            width: 32,
            height: 32,
            flexShrink: 0,
          }}
        >
          <ShoppingBag fontSize="small" />
        </Avatar>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexGrow: 1,
            justifyContent: "center",
            overflowX: "auto",
            px: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <Tooltip key={item.path} title={item.label} arrow>
                <IconButton
                  onClick={() => navigate(item.path)}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    bgcolor: isActive ? "primary.main" : "transparent",
                    color: isActive ? "primary.contrastText" : "text.secondary",
                    "&:hover": {
                      bgcolor: isActive ? "primary.dark" : "action.hover",
                      color: isActive ? "primary.contrastText" : "text.primary",
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <ThemeToggleButton />

          <Tooltip title="Sign Out" arrow>
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "error.main",
                },
              }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }

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
      {/* Brand and sidebar collapse control */}
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

      <List sx={{ flexGrow: 1, p: 0 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);

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
                    "& .MuiListItemIcon-root": {
                      color: "text.primary",
                    },
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

      {/* Theme toggle, sign out, and sidebar expand controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          flexDirection: open ? "row" : "column",
          gap: open ? 0 : 1,
          pt: 1,
          px: open ? 1 : 0,
        }}
      >
        <Tooltip title={!open ? "Sign Out" : ""} placement="right" arrow>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              flex: open ? "1 1 auto" : "0 0 auto",
              height: 40,
              borderRadius: 1.5,
              px: open ? 2 : 1.5,
              justifyContent: open ? "flex-start" : "center",
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
                color: "error.main",
                "& .MuiListItemIcon-root": {
                  color: "error.main",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 0,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <Logout fontSize="small" />
            </ListItemIcon>

            {open && (
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Sign Out
                  </Typography>
                }
              />
            )}
          </ListItemButton>
        </Tooltip>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            flexDirection: open ? "row" : "column",
          }}
        >
          <ThemeToggleButton />

          {!open && (
            <Tooltip title="Expand Sidebar" placement="right" arrow>
              <IconButton
                onClick={onToggle}
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}
